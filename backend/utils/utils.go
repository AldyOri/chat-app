package utils

import (
	"backend/config"
	"backend/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func GetUserID(c echo.Context) uint {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["user_id"].(float64)

	return uint(userID)
}

func GetUsername(c echo.Context) string {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	username := claims["username"].(string)

	return username
}

func IsRoomExists(roomId uint) (bool, error) {
	var room models.Room
	if err := config.DB.First(&room, roomId).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}
	return true, nil
}
