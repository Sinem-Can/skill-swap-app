package controllers

import (
	"encoding/json"
	"net/http"

	"workshop-backend/internal/services"
)

type CreateUserRequest struct {
	Name           string   `json:"name"`
	Email          string   `json:"email"`
	SkillsOwned    string   `json:"skillsOwned"`
	SkillsWanted   string   `json:"skillsWanted"`
	ProfilePhoto   string   `json:"profilePhoto,omitempty"`   // URL
	Bio            string   `json:"bio,omitempty"`
	Rating         *float64 `json:"rating,omitempty"`         // Varsayılan 5.0
	CompletedSwaps *int     `json:"completedSwaps,omitempty"` // Varsayılan 0
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type CreateUserResponse struct {
	Message      string                       `json:"message"`
	Matches      []MatchedResult              `json:"matches"`
	TripleCycles []services.TripleCycleMatch  `json:"tripleCycles"`
}

type MatchedResult struct {
	ID              string   `json:"id"`
	Name            string   `json:"name"`
	Email           string   `json:"email"`
	ProfilePhoto    string   `json:"profilePhoto,omitempty"`
	Bio             string   `json:"bio,omitempty"`
	Rating          float64  `json:"rating,omitempty"`
	CompletedSwaps  int     `json:"completedSwaps,omitempty"`
	SkillsOwned     []string `json:"skillsOwned"`
	SkillsWanted    []string `json:"skillsWanted"`
	Score           float64  `json:"score"`
}

func HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Message: "Bu endpoint sadece POST isteğini destekler.",
		})
		return
	}

	var req CreateUserRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Message: "Geçersiz istek gövdesi. Lütfen alanları kontrol et.",
		})
		return
	}

	if req.Name == "" || req.Email == "" || req.SkillsOwned == "" || req.SkillsWanted == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Message: "Tüm alanların doldurulması zorunludur.",
		})
		return
	}

	// TODO: Persist the profile to a database or in-memory store.

	rating := 5.0
	if req.Rating != nil {
		rating = *req.Rating
	}
	completedSwaps := 0
	if req.CompletedSwaps != nil {
		completedSwaps = *req.CompletedSwaps
	}

	newUser := services.UserNode{
		ID:             "", // In a real implementation this would be the new persisted ID.
		Name:           req.Name,
		Email:           req.Email,
		ProfilePhoto:   req.ProfilePhoto,
		Bio:            req.Bio,
		Rating:         rating,
		CompletedSwaps: completedSwaps,
		SkillsOwned:    []string{req.SkillsOwned},
		SkillsWanted:   []string{req.SkillsWanted},
	}

	// Mock existing users for matching purposes.
	existingUsers := []services.UserNode{
		{
			ID:             "u1",
			Name:           "Deniz",
			Email:          "deniz@example.com",
			ProfilePhoto:   "",
			Bio:            "",
			Rating:         5.0,
			CompletedSwaps: 0,
			SkillsOwned:    []string{"react", "typescript", "frontend"},
			SkillsWanted:   []string{"go backend", "system design"},
		},
		{
			ID:             "u2",
			Name:           "Mert",
			Email:          "mert@example.com",
			ProfilePhoto:   "",
			Bio:            "",
			Rating:         5.0,
			CompletedSwaps: 0,
			SkillsOwned:    []string{"go", "microservices", "api design"},
			SkillsWanted:   []string{"react", "typescript"},
		},
		{
			ID:             "u3",
			Name:           "Ece",
			Email:          "ece@example.com",
			ProfilePhoto:   "",
			Bio:            "",
			Rating:         5.0,
			CompletedSwaps: 0,
			SkillsOwned:    []string{"data analysis", "python"},
			SkillsWanted:   []string{"product management", "system design"},
		},
	}

	graph := services.NewGraph(existingUsers)
	matchResults := graph.FindBestMatches(newUser)

	var matches []MatchedResult
	for _, m := range matchResults {
		matches = append(matches, MatchedResult{
			ID:             m.Target.ID,
			Name:           m.Target.Name,
			Email:          m.Target.Email,
			ProfilePhoto:   m.Target.ProfilePhoto,
			Bio:            m.Target.Bio,
			Rating:         m.Target.Rating,
			CompletedSwaps: m.Target.CompletedSwaps,
			SkillsOwned:    m.Target.SkillsOwned,
			SkillsWanted:   m.Target.SkillsWanted,
			Score:          m.Score,
		})
	}

	// Yönlü graf kur; yeni kullanıcının içinde olduğu 3'lü takas çemberlerini (A→B→C→A) bul ve yanıta ekle.
	directedGraph := services.BuildDirectedGraph(existingUsers, newUser)
	tripleCycles := directedGraph.FindTripleCyclesContaining("incoming")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(CreateUserResponse{
		Message:      "Profil başarıyla kaydedildi.",
		Matches:      matches,
		TripleCycles: tripleCycles,
	})
}

