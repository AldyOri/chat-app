package controllers

// import (
// 	"backend/config"
// 	"backend/models"
// 	"backend/models/dto"
// 	"backend/utils"
// 	"net/http"
// 	"strconv"

// 	"github.com/labstack/echo/v4"
// )

// func GetMessages(c echo.Context) error {
// 	roomId := c.Param("id")
// 	var messages []models.Message
// 	if err := config.DB.Where("room_id = ?", roomId).Find(&messages).Error; err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{
// 			"message": "failed to retrieve messages",
// 		})
// 	}

// 	return c.JSON(http.StatusOK, dto.Response{
// 		Message: "success",
// 		Data:    messages,
// 	})
// }

// func SendMessages(c echo.Context) error {
// 	userID := utils.GetUserID(c)

// 	roomId, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		return echo.NewHTTPError(http.StatusBadRequest, "invalid room id")
// 	}
	
// 	var message models.Message
// 	if err := c.Bind(&message); err != nil {
// 		return c.JSON(http.StatusBadRequest, map[string]string{
// 			"message": "invalid input",
// 		})
// 	}

// 	message.SenderID = userID
// 	message.RoomID = uint(roomId)

// 	if err := config.DB.Create(&message).Error; err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{
// 			"message": "failed to send message",
// 		})
// 	}

// 	return c.JSON(http.StatusCreated, dto.Response{
// 		Message: "message sent successfully",
// 		Data:    message,
// 	})
// }
