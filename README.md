# MindScore AI — Student Mental Health Predictor

A modern, responsive, and animated full-stack web application designed to evaluate student mental health scores based on daily screen time, sleep patterns, study schedules, physical exercise, and stress factors using Machine Learning.

---

## 📌 Project Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + GSAP Animations + jsPDF
- **Backend**: Python 3.10+ + FastAPI + Scikit-Learn (`Mental_Health_Model.pkl`) + Uvicorn
- **Default Hosted API**: `https://mental-health-score-a7dj.onrender.com`

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:

| Requirement | Recommended Version | OS Support |
| :--- | :--- | :--- |
| **Node.js** | v20.x or higher | Linux, macOS, Windows |
| **npm** / **pnpm** / **yarn** | v10.x+ | Linux, macOS, Windows |
| **Python** | 3.10 – 3.12 | Linux, macOS, Windows |
| **pip** | Latest | Linux, macOS, Windows |

---

## 🚀 Quick Start — Frontend (React + Vite)

### 🐧 Linux (Ubuntu / Debian / Fedora)

```bash

# 1. Install Node.js dependencies
npm install

# 2. Start development server (Port 3000)
npm run dev
```

### 🍎 macOS (Intel / Apple Silicon)

```bash

# 1. Install dependencies
npm install

# 2. Launch Vite dev server
npm run dev
```

### 🪟 Windows (PowerShell)

```powershell

# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

### 🪟 Windows (Command Prompt - `cmd.exe`)

npm install
npm run dev
```

> **Note**: Open your browser at `http://localhost:3000` to view the application.

---

## 🐍 Quick Start — Backend (FastAPI Python Server)

If you want to run the Python ML backend locally instead of using the live Render server:

### 🐧 Linux (Ubuntu / macOS / WSL / Git Bash)

```bash
# 1. Create Python virtual environment
python3 -m venv .venv

# 2. Activate virtual environment
source .venv/bin/activate

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

### 🪟 Windows (PowerShell)

```powershell
# 1. Create Python virtual environment
python -m venv .venv

# 2. Activate virtual environment (if restricted, run: Set-ExecutionPolicy Unrestricted -Scope Process)
.\.venv\Scripts\Activate.ps1

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Start FastAPI server
uvicorn main:app --reload --port 8000
```

### 🪟 Windows (Command Prompt - `cmd.exe`)

```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> **Backend URL**: `http://localhost:8000`

---

## 🔗 Connecting Local Frontend to Local Backend

By default, the frontend connects to the online API (`https://mental-health-score-a7dj.onrender.com`).  
To connect to your **local Python backend** (`http://localhost:8000`):

1. Open `src/services/api.ts`
2. Update `BACKEND_URL`:
   ```typescript
   export const BACKEND_URL = 'http://localhost:8000';
   ```

---

## 🛠️ Requirements & Python Model Setup (`requirements.txt`)

If creating a `requirements.txt` file for the backend, include:

```text
fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
joblib>=1.3.0
pandas>=2.0.0
scikit-learn>=1.2.0
```

Ensure `Mental_Health_Model.pkl` is located in the backend root directory alongside `main.py`.

---

## ⚡ Cross-OS Troubleshooting & Tips

### 1. Tailwind Oxide / Native Binding Error (`@tailwindcss/oxide`)
- **Cause**: Node.js version is under v20.
- **Fix (Linux/macOS)**:
  ```bash
  nvm install 20
  nvm use 20
  rm -rf node_modules package-lock.json
  npm install
  ```
- **Fix (Windows)**:
  Use [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch to Node v20, then delete `node_modules` and run `npm install`.

### 2. PowerShell Script Execution Policy Error on Windows
- **Error**: `...\Activate.ps1 cannot be loaded because running scripts is disabled`
- **Fix**: Run PowerShell as Administrator or execute in current session:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
  ```

### 3. CORS Error when calling Backend locally
- Ensure `CORSMiddleware` in `main.py` allows origins:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

## 📦 Production Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
