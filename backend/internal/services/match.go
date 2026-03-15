package services

import (
	"math"
	"strings"
	"unicode"
)

// UserNode represents a user in the skill swap graph.
// For şimdi, skills are kept as free-form text slices instead of normalized tags.
type UserNode struct {
	ID              string
	Name            string
	Email           string
	ProfilePhoto    string
	Bio             string
	Rating          float64
	CompletedSwaps  int
	SkillsOwned     []string
	SkillsWanted    []string
}

// MatchResult represents a potential match between the incoming user and another user.
type MatchResult struct {
	Target UserNode
	// Score is a percentage between 0 and 100.
	Score float64
}

// Graph holds all users as nodes. In a richer implementation this might include
// adjacency lists or more advanced structures, but a flat slice is enough for now.
type Graph struct {
	Users []UserNode
}

// NewGraph constructs a new Graph from a list of users.
func NewGraph(users []UserNode) *Graph {
	return &Graph{Users: users}
}

// OutEdge represents a directed edge: From node offers a skill that To node wants.
type OutEdge struct {
	ToID  string
	Skill string
}

// DirectedGraph is a directed graph: nodes = users, edges = "A can teach B (skill)".
type DirectedGraph struct {
	Nodes map[string]UserNode            // node ID -> user
	Edges map[string][]OutEdge          // node ID -> outgoing edges
}

// TripleCycleMatch describes a 3-person swap circle A -> B -> C -> A for the frontend.
type TripleCycleMatch struct {
	Description  string       `json:"description"`
	ParticipantNames []string `json:"participantNames"`
	Steps        []CycleStep `json:"steps"`
}

// CycleStep is one leg of the swap: From teaches To the Skill.
type CycleStep struct {
	FromName string `json:"fromName"`
	ToName   string `json:"toName"`
	Skill    string `json:"skill"`
}

// BuildDirectedGraph builds a directed graph from all users (including incoming).
// Edge A -> B with skill S means: A has skill S and B wants S (A can teach B).
// If incoming.ID is empty, it is given the temporary ID "incoming" in the graph only.
func BuildDirectedGraph(allUsers []UserNode, incoming UserNode) *DirectedGraph {
	nodes := make(map[string]UserNode)
	edges := make(map[string][]OutEdge)

	incomingID := incoming.ID
	if incomingID == "" {
		incomingID = "incoming"
		incomingCopy := incoming
		incomingCopy.ID = incomingID
		nodes[incomingID] = incomingCopy
	} else {
		nodes[incomingID] = incoming
	}

	for _, u := range allUsers {
		if u.ID == "" {
			continue
		}
		nodes[u.ID] = u
	}

	// All nodes: incoming + existing users
	allNodes := make([]UserNode, 0, len(nodes))
	for _, u := range nodes {
		allNodes = append(allNodes, u)
	}

	for _, from := range allNodes {
		fromID := from.ID
		if fromID == "" {
			continue
		}
		for _, to := range allNodes {
			if to.ID == fromID {
				continue
			}
			skill := skillThatAMatchesForB(from.SkillsOwned, to.SkillsWanted)
			if skill != "" {
				edges[fromID] = append(edges[fromID], OutEdge{ToID: to.ID, Skill: skill})
			}
		}
	}

	return &DirectedGraph{Nodes: nodes, Edges: edges}
}

// skillThatAMatchesForB returns one skill token from owned that matches something in wanted (for edge label).
func skillThatAMatchesForB(owned []string, wanted []string) string {
	sourceTokens := normalizeTokens(owned)
	targetTokens := normalizeTokens(wanted)
	for _, s := range sourceTokens {
		for _, t := range targetTokens {
			if tokenSimilarity(s, t) > 0 {
				return s
			}
		}
	}
	return ""
}

