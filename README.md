# CampusConnect 🎓

**A Professional Resource & Event Management Platform for Campus Communities**

CampusConnect is a modern, unified full-stack web platform designed to solve daily friction points for college students. It provides a clean, highly accessible, and minimal interface for managing campus life.

- 🔍 **Lost & Found Board** — Efficiently report and locate lost items across the campus.
- 📅 **Event Announcements** — Discover upcoming college events and manage RSVPs.
- 📚 **Study Material Sharing** — Upload, organize, and download notes, assignments, and references.
- 🔐 **Role-based Access Control** — Secure separation of privileges between Students and Administrators.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication**| JWT (JSON Web Tokens) via localStorage |
| **File Storage** | Cloudinary (PDF + Image hosting) |
| **State Mgt.** | React Context API |
| **UI Components** | Lucide-React Icons, react-hot-toast |

---

## 🎨 Design System

CampusConnect strictly adheres to a modern, flat, and minimalist design language:
- **Typography:** Inter (Google Fonts)
- **Palette:** `#1E1B4B` (Deep Indigo), `#4F46E5` (Primary Indigo), `#F59E0B` (Amber Accent)
- **Backgrounds:** Clean `#F8FAFC` (Slate 50) app background with `#FFFFFF` solid cards.
- **Components:** Fully pill-shaped buttons, crisp `0.5px` borders, zero drop-shadows, and high-legibility contrast.

---

## 📁 Project Architecture

```
campusconnect/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── api/              # Axios instance & endpoints
│   │   ├── components/       # Reusable UI architecture
│   │   ├── context/          # Global Context (Auth)
│   │   ├── pages/            # Application routes
│   │   └── utils/            # Helper functions
├── server/                   # Express REST API
│   ├── config/               # Database & Cloudinary config
│   ├── controllers/          # Core business logic
│   ├── middleware/           # Auth, Admin validation, Multer
│   ├── models/               # Mongoose schemas
│   └── routes/               # API endpoint routing
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file in both the `/server` and `/client` directories before running the application.

### Server (`/server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Client (`/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/campusconnect.git
cd campusconnect

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Start the Application
You can run the entire stack concurrently from the root directory:
```bash
# From the root folder (campusconnect/)
npm install
npm run dev
```
*(This starts the Express server on port 5000 and the Vite frontend on port 5173).*



---

## 🔒 Role-Based Permissions

| Feature | Student | Admin |
|---|---|---|
| View Boards & Materials | ✅ | ✅ |
| Post Lost & Found Items | ✅ | ✅ |
| Claim/Resolve Items | ✅ (Own items only) | ✅ (All items) |
| Create/Edit/Delete Events | ❌ | ✅ |
| RSVP to Events | ✅ | ✅ |
| Upload Study Materials | ✅ | ✅ |
| Global Content Deletion | ❌ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Open a Pull Request

---
*Built for modern campus communities.*
