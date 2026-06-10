# 🤖 AI Chatbot – PDF RAG Assistant

An AI-powered chatbot that allows users to upload PDF documents and ask questions about their content. The application uses **Retrieval-Augmented Generation (RAG)** with **Google Gemini AI** and **Qdrant Vector Database** to provide accurate, context-aware responses from uploaded PDFs.

---

## 🚀 Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDFs
- ✂️ Intelligent text chunking
- 🧠 Generate embeddings using Gemini AI
- 📚 Store embeddings in Qdrant Vector Database
- 💬 Chat with uploaded PDFs
- ⚡ Fast semantic search and retrieval
- 🎨 Modern and responsive UI
- 🌐 REST API integration
- 🔒 Secure environment configuration

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Icons

### Backend
- Node.js
- Express.js
- Multer
- PDF-Parse

### AI & Database
- Google Gemini AI
- Gemini Embeddings API
- Qdrant Vector Database

---

## 📂 Project Structure

```bash
AI-Chatbot/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── redux/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

### Step 1: Upload PDF
Users upload a PDF document through the web interface.

### Step 2: Text Extraction
The backend extracts text from the PDF using `pdf-parse`.

### Step 3: Chunking
The extracted content is divided into smaller chunks for efficient processing.

### Step 4: Embedding Generation
Each chunk is converted into vector embeddings using Google's Gemini Embedding Model.

### Step 5: Store in Qdrant
The embeddings are stored in Qdrant Vector Database for semantic search.

### Step 6: Ask Questions
Users can ask questions related to the uploaded document.

### Step 7: Retrieval-Augmented Generation
Relevant chunks are retrieved from Qdrant and sent to Gemini AI to generate accurate answers.

---

## 🔧 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/AI-Chatbot.git
cd AI-Chatbot
```

---

## Backend Setup

```bash
cd backend
npm install
```

### Create .env File

```env
PORT=5001

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

QDRANT_URL=YOUR_QDRANT_URL

QDRANT_API_KEY=YOUR_QDRANT_API_KEY
```

### Run Backend

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5001
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

### Create .env.local

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 📡 API Endpoints

### Upload PDF

```http
POST /upload
```

#### Form Data

```bash
file: PDF
```

#### Response

```json
{
  "message": "PDF uploaded and processed successfully"
}
```

---

### Chat Endpoint

```http
POST /chat
```

#### Request

```json
{
  "message": "Summarize this document"
}
```

#### Response

```json
{
  "reply": "The document discusses..."
}
```

---

## 🎯 Key Highlights

- Retrieval-Augmented Generation (RAG)
- Vector Search with Qdrant
- Gemini AI Integration
- PDF Knowledge Assistant
- Semantic Search
- Scalable Architecture
- Modern UI/UX

---

## 📸 Screenshots

Add your project screenshots here:

```md
![Home Page](screenshots/home.png)

![PDF Upload](screenshots/upload.png)

![Chat Interface](screenshots/chat.png)
```

---

## 🔮 Future Enhancements

- Multiple PDF Support
- Chat History Storage
- User Authentication
- Source References in Answers
- PDF Page Number Citations
- Real-Time Streaming Responses
- Dark Mode Support
- Export Chat Conversations

---

