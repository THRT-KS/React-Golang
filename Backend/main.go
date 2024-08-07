package main

import (
	"Backend/database"
	"Backend/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	app := fiber.New()
	// Enable CORS
	app.Use(cors.New())
	routes.Setup(app)
	app.Listen(":3000")
}
