package controllers

import (
	"backend/config"
	"backend/models"
	"backend/models/dto"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func CreateRoom(c echo.Context) error {
	var room models.Room
	if err := c.Bind(&room); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid input",
		})
	}

	if err := config.DB.Create(&room).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create room",
		})
	}

	return c.JSON(http.StatusCreated, dto.Response{
		Message: "room created successfully",
		Data:    room,
	})
}

func GetRooms(c echo.Context) error {
	var rooms []models.Room
	if err := config.DB.Preload("Users").Find(&rooms).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to retrieve rooms",
		})
	}

	var roomResponses []dto.RoomResponse
	for _, room := range rooms {
		var users []dto.UserResponse
		for _, u := range room.Users {
			users = append(users, dto.UserResponse{
				ID:       u.ID,
				Username: u.Username,
				Email:    u.Email,
			})
		}
		roomResponses = append(roomResponses, dto.RoomResponse{
			ID:        room.ID,
			Name:      room.Name,
			CreatedAt: room.CreatedAt,
			Users:     users,
		})
	}

	return c.JSON(http.StatusOK, dto.Response{
		Message: "success",
		Data:    roomResponses,
	})
}

func GetRoomById(c echo.Context) error {
	roomIdStr := c.Param("id")
	roomId, err := strconv.ParseUint(roomIdStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid room id",
		})
	}

	var room models.Room
	if err := config.DB.Preload("Users").First(&room, roomId).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"message": "room not found",
		})
	}

	var users []dto.UserResponse
	for _, u := range room.Users {
		users = append(users, dto.UserResponse{
			ID:       u.ID,
			Username: u.Username,
			Email:    u.Email,
		})
	}

	return c.JSON(http.StatusOK, dto.Response{
		Message: "success",
		Data: dto.RoomResponse{
			ID:        room.ID,
			Name:      room.Name,
			CreatedAt: room.CreatedAt,
			Users:     users,
		},
	})
}

func JoinRoom(c echo.Context) error {
	userID := utils.GetUserID(c)
	roomIdStr := c.Param("id")
	roomId, err := strconv.ParseUint(roomIdStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid room id",
		})
	}

	isInRoom, err := IsUserInRoom(userID, uint(roomId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to check room membership",
		})
	}

	if isInRoom {
		return c.JSON(http.StatusConflict, map[string]string{
			"message": "user already in room",
		})
	}

	var room models.Room
	if err := config.DB.First(&room, roomId).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"message": "room not found",
		})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"message": "user not found",
		})
	}

	if err := config.DB.Model(&room).Association("Users").Find(&user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to check room membership",
		})
	}

	if err := config.DB.Model(&room).Association("Users").Append(&user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to join room",
		})
	}

	return c.JSON(http.StatusOK, dto.Response{
		Message: "joined room successfully",
		Data:    room,
	})
}

func LeaveRoom(c echo.Context) error {
    userID := utils.GetUserID(c)
    roomIdStr := c.Param("id")
    roomId, err := strconv.ParseUint(roomIdStr, 10, 32)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{
            "message": "invalid room id",
        })
    }

    isInRoom, err := IsUserInRoom(userID, uint(roomId))
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{
            "message": "failed to check room membership",
        })
    }

    if !isInRoom {
        return c.JSON(http.StatusConflict, map[string]string{
            "message": "user not in room",
        })
    }

    var room models.Room
    if err := config.DB.First(&room, roomId).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{
            "message": "room not found",
        })
    }

    var user models.User
    if err := config.DB.First(&user, userID).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{
            "message": "user not found",
        })
    }

    if err := config.DB.Model(&room).Association("Users").Delete(&user); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{
            "message": "failed to leave room",
        })
    }

    return c.JSON(http.StatusOK, dto.Response{
        Message: "left room successfully",
        Data:    room,
    })
}

func IsUserInRoom(userID uint, roomID uint) (bool, error) {
	var count int64
	err := config.DB.Table("user_rooms").Where("user_id = ? AND room_id = ?", userID, roomID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
