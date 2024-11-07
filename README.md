# Real-Time Chat Application

This project is a real-time chat application that demonstrates the use of several modern web technologies for both the backend and frontend. The application supports HTTP-based communication as well as WebSocket for real-time messaging.

## Technologies Used

### Backend
- **Go** - Core backend language
- **Echo** - Web framework for creating HTTP endpoints
- **GORM** - ORM for database interactions
- **PostgreSQL** - Database for storing user and message data
- **JWT** - For user authentication and authorization
- **HTTP/TCP** - Communication protocol for REST API
- **WebSocket** - For real-time messaging between clients

### Frontend
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Adds type safety to JavaScript
- **Vite** - Bundler for faster development

## Getting Started

These instructions will help you set up and run the project locally using Docker and Docker Compose.

### Prerequisites

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Environment Configuration**

   Copy the `.env.example` file to create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   The default settings in `.env.example` are:

   ```plaintext
   DB_HOST=postgres
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=chat-app
   DB_PORT=5432
   JWT_SECRET=24931305ff447a0e631b03a11cf73e8c8a4d8cf4d52de50b3e66f391d5e7ee5e1cfa4fae1d05b6df0cbc395c366b45d2b42ef8bd74e0c9b975792b6bf7a78d9f

   API_URL=http://localhost:8000  # keep the port at 8000
   WS_URL=ws://localhost:8000     # keep the port at 8000
   ```

   **If you need to access the application from another device on the same network**:
   
   - Replace `localhost` with the IP address of the machine running Docker.
   - To find your IP address:
     - **On Windows**: Open a Command Prompt and run `ipconfig`. Look for the IPv4 address in your network adapter settings.
     - **On Linux/macOS**: Open a terminal and run `ip addr` and look for your device's IP address under the active network interface.
   - Update your `.env` file with the IP address, for example:

     ```plaintext
     API_URL=http://192.168.1.100:8000
     WS_URL=ws://192.168.1.100:8000
     ```

3. **Build and Run the Containers**

   Use Docker Compose to build and run the project:

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Start a PostgreSQL database container.
   - Build and start the Go backend server on port `8000`.
   - Build and start the React frontend on port `3000`.

4. **Access the Application**

   - **Frontend**: On the machine running Docker, open a browser and go to [http://localhost:3000](http://localhost:3000). On another device, use `http://<host-IP>:3000` (replace `<host-IP>` with your machine's IP).
   - **Backend API**: Available at [http://localhost:8000](http://localhost:8000) locally or `http://<host-IP>:8000` from another device.

### Directory Structure

```plaintext
.
├── backend                 # Backend source code
│   ├── main.go             # Main entry point of the Go application
│   ├── controllers/        # API endpoint handlers
│   ├── models/             # Database models
│   └── ...                 # Other backend files
├── frontend                # Frontend source code
│   ├── src/
│   ├── public/
│   └── ...                 # Other frontend files
├── docker-compose.yml      # Docker Compose configuration file
└── .env.example            # Example environment variables
```

### Notes
- To access the backend from the frontend, make sure the `API_URL` and `WS_URL` in `.env` are configured with either `localhost` (for local use) or the IP address of the host machine.
- If using a different machine, ensure that the ports `8000` and `3000` are open on the host firewall for network access.

--- 

### Screenshoots
