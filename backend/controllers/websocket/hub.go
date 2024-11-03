package websocket

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Message struct {
	Content  []byte
	SenderID uint
}

type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan Message
	Register   chan *Client
	Unregister chan *Client
	mutex      sync.Mutex
}

type Client struct {
	ID   uint
	Room uint
	Conn *websocket.Conn
	Send chan []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mutex.Lock()
			h.Clients[client] = true
			h.mutex.Unlock()

		case client := <-h.Unregister:
			h.mutex.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}
			h.mutex.Unlock()

		case message := <-h.Broadcast:
			h.mutex.Lock()
			for client := range h.Clients {
				if client.ID == message.SenderID {
					continue
				}
				select {
				case client.Send <- message.Content:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			h.mutex.Unlock()
		}
	}
}
