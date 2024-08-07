package routes

import (
    "Backend/handlers"
    "github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
    app.Get("/fetch-products", handlers.FetchProducts)
	app.Get("/get-products", handlers.GetProducts)
    app.Delete("/del-products/:id", handlers.DeleteProduct)
    app.Put("/update-products/:id", handlers.UpdateProduct)
    app.Post("/add-products", handlers.AddProduct)
    
}
