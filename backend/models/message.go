package models

import "time"

type Message struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Content   string    `json:"content" gorm:"not null;type:text"`
	SenderID  uint      `json:"sender_id" gorm:"not null"`
	RoomID    uint      `json:"room_id" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}
