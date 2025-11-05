# Real-Time Chat App with Socket.IO

A **full-stack, real-time chat application** featuring:
- Live messaging with **typing indicators**
- **Multiple chat rooms** (`#general`, `#random`, `#tech`)
- **Private messaging**
- **File & image sharing**
- **Online/offline user status**
- **JWT authentication**
- **Responsive UI** with Tailwind CSS

Built with **MERN Stack + Socket.IO** and designed for **performance, security, and scalability**.

---

## Features

| Feature | Status |
|-------|--------|
| Real-time messaging | Done |
| Multiple chat rooms | Done |
| Private 1-on-1 chat | Done |
| File/image upload | Done |
| Typing indicators | Done |
| Online/offline status | Done |
| JWT authentication | Done |
| Message notifications | Done |
| Responsive design | Done |
| Reconnection handling | Done |

---

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **Socket.IO Client**
- **Tailwind CSS**
- **Lucide Icons**
- **Axios**

### Backend
- **Node.js** + **Express**
- **Socket.IO Server**
- **MongoDB** + **Mongoose**
- **JWT** for auth
- **bcryptjs** for password hashing
- **multer** for file uploads

---

## Project Structure
realtime-chat-app/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/auth.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── ChatApp.jsx
│   │   ├── components/
│   │   ├── socket.js
│   │   └── App.jsx
│   └── tailwind.config.js
└── .env

text

Collapse

Wrap

Copy
---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/real-time-chat-app.git
cd real-time-chat-app
2. Install Dependencies
Backend
bash

Collapse

Wrap

Run

Copy
cd backend
npm install
Frontend
bash

Collapse

Wrap

Run

Copy
cd ../frontend
npm install
3. Environment Variables
Create .env in backend/:

env

Collapse

Wrap

Copy
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatdb
JWT_SECRET=your_very_secure_jwt_secret_key_here_12345
Never commit .env to GitHub!

4. Start MongoDB
bash

Collapse

Wrap

Run

Copy
mongod
5. Run the App
Start Backend
bash

Collapse

Wrap

Run

Copy
cd backend
npm run dev
Server runs on http://localhost:5000

Start Frontend
bash

Collapse

Wrap

Run

Copy
cd frontend
npm run dev
App runs on http://localhost:5173

Usage
Register a new account
Login with credentials
Join a room (#general, #random, #tech)
Start chatting in real-time!
Send files, see typing indicators, and watch users go online/offline
Authentication
Register: POST /api/auth/register
Login: POST /api/auth/login
Token stored in localStorage
JWT validated on every Socket.IO connection
Socket.IO Events

Event	Direction	Payload
join-room	Client → Server	{ room: "general" }
send-message	Client → Server	{ room, message, type, file }
receive-message	Server → Client	{ id, sender, message, timestamp }
typing	Client ↔ Server	{ room, isTyping }
user-online	Server → All	{ userId, username }
notification	Server → Room	"User joined"
File Upload
Click paperclip icon
Select image/file
Uploaded to /uploads
Accessible via /uploads/filename
Security
Passwords hashed with bcrypt (12 rounds)
JWT with 7-day expiry
Input validation & sanitization
CORS configured
Duplicate username prevention
Deployment
Option 1: Render (Free)
Backend: Node.js
Frontend: Static (Vite build)
MongoDB: MongoDB Atlas
Option 2: Railway / Vercel + Atlas
API Endpoints

Method	Route	Description
POST	/api/auth/register	Create user
POST	/api/auth/login	Authenticate
POST	/upload	Upload file
Troubleshooting

Issue	Fix
Unauthorized in console	Check localStorage.token and JWT_SECRET
No messages appear	Open 2+ tabs, ensure socket is connected
File not showing	Check /uploads folder permissions
MongoDB not connecting	Run mongod and check MONGO_URI
Contributing
Fork the repo
Create your feature branch (git checkout -b feature/amazing)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing)
Open a Pull Request