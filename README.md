live:expensetrackers-nine.vercel.app



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 💰 Expense Tracker (React + Vite)

A modern expense tracker built with **React**, **Chart.js**, and **jsPDF**.  
It helps users manage income & expenses visually, generate reports, and export beautiful PDF summaries.

---

## 🚀 Features
- 🧾 Add, edit, and delete transactions
- 📊 Visualize data with bar, line, and pie charts
- 👤 User Profile with avatar, currency, and salary
- 📁 Export detailed PDF reports (with charts & profile info)
- 💾 Persistent data using LocalStorage
- 🌗 Clean, responsive UI with smooth animations

---

## 🛠️ Tech Stack
- **React (Vite)**
- **Chart.js**
- **jsPDF + jsPDF-AutoTable**
- **CSS / Bootstrap**
- **LocalStorage**

---

## 🖼️ Screenshots
(Add some screenshots here later using `assets/`)

---

## 📦 Setup
```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
npm install
npm run dev
