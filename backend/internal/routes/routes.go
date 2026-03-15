package routes

import (
	"net/http"

	"workshop-backend/internal/controllers"
)

func Register(mux *http.ServeMux) {
	mux.HandleFunc("/users", controllers.HandleCreateUser)
	mux.HandleFunc("/matches/respond", controllers.HandleMatchRespond)
}

