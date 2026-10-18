# Deployment and Operations Guide (DEPLOYMENT.md)

This guide documents the procedures for running PRAVAHA locally and deploying both frontend and backend to production hosting environments.

## 1. Local Development Quickstart

### Prerequisites
- Node.js 18.0+ or 20.0+ (Tested on Node v24)
- Python 3.10+ (Tested on Python 3.14)
- Git

### Fast Setup (macOS / Linux)
1. Clone the repository and enter the workspace:
   ```bash
   git clone <repo-url>
   cd Pravaha
   ```
2. Python virtual environment setup:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r backend/requirements.txt
   ```
3. Data preparation and profiling:
   ```bash
   python backend/scripts/profile_dataset.py
   python backend/scripts/prepare_spatial_data.py
   ```
4. Start backend server:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. In a second terminal, start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
6. Access the site at `http://localhost:5173`.

### Fast Setup (Windows PowerShell)
1. Python virtual environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install --upgrade pip
   pip install -r backend\requirements.txt
   ```
2. Run data generation:
   ```powershell
   python backend\scripts\profile_dataset.py
   python backend\scripts\prepare_spatial_data.py
   ```
3. Start backend:
   ```powershell
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. Start frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

---

## 2. Frontend Deployment: GitHub Pages

The frontend is a static single-page application built with Vite and React Router.

### Configuration
1. Environment Variable:
   - `VITE_API_BASE_URL`: URL of the deployed backend (e.g., `https://api.pravaha.example.com`).
   - `VITE_BASE_PATH`: Set to repository subpath if deploying under user domain (e.g., `/Pravaha/`), or `/` for custom domains.
2. Routing Handling:
   - GitHub Pages serves static files and returns HTTP 404 on unknown routes. A standard script in `frontend/public/404.html` captures the requested path and redirects to `index.html` with route restoration, preserving deep links.
3. Automated GitHub Action:
   - `.github/workflows/deploy-frontend.yml` executes on every push to `main`, runs type checks, builds the production bundle, and deploys the `dist/` directory to GitHub Pages via official GitHub Actions.

---

## 3. Backend Deployment: Render, Railway, or Fly.io

GitHub Pages serves static assets only and cannot execute Python. The FastAPI backend must be deployed to a container host.

### Docker Container Deployment
A multi-stage `Dockerfile` is provided in `/backend/Dockerfile`.

### Environment Variables
Configure these variables on your hosting provider dashboard:
- `PORT`: Assigned by host (e.g., 8000 or 10000)
- `HOST`: `0.0.0.0`
- `DATASET_PATH`: Path to tabular dataset (defaults to `data/raw/flood_risk_dataset_india.csv`)
- `CORS_ORIGINS`: Comma-separated allowed origins (e.g., `https://username.github.io,https://pravaha.example.com`)
- `ADMIN_PASSCODE`: Optional operator secret for administration
- `GEMMA_BASE_URL`: URL to your Google Gemma 4 endpoint
- `GEMMA_MODEL`: `google/gemma-4-E4B-it`

### Important Operational Notes
1. Ephemeral Storage: SQLite storage (`pravaha.db`) on free-tier containers is reset when containers restart. For persistent scenario history across redeploys, mount a persistent volume or connect an external managed database.
2. Cold Starts: Free-tier instances sleep after inactivity. The frontend includes a dedicated connectivity indicator and retry mechanism.

---

## 4. Custom Domain and DNS Configuration

When attaching a custom domain to PRAVAHA:

### Frontend DNS (Apex Domain or Subdomain on GitHub Pages)
- Apex Domain (`example.com`):
  - Add four DNS `A` records pointing to GitHub Pages IP addresses:
    - `185.199.108.153`
    - `185.199.109.153`
    - `185.199.110.153`
    - `185.199.111.153`
  - In GitHub repository settings (Pages section), enter custom domain `example.com` and enable "Enforce HTTPS".
- Subdomain (`flood.example.com`):
  - Add a `CNAME` record: `flood.example.com` -> `<username>.github.io`.

### Backend API Subdomain DNS
- API Subdomain (`api.example.com`):
  - Add a `CNAME` record pointing to your cloud host URL:
    - Render: `api.example.com` -> `<app-name>.onrender.com`
    - Railway: `api.example.com` -> `<app-name>.up.railway.app`
- SSL Certificates are provisioned automatically via Let's Encrypt on both GitHub Pages and Render/Railway.
- Update `VITE_API_BASE_URL` in frontend build settings to `https://api.example.com`.
