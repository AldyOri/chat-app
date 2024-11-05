package utils

import (
	"backend/config"
	"backend/models"
	"errors"
	"os"

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

func VerifyToken(tokenString string) (uint, string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return 0, "", errors.New("JWT secret not set")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return 0, "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := uint(claims["user_id"].(float64))
		username := claims["username"].(string)
		return userID, username, nil
	}

	return 0, "", errors.New("invalid token")
}
