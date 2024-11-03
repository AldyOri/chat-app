package models

import "time"

type Room struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"unique;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	Users     []User    `json:"users" gorm:"many2many:user_rooms"`
}
