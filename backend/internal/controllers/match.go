package controllers

import (
	"encoding/json"
	"net/http"
)

type MatchRespondRequest struct {
	MatchID  string `json:"matchId"`
	Decision string `json:"decision"` // "accepted" or "rejected"
}

type MatchRespondResponse struct {
	Message string `json:"message"`
}

func HandleMatchRespond(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Message: "Bu endpoint sadece POST isteğini destekler.",
		})
		return
	}

	var req MatchRespondRequest

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

	if req.MatchID == "" || req.Decision == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Message: "matchId ve decision alanları zorunludur.",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(MatchRespondResponse{
		Message: "Eşleşme yanıtın başarıyla kaydedildi.",
	})
}

