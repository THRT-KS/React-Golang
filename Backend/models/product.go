package models

import "time"

type Product struct {
    ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Price       float64   `json:"price"`
    Rating      float64   `json:"rating"`
    Stock       int       `json:"stock"`
    CreatedAt   time.Time `json:"createdAt"`
    UpdatedAt   time.Time `json:"updatedAt"`
}
