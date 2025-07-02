# CodeCraft 🚀

An AI-powered code generation platform that enables users to create full-stack web applications through natural language prompts. Built with Next.js, FastAPI, and Google's Gemini AI.

## 🌟 Features

### Core Functionality
- **AI Code Generation**: Generate complete React applications using natural language prompts
- **Real-time Code Editor**: Interactive code editor with live preview using Sandpack
- **Project Management**: Create, save, and manage multiple projects
- **Chat Interface**: Conversational AI for iterative code improvements
- **File Management**: Organize and edit project files with syntax highlighting
- **Live Preview**: Instant preview of generated applications
- **Export Projects**: Download projects as ZIP files

### Technical Features
- **Authentication**: Secure user authentication with Clerk
- **Database**: Real-time data synchronization with Convex
- **AI Integration**: Google Gemini 2.0 Flash for code generation
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and Framer Motion
- **Type Safety**: Full TypeScript support across frontend and backend

## 🏗️ Project Structure

```
CodeCraft2/
├── codecraft-backend/          # FastAPI Backend
│   ├── endpoints/              # API route handlers
│   │   ├── projects.py         # Project-related endpoints
│   │   └── user_endpoints.py   # User management endpoints
│   ├── models/                 # Pydantic models
│   │   ├── ai_model.py         # Google Gemini AI integration
│   │   ├── project.py          # Project data models
│   │   └── user.py             # User data models
│   ├── services/               # Business logic
│   │   ├── project_service.py  # Project operations
│   │   └── user_service.py     # User operations
│   ├── main.py                 # FastAPI application entry point
│   └── requirements.txt        # Python dependencies
│
└── codecraft-frontend/         # Next.js Frontend
    ├── src/
    │   ├── app/                # Next.js App Router
    │   │   ├── create/         # Project creation page
    │   │   ├── workspace/      # Project workspace
    │   │   ├── layout.tsx      # Root layout
    │   │   └── page.tsx        # Home page
    │   ├── components/         # React components
    │   │   ├── CreateInterface.tsx  # Main creation interface
    │   │   ├── Header.tsx      # Navigation header
    │   │   ├── HeroSection.tsx # Landing page hero
    │   │   └── ui/             # Reusable UI components
    │   ├── hooks/              # Custom React hooks
    │   ├── services/           # API communication
    │   └── providers/          # Context providers
    ├── convex/                 # Convex database functions
    │   ├── schema.ts           # Database schema
    │   ├── users.ts            # User operations
    │   └── projects.ts         # Project operations
    └── package.json            # Node.js dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Bun** (recommended) or npm/yarn
- **Google Gemini API Key**
- **Clerk Account** (for authentication)
- **Convex Account** (for database)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd codecraft-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment variables**
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   CONVEX_URL=your_convex_deployment_url
   CONVEX_DEPLOYMENT=your_convex_deployment_name
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd codecraft-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   CONVEX_DEPLOYMENT=your_convex_deployment_name
   ```

4. **Set up Convex**
   ```bash
   bunx convex dev
   # or
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Running Both Services

For development, you can run both frontend and backend simultaneously:

```bash
# In the frontend directory
bun run dev:all
```

This will start both the Next.js development server and Convex in watch mode.

## 🔧 Configuration

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the key to your backend `.env` file as `GEMINI_API_KEY`

### Clerk Authentication Setup

1. Create an account at [Clerk](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys to your frontend `.env.local` file

### Convex Database Setup

1. Create an account at [Convex](https://convex.dev)
2. Create a new project
3. Run `bunx convex dev` in the frontend directory
4. Follow the setup instructions to link your project

## 📚 API Documentation

### Backend Endpoints

#### Projects
- `POST /api/projects/generate` - Generate code from prompt
- `POST /api/projects/create` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `POST /api/projects/{id}/chat` - Send chat message

#### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/{clerk_id}` - Get user by Clerk ID
- `GET /api/users/` - Get all users (admin)

### Database Schema

#### Users Table
- `clerkId`: String (unique identifier from Clerk)
- `email`: String
- `firstName`: Optional string
- `lastName`: Optional string
- `imageUrl`: Optional string
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Projects Table
- `name`: String
- `description`: Optional string
- `userId`: Reference to users table
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Project Files Table
- `projectId`: Reference to projects table
- `path`: String (file path)
- `content`: String (file content)
- `language`: String (programming language)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Chat Messages Table
- `projectId`: Reference to projects table
- `role`: "user" | "assistant"
- `content`: String
- `timestamp`: Timestamp
- `userId`: Optional reference to users table

## 🛠️ Development

### Code Generation Process

1. User enters a natural language prompt
2. Frontend sends request to backend `/api/projects/generate`
3. Backend processes prompt using Google Gemini AI
4. AI returns structured JSON with project files
5. Backend converts response to project format
6. Frontend receives generated code and displays in editor
7. User can iterate with chat messages for improvements

### Key Technologies

**Frontend:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Clerk (authentication)
- Convex (database)
- Sandpack (code editor)
- Lucide React (icons)

**Backend:**
- FastAPI
- Python 3.8+
- Google Generative AI (Gemini)
- Pydantic (data validation)
- HTTPX (HTTP client)
- Uvicorn (ASGI server)

## 🚀 Deployment

### Backend Deployment (Vercel)

1. Push your backend code to a Git repository
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Frontend Deployment (Vercel)

1. Push your frontend code to a Git repository
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database Deployment (Convex)

1. Run `bunx convex deploy` in the frontend directory
2. Update environment variables to use production Convex URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful code generation
- [Clerk](https://clerk.com) for seamless authentication
- [Convex](https://convex.dev) for real-time database
- [Sandpack](https://sandpack.codesandbox.io/) for the code editor
- [Vercel](https://vercel.com) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](#-api-documentation)
2. Search existing [issues](https://github.com/your-username/codecraft/issues)
3. Create a new issue if needed

---

**Built with ❤️ by the CodeCraft team**