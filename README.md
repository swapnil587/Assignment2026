# Assignment2026

All about **React.js** – from setup to running and using the application.

---

## 📌 Prerequisites

Before starting, make sure you have the following installed on your PC:

### 1️⃣ Node.js & npm

* Download Node.js (LTS version recommended)
* Node.js comes with **npm** (Node Package Manager)

Check installation:

```bash
node -v
npm -v
```

### 2️⃣ Code Editor

* Recommended: **VS Code**
* Useful extensions:

  * ES7+ React Snippets
  * Prettier
  * ESLint

### 3️⃣ Git (Optional but Recommended)

```bash
git --version
```

---

## 🚀 Project Setup (From Scratch)

### Step 1: Create React App (Vite – Recommended)

```bash
npm create vite@latest assignment2026
```

Choose:

* Framework: **React**
* Variant: **JavaScript** or **JavaScript + SWC**

### Step 2: Move into Project Folder

```bash
cd assignment2026
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open browser and visit:

```
http://localhost:5173
```

---

## 📂 Project Structure Explained

```text
assignment2026/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

### Important Files

* `main.jsx` → Entry point
* `App.jsx` → Root component
* `components/` → Reusable UI components
* `pages/` → Page-level components

---

## 🧠 React Core Concepts (Must Know)

### 1️⃣ Components

```jsx
function Hello() {
  return <h1>Hello React</h1>;
}
```

### 2️⃣ Props

```jsx
function Card({ title }) {
  return <h2>{title}</h2>;
}
```

### 3️⃣ State (`useState`)

```jsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

### 4️⃣ Effects (`useEffect`)

```jsx
useEffect(() => {
  console.log("Component Mounted");
}, []);
```

---

## 🌐 API Usage in React

### Fetching Data

```jsx
useEffect(() => {
  fetch("https://api.example.com/data")
    .then(res => res.json())
    .then(data => console.log(data));
}, []);
```

### Best Practices

* Always handle loading & error states
* Keep API logic inside `useEffect`

---

## 🎨 Styling Options

### 1️⃣ CSS

```css
body { background: #f9f9f9; }
```

### 2️⃣ Tailwind CSS (Recommended)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3️⃣ Component Libraries

* Material UI
* ShadCN UI
* Ant Design

---

## 🧪 Testing & Linting

```bash
npm run lint
```

Optional:

* Jest
* React Testing Library

---

## 📦 Build for Production

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

## ☁️ Deployment Options

* Netlify
* Vercel
* GitHub Pages

Example (Vercel):

```bash
vercel
```

---

## 🧑‍💻 How to Use This App

1. Clone repository
2. Install dependencies
3. Run development server
4. Edit components in `src/`
5. Add new features using React hooks

---

## 📘 Learning Path (Recommended)

1. JSX
2. Components & Props
3. State & Events
4. Hooks
5. API Integration
6. Routing (React Router)
7. Performance Optimization

---

## ✅ Common Errors & Fixes

| Error              | Solution             |
| ------------------ | -------------------- |
| npm not recognized | Install Node.js      |
| Blank screen       | Check console errors |
| Module not found   | Run npm install      |

---

## 🏁 Conclusion

This project demonstrates **complete React.js fundamentals** from setup to deployment. Perfect for beginners and assignments.

---

### ✨ Author

Assignment2026 – React.js
