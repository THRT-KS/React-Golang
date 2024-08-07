package database

import (
    "Backend/models"
    "log"

    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func Connect() {
    var err error
    // เชื่อมต่อกับฐานข้อมูล PostgreSQL
    DB, err = gorm.Open("postgres", "host=localhost user=postgres dbname=productdb sslmode=disable password=39615")
    if err != nil {
        // ถ้าเชื่อมต่อไม่สำเร็จ ให้แสดงข้อความผิดพลาดและหยุดการทำงาน
        log.Fatal("Failed to connect to database:", err)
    }
    // เปิดโหมดการบันทึก log
    DB.LogMode(true)

    // ทำการ Auto Migrate สำหรับ model Product
    DB.AutoMigrate(&models.Product{})
}