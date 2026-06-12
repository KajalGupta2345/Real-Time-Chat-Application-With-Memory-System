# 🤖 Real-Time AI Chatbot With Memory System

A production-ready **MERN-based conversational AI platform** with dual-memory architecture — combining short-term (MongoDB) and long-term (Pinecone vector database) memory for truly contextual, multi-turn AI conversations.

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React.js-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-blue?style=flat)](https://pinecone.io/)

---

## ✨ Features

- 🧠 **Dual Memory System** — Short-term (MongoDB) + Long-term (Pinecone) memory for context-aware responses
- 🔍 **RAG (Retrieval-Augmented Generation)** — Semantic search over past conversations using vector embeddings
- ⚡ **Real-Time Messaging** — Bi-directional communication via Socket.IO WebSockets
- 🔐 **Secure Auth** — JWT-based session authentication with secure HTTP-only cookies
- 🎨 **Responsive UI** — Clean, mobile-friendly interface built with React.js & Tailwind CSS

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React.js)                  │
│              Tailwind CSS · Socket.IO Client            │
└──────────────────────┬──────────────────────────────────┘
                       │  WebSocket + REST API
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER (Node.js + Express)             │
│         Socket.IO · JWT Auth · Cookie Sessions          │
└──────┬───────────────┬──────────────────┬───────────────┘
       │               │                  │
  ┌────▼────┐    ┌──────▼──────┐   ┌──────▼──────┐
  │ MongoDB │    │   Pinecone  │   │  AI / LLM   │
  │         │    │  Vector DB  │   │   (Gemini)  │
  │ Short-  │    │  Long-term  │   │             │
  │  term   │    │   Memory    │   │  RAG Engine │
  │ Memory  │    │  + Embeds   │   │             │
  └─────────┘    └─────────────┘   └─────────────┘
```

### Memory Flow
```
User Message
     │
     ▼
Embed message → Search Pinecone (semantic similarity)
     │
     ▼
Retrieve relevant past context (long-term memory)
     │
     ▼
Fetch recent messages from MongoDB (short-term memory)
     │
     ▼
Build prompt = [long-term context] + [recent history] + [new message]
     │
     ▼
LLM generates response → Store in MongoDB + Pinecone
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB (short-term memory) |
| **Vector DB** | Pinecone (long-term memory + RAG) |
| **Auth** | JWT + HTTP-only Cookies |
| **AI** | Google Gemini API (or OpenAI) |
| **Real-Time** | WebSockets via Socket.IO |

---

## 📁 Project Structure

```
Real-Time-Chat-Application-With-Memory-System/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB, Pinecone, AI config
│   │   ├── controllers/     # Auth & chat controllers
│   │   ├── models/          # Mongoose schemas (User, Message)
│   │   ├── routes/          # Express route handlers
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── socket/          # Socket.IO event handlers
│   │   ├── services/        # RAG logic, embedding service
│   │   └── index.js         # Entry point
│   ├── .env.example
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Chat UI, MessageBubble, Sidebar
│   │   ├── pages/           # Login, Register, Chat
│   │   ├── context/         # Auth & Socket context
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Pinecone account — [pinecone.io](https://pinecone.io)
- Google Gemini API key — [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/KajalGupta2345/Real-Time-Chat-Application-With-Memory-System.git
cd Real-Time-Chat-Application-With-Memory-System
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=chat-memory

GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

```
http://localhost:5173
```

---

## 🔑 Key Technical Highlights

### 🧠 RAG Memory System
Unlike basic chatbots that lose context, this app stores every conversation as **vector embeddings** in Pinecone. When a user sends a message, the system semantically searches past conversations and injects the most relevant context into the AI prompt — enabling the bot to "remember" things said weeks ago.

### ⚡ Real-Time with Socket.IO
Messages are delivered instantly using **WebSocket connections** via Socket.IO. No polling, no refresh needed — true bi-directional communication between client and server.

### 🔐 JWT + Cookie Auth
Sessions are managed using **JWT tokens stored in HTTP-only cookies** — preventing XSS attacks while keeping authentication stateless and scalable.

---

## 📸 Screenshots

> _Add screenshots of your app here_
>
> Example: Login page, Chat interface, AI responding with memory context

---

## 🌐 Live Demo

> _Coming soon / Deploy link here_

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Kajal Kumari**

[![GitHub](https://img.shields.io/badge/GitHub-KajalGupta2345-181717?style=flat&logo=github)](https://github.com/KajalGupta2345)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kajal--kumari-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/kajal-kumari-357b85253/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-orange?style=flat)](https://kajalgupta2345.github.io/Portfolio-Website/)

---

> ⭐ If you found this project useful, please consider giving it a star!
