# ⚡ Mayank Mani Pandey — ECE & Embedded Systems Portfolio

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)
![Node: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)
![Express: 5.x](https://img.shields.io/badge/Express-5.x-black?logo=express)
![Frontend: HTML5 / CSS3 / Vanilla JS](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20ES6-E34F26?logo=html5&logoColor=white)
![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-10f0a5)
![Platform: GitHub Pages & Node](https://img.shields.io/badge/Deployment-Dual%20Mode-38bdf8)

**An ultra-modern, responsive Full-Stack engineering portfolio built for Electronics & Communication Engineering (ECE), Embedded Systems, IoT, and Firmware prototyping.**

[Live Demo](#-quick-start) • [Features](#-key-features) • [ECE Virtual Lab](#-interactive-virtual-ece-lab) • [API Specs](#-backend-api-endpoints) • [GitHub Push Guide](#-github-push-guide)

</div>

---

## 🌟 Overview

This portfolio represents the engineering work of **Mayank Mani Pandey**, an undergraduate student in **Electronics & Communication Engineering** at **Pondicherry University (Central University)**. 

Designed with a sleek **Cyber-Emerald & Glassmorphic Hardware Aesthetic**, the project bridges hardware schematics with modern web technology, featuring an interactive virtual 7-segment display simulator, simulated microcontroller telemetry, full-stack contact storage, visitor guestbook, and an ATS-optimized printable resume.

---

## ✨ Key Features

### 🖥️ Frontend Highlights
- **Interactive Circuit Background**: Hardware particle canvas with dynamic traces that connect to your cursor.
- **Dynamic Role Typing**: Automatically cycles through engineering roles with realistic backspacing.
- **Interactive Hero Terminal**: Switchable firmware code tabs (`atmega_counter.c`, `iot_telemetry.cpp`, `engineer.json`) with one-click clipboard copy.
- **Interactive ECE Virtual Lab**:
  - Common-cathode 7-segment LED display with authentic physical glow.
  - Interactive increment (`+ Step Up`), decrement, and continuous auto-looping cycle.
  - Live GFEDCBA binary bus & hex register decoder (`0b00111111`, `0x3F`).
  - Web Audio 8-bit frequency synthesizer that plays musical tones on every count step.
  - Live hardware telemetry panel polling voltage, current draw, temperature, and I2C status.
- **Project Showcase & Circuit Modals**: High-resolution project mockups with detailed modal walkthroughs of circuits, pinouts, and embedded C logic.
- **Skills Matrix with Filters**: Categorized tabs (Hardware, Programming, Tools, Web) with animated percentage progress bars.
- **Responsive Mobile Navigation**: Touch-friendly sliding glass drawer for tablets and smartphones.
- **Dual Themes & Sound FX**:
  - One-click dark / light mode toggle with persistent state in `localStorage`.
  - Synthesized futuristic audio feedback (can be muted or enabled).
- **ATS-Friendly Resume**: Built-in `resume.html` with print/PDF styling and clean typography.

### ⚙️ Backend Highlights (Node.js & Express)
- **Zero-Config Database**: Embedded atomic JSON database inside `data/` for contact messages, guestbook notes, and telemetry stats.
- **Contact API with Validation**: Sanitizes inputs, verifies email formatting, and records client metadata.
- **Admin Message Inbox Drawer**: Click `📬 Message Inbox (Admin)` in the footer to review all submitted contact messages.
- **Interactive Guestbook**: Public endorsement feed allowing recruiters, peers, and mentors to leave notes.
- **Automated Test Suite**: Built-in test runner (`npm test`) validating all API routes.
- **Dual Operation (Static & Full-Stack)**: Transparently falls back to client-side storage and `mailto:` links when hosted on static services like GitHub Pages!

---

## 📸 Project Showcase

| Project | Domain | Description |
| :--- | :--- | :--- |
| **Green Garuda Co.** | Smart IoT & Sustainability | Circular waste-management platform with ultrasonic fill telemetry and e-waste classification. |
| **Arduino 7-Segment Counter** | Embedded Systems & Logic | ATmega328P decimal counter with debounced push-button state machine and zero ghosting. |
| **LCD & Buzzer Telemetry Station** | Microcontroller Interfaces | 16x2 alphanumeric liquid crystal display with multi-frequency PWM piezo acoustic warnings. |

---

## ⚡ Interactive Virtual ECE Lab

The **Virtual ECE Lab** provides recruiters and engineers with a live hands-on demonstration of digital logic:

```text
       [a]
    +-------+
[f] |       | [b]
    +-------+ <-- [g]
[e] |       | [c]
    +-------+
       [d]      (dp)
```

- **Decimal `0`**: Segments `a, b, c, d, e, f` &rarr; Binary `0b00111111` &rarr; Hex `0x3F`
- **Decimal `7`**: Segments `a, b, c` &rarr; Binary `0b00000111` &rarr; Hex `0x07`
- **Decimal `8`**: All segments &rarr; Binary `0b01111111` &rarr; Hex `0x7F`

---

## 📡 Backend API Endpoints

The backend server is powered by Express and provides the following REST endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, uptime counter, and server status. |
| `GET` | `/api/telemetry` | Real-time simulated hardware telemetry (voltage, mA, temp, I2C). |
| `POST` | `/api/contact` | Submits contact message with validation and persistence. |
| `GET` | `/api/contact/messages` | Admin endpoint to retrieve all submitted contact messages. |
| `DELETE` | `/api/contact/messages/:id` | Deletes a message by its unique ID. |
| `GET` | `/api/guestbook` | Fetches public visitor guestbook entries. |
| `POST` | `/api/guestbook` | Adds a new endorsement or visitor note. |
| `GET` | `/api/stats` | Returns total portfolio views and interaction counts. |
| `POST` | `/api/stats/visit` | Records page visit and increments telemetry counter. |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Clone or Open the Repository
```bash
git clone https://github.com/mayankmanipandey/myprotfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
Verify that all API routes and data persistence modules function correctly:
```bash
npm test
```

### 4. Start the Full-Stack Server
```bash
npm start
```

Visit **`http://localhost:3000`** in your browser!

> **Note**: For static preview without Node.js, you can also open `index.html` directly in your browser or use the VS Code *Live Server* extension. The portfolio will automatically enter graceful static mode!

---

## 🛠️ Customization Guide

All personal information, social links, project details, and skills are centralized in [`config.js`](config.js):

```javascript
const SITE_CONFIG = {
  name: "Mayank Mani Pandey",
  initials: "MMP",
  role: "Electronics & Communication Engineering Student",
  typingRoles: [
    "Electronics & Communication Engineering Student",
    "Embedded Systems & IoT Builder",
    "Arduino & Hardware Prototyper"
  ],
  email: "mayankmanipandey2004@gmail.com",
  // Edit social links, skills, projects, achievements, and timeline here!
};
```

---

## 📦 GitHub Push Guide

To push your updated portfolio to your GitHub repository:

### 1. Initialize Git (if not already initialized)
```bash
git init
git add .
git commit -m "feat: complete full-stack portfolio with virtual ECE lab, API, and modern design"
```

### 2. Link your GitHub Repository
Create a repository on GitHub (e.g. `portfolio` or `Mayank-Mani-Pandey.github.io`), then run:
```bash
git branch -M main
git remote add origin https://github.com/mayankmanipandey/myprotfolio.git
git push -u origin main
```

### 3. Deploying to GitHub Pages (Static Hosting)
1. In your GitHub repository, go to **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions** (or select **Deploy from a branch** &rarr; `main` &rarr; `/ (root)`).
3. The included `.github/workflows/deploy.yml` workflow will automatically run the tests and deploy your site to `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`!

### 4. Deploying Full-Stack (Render / Railway / Glitch)
For 24/7 full-stack API functionality (contact submissions saved to server):
1. Connect your repository to [Render.com](https://render.com) or [Railway.app](https://railway.app).
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Your full-stack portfolio is live with active APIs!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use and customize for your own developer portfolio.

---

<div align="center">
  <sub>Engineered with ❤️ by <strong>Mayank Mani Pandey</strong> • Pondicherry University</sub>
</div>
