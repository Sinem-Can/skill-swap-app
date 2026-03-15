package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"
	"workshop-backend/internal/routes"
)

func main() {
	mux := http.NewServeMux()
	routes.Register(mux)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := corsHandler.Handler(mux)

	addr := ":8080"
	log.Printf("Starting HTTP server on %s\n", addr)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("server exited with error: %v", err)
	}
}

