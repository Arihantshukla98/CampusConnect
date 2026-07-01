<div align="center">

<img src="https://img.shields.io/badge/CampusConnect-1E1B4B?style=for-the-badge&logoColor=white" alt="CampusConnect" />

# CampusConnect 🎓
### A Unified Resource & Event Management Platform for Campus Communities

[![Live Demo](https://img.shields.io/badge/Live%20Demo-campus--connect--one--indol.vercel.app-4F46E5?style=flat-square&logo=vercel&logoColor=white)](https://campus-connect-one-indol.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

> **CampusConnect** eliminates the daily friction of college life — lost items, event discovery, and scattered study materials — by bringing everything into one clean, fast, role-aware platform.

<br/>

[🌐 View Live](https://campus-connect-one-indol.vercel.app/) · [🐛 Report a Bug](mailto:arihantshukla24@gmail.com) · [✨ Request a Feature](https://forms.gle/e3Jv5ZEzk6PkHe3p6)

</div>

---

## 📸 Overview

CampusConnect is a full-stack MERN application built to solve four real problems faced by students every day:

| Module | What it solves |
|---|---|
| 🔍 **Lost & Found Board** | Report lost items, claim found ones, and track resolution status — all in one board |
| 📅 **Event Announcements** | Admins post events; students discover and RSVP with one click |
| 📚 **Study Material Hub** | Upload, organize, and download notes by subject, branch, and semester |
| 🔐 **Role-Based Access** | Students and Admins have cleanly separated privileges with JWT-secured routes |

---

## 🌐 Live Demo

**→ [campus-connect-one-indol.vercel.app](https://campus-connect-one-indol.vercel.app/)**

You can explore the platform by creating a free student account directly on the live site.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Storage** | Cloudinary — PDF & image hosting |
| **State Management** | React Context API |
| **UI** | Lucide React Icons, react-hot-toast |

---

## 🎨 Design System

CampusConnect follows a strict flat, minimal design language — no gradients, no heavy shadows.

| Token | Value |
|---|---|
| **Font** | Inter (Google Fonts) |
| **Primary Dark** | `#1E1B4B` — navbar, deep accents |
| **Primary Indigo** | `#4F46E5` — buttons, links, active states |
| **Amber Accent** | `#F59E0B` — event dates, highlights |
| **App Background** | `#F8FAFC` — clean slate surface |
| **Card Surface** | `#FFFFFF` — flat white, 0.5px borders |
| **Border Style** | `0.5px solid #E2E8F0` — no drop shadows |

---

## 📁 Project Structure

```
campusconnect/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api/              # Axios instance & API endpoint functions
│       ├── components/       # Reusable UI (Navbar, Cards, Badges, Modals)
│       ├── context/          # AuthContext — global user state
│       ├── pages/            # Route-level pages
│       │   ├── Auth/         # Login, Signup
│       │   ├── LostFound/    # Board, PostItem, ItemDetail
│       │   ├── Events/       # EventBoard, EventDetail, CreateEvent
│       │   ├── StudyMaterial/# MaterialList, UploadMaterial
│       │   └── Dashboard/    # Post-login home
│       └── utils/            # Token helpers, formatters
│
├── server/                   # Express REST API
│   ├── config/               # db.js (Mongoose), cloudinary.js
│   ├── controllers/          # auth, lostfound, events, materials
│   ├── middleware/           # authMiddleware, adminMiddleware, multer
│   ├── models/               # User, LostItem, Event, StudyMaterial
│   └── routes/               # API route definitions
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A free [MongoDB Atlas](https://cloud.mongodb.com/) cluster
- A free [Cloudinary](https://cloudinary.com/) account

### 1 — Clone and install

```bash
git clone https://github.com/your-username/campusconnect.git
cd campusconnect

# Backend dependencies
cd server && npm install

# Frontend dependencies
cd ../client && npm install
```

### 2 — Configure environment variables

Create `/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect
JWT_SECRET=your_super_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create `/client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3 — Start the development server

```bash
# From the root directory
npm install
npm run dev
```

This starts:
- Express API on `http://localhost:5000`
- Vite frontend on `http://localhost:5173`

---

## 🔒 Role-Based Permissions

| Feature | Student | Admin |
|---|---|---|
| View all boards & materials | ✅ | ✅ |
| Post Lost & Found items | ✅ | ✅ |
| Claim or resolve items | ✅ Own items | ✅ All items |
| Create / edit / delete Events | ❌ | ✅ |
| RSVP to events | ✅ | ✅ |
| Upload study materials | ✅ | ✅ |
| Delete any content globally | ❌ | ✅ |

---

## 🔌 API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new account |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `GET` | `/auth/me` | Protected | Fetch logged-in user |

### Lost & Found
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/lostfound` | Public | List all items (supports `?type`, `?category`, `?search`) |
| `POST` | `/lostfound` | Student | Create a new lost/found post |
| `GET` | `/lostfound/:id` | Public | Get single item details |
| `PUT` | `/lostfound/:id/claim` | Student | Claim a found item |
| `PUT` | `/lostfound/:id/resolve` | Owner/Admin | Mark item as resolved |
| `DELETE` | `/lostfound/:id` | Owner/Admin | Delete an item |

### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/events` | Public | List all events (supports `?category`, `?upcoming`) |
| `POST` | `/events` | Admin | Create a new event |
| `GET` | `/events/:id` | Public | Get event details |
| `PUT` | `/events/:id` | Admin | Edit an event |
| `DELETE` | `/events/:id` | Admin | Delete an event |
| `POST` | `/events/:id/rsvp` | Student | Toggle RSVP (add/remove) |

### Study Materials
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/materials` | Public | List materials (supports `?branch`, `?year`, `?subject`) |
| `POST` | `/materials` | Student | Upload a new material (PDF/image) |
| `GET` | `/materials/:id` | Public | Get material details |
| `POST` | `/materials/:id/download` | Student | Increment download count |
| `DELETE` | `/materials/:id` | Owner/Admin | Delete a material |

---

## 🚀 Deployment

### Frontend — Vercel
```bash
# From the /client directory
npm run build
# Deploy the /dist folder to Vercel
# Set VITE_API_BASE_URL to your live backend URL in Vercel environment variables
```

### Backend — Render / Railway
```bash
# Push your /server directory
# Set all server .env variables in the platform's environment settings
# Start command: node server.js
```

---

## 🤝 Contributing

Contributions are welcome. Please follow the steps below:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please ensure your code follows the existing patterns (functional components, async/await, consistent API response format).

---

## 📬 Contact

Built and maintained by **Arihant Shukla**

For queries, bug reports, or collaboration — reach out at **[arihantshukla24@gmail.com](mailto:arihantshukla24@gmail.com)**

---

<div align="center">
---
<div align="center">
Made with ☕ for campus communities.
 
[![Live Demo](https://img.shields.io/badge/Try%20it%20live-4F46E5?style=for-the-badge)](https://campus-connect-one-indol.vercel.app/)
 

---
