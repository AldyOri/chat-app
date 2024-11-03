package dto

import "time"

type RoomResponse struct {
	ID        uint           `json:"id"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"created_at"`
	Users     []UserResponse `json:"users"`
}