// FindTripleCyclesContaining finds all 3-cycles (A -> B -> C -> A) that contain the node startID.
// Uses the idea: for each neighbor B of startID, for each neighbor C of B, if C has an edge back to startID, we have a 3-cycle.
func (dg *DirectedGraph) FindTripleCyclesContaining(startID string) []TripleCycleMatch {
	var results []TripleCycleMatch
	startNode, ok := dg.Nodes[startID]
	if !ok {
		return results
	}

	outFromStart := dg.Edges[startID]
	for _, e1 := range outFromStart {
		midID := e1.ToID
		midNode, ok := dg.Nodes[midID]
		if !ok {
			continue
		}
		skill1 := e1.Skill

		for _, e2 := range dg.Edges[midID] {
			thirdID := e2.ToID
			if thirdID == startID {
				continue
			}
			thirdNode, ok := dg.Nodes[thirdID]
			if !ok {
				continue
			}
			skill2 := e2.Skill

			// Check if third has edge back to startID
			for _, e3 := range dg.Edges[thirdID] {
				if e3.ToID != startID {
					continue
				}
				skill3 := e3.Skill

				// Build human-readable description (Turkish)
				startName := startNode.Name
				if startID == "incoming" {
					startName = "Sen"
				}
				desc := "Üçlü Takas Önerisi: " + startName + " " + midNode.Name + "'e " + skill1 + " öğreteceksin, " +
					midNode.Name + " " + thirdNode.Name + "'e " + skill2 + " öğretecek, " +
					thirdNode.Name + " de sana " + skill3 + " öğretecek."

				results = append(results, TripleCycleMatch{
					Description: desc,
					ParticipantNames: []string{startName, midNode.Name, thirdNode.Name},
					Steps: []CycleStep{
						{FromName: startName, ToName: midNode.Name, Skill: skill1},
						{FromName: midNode.Name, ToName: thirdNode.Name, Skill: skill2},
						{FromName: thirdNode.Name, ToName: startName, Skill: skill3},
					},
				})
				break
			}
		}
	}
	return results
}

// FindBestMatches computes a match score for the given incoming user against
// all existing users in the graph and returns a slice of MatchResult sorted by score descending.
//
// The scoring is deliberately simple and text-based:
// - We treat skills as case-insensitive tokens.
// - For each pair (A, B) we compute:
//   * how much of A.Owned matches B.Wanted
//   * how much of A.Wanted matches B.Owned
// - The final score is the average of these two directional scores, scaled to [0, 100].
func (g *Graph) FindBestMatches(incoming UserNode) []MatchResult {
	var results []MatchResult

	for _, existing := range g.Users {
		if existing.ID == incoming.ID && existing.ID != "" {
			continue
		}

		ownedToWanted := directionalSkillScore(incoming.SkillsOwned, existing.SkillsWanted)
		wantedToOwned := directionalSkillScore(incoming.SkillsWanted, existing.SkillsOwned)

		score := (ownedToWanted + wantedToOwned) / 2.0
		results = append(results, MatchResult{
			Target: existing,
			Score:  score,
		})
	}

	// Simple insertion sort by score descending since typical match lists will be small.
	for i := 1; i < len(results); i++ {
		j := i
		for j > 0 && results[j-1].Score < results[j].Score {
			results[j-1], results[j] = results[j], results[j-1]
			j--
		}
	}

	return results
}

// directionalSkillScore computes how well "source" skills satisfy "target" skills.
// It returns a percentage in [0, 100].
func directionalSkillScore(source []string, target []string) float64 {
	if len(source) == 0 || len(target) == 0 {
		return 0
	}

	sourceTokens := normalizeTokens(source)
	targetTokens := normalizeTokens(target)

	if len(sourceTokens) == 0 || len(targetTokens) == 0 {
		return 0
	}

	var total float64

	for _, t := range targetTokens {
		var bestForTarget float64
		for _, s := range sourceTokens {
			sim := tokenSimilarity(s, t)
			if sim > bestForTarget {
				bestForTarget = sim
			}
		}
		total += bestForTarget
	}

	avg := total / float64(len(targetTokens))
	return math.Round(avg * 100)
}

// normalizeTokens splits free-form skill strings into lowercased keyword tokens.
// It is aware of common separators like commas, semicolons and whitespace,
// and trims basic punctuation so that values like "react," and "react" eşleşebilir.
func normalizeTokens(values []string) []string {
	var tokens []string
	for _, v := range values {
		lower := strings.ToLower(v)

		parts := strings.FieldsFunc(lower, func(r rune) bool {
			if unicode.IsSpace(r) {
				return true
			}
			switch r {
			case ',', ';', '|', '/', '&':
				return true
			default:
				return false
			}
		})

		for _, part := range parts {
			part = strings.TrimSpace(part)
			part = strings.Trim(part, ".!?")
			if part != "" {
				tokens = append(tokens, part)
			}
		}
	}
	return tokens
}

// tokenSimilarity is a simple similarity function between two tokens.
// - 1.0 for exact match
// - 0.7 if one token contains the other as a substring (ör. "react" vs "reactjs")
// - 0.0 otherwise
func tokenSimilarity(a, b string) float64 {
	if a == "" || b == "" {
		return 0
	}

	if a == b {
		return 1.0
	}

	if strings.Contains(a, b) || strings.Contains(b, a) {
		return 0.7
	}

	return 0.0
}

