package handlers

import (
    "Backend/database"
    "Backend/models"
    "encoding/json"
    "github.com/gofiber/fiber/v2"
    "net/http"
    "time"
    "log"
)

// FetchProducts ดึงข้อมูลสินค้าจาก API และบันทึกลงฐานข้อมูล
func FetchProducts(c *fiber.Ctx) error {
    // ลบข้อมูลทั้งหมดในตาราง products
    if err := database.DB.Exec("DELETE FROM products").Error; err != nil {
        return c.Status(500).SendString(err.Error())
    }

    // ดึงข้อมูลสินค้าจาก API
    resp, err := http.Get("https://dummyjson.com/products")
    if err != nil {
        return c.Status(500).SendString(err.Error())
    }
    defer resp.Body.Close()

    // แปลงข้อมูล JSON ที่ได้จาก API เป็นโครงสร้างข้อมูล
    var result struct {
        Products []models.Product `json:"products"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return c.Status(500).SendString(err.Error())
    }

    // บันทึกข้อมูลสินค้าลงฐานข้อมูล
    for _, product := range result.Products {
        database.DB.Create(&product)
    }

    return c.SendString("Products fetched and stored successfully")
}

// GetProducts ดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล
func GetProducts(c *fiber.Ctx) error {
    var products []models.Product
    if err := database.DB.Find(&products).Error; err != nil {
        return c.Status(500).SendString(err.Error())
    }
    return c.JSON(products)
}

// DeleteProduct ลบข้อมูลสินค้าออกจากฐานข้อมูล
func DeleteProduct(c *fiber.Ctx) error {
    id := c.Params("id")
    var product models.Product

    if err := database.DB.First(&product, id).Error; err != nil {
        return c.Status(404).SendString("Product not found")
    }

    if err := database.DB.Delete(&product).Error; err != nil {
        return c.Status(500).SendString("Error deleting product")
    }

    return c.SendString("Product deleted successfully")
}

// UpdateProduct อัปเดตข้อมูลสินค้าในฐานข้อมูล
func UpdateProduct(c *fiber.Ctx) error {
    id := c.Params("id")
    var product models.Product

    if err := database.DB.First(&product, id).Error; err != nil {
        return c.Status(404).SendString("Product not found")
    }

    if err := c.BodyParser(&product); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    if err := database.DB.Save(&product).Error; err != nil {
        return c.Status(500).SendString("Error updating product")
    }

    return c.JSON(product)
}

// AddProduct เพิ่มข้อมูลสินค้าใหม่ในฐานข้อมูล
func AddProduct(c *fiber.Ctx) error {
    var product models.Product

    if err := c.BodyParser(&product); err != nil {
        log.Println("BodyParser error:", err)
        return c.Status(400).SendString("Invalid input")
    }

    product.CreatedAt = time.Now()
    product.UpdatedAt = time.Now()

    if err := database.DB.Create(&product).Error; err != nil {
        log.Println("Database error:", err)
        return c.Status(500).SendString("Error creating product")
    }

    return c.JSON(product)
}