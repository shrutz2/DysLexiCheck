DysLexiCheck — Docker run & demo instructions (resume/demo ready)

Overview
- This repo contains a Flask backend providing dyslexia-related analysis endpoints and a React frontend.
- The Docker setup builds the frontend and runs the Flask backend with Gunicorn.

Preflight (what you need locally)
- Docker Desktop running
- Optional: Azure Cognitive Services Computer Vision key & Bing Spell Check key (recommended for real OCR)

Set Azure/Bing keys (local development)
1. Copy `.env.example` to `.env` in the repo root.
2. Edit `.env` and set these variables with your real keys/endpoints:
   - AZURE_COMPUTERVISION_KEY
   - AZURE_COMPUTERVISION_ENDPOINT
   - BING_SPELLCHECK_KEY
   - BING_SPELLCHECK_ENDPOINT

Run with Docker Compose (development / demo)
1. Build and start (from repo root):

```powershell
docker compose build --no-cache
docker compose up -d
```

2. Check container status and logs:

```powershell
docker compose ps
docker compose logs --tail 200
```

3. Access the app in a browser (served by Flask):

- http://localhost:5000/   (root; lists available endpoints)

API smoke tests (manual)
- Get sample words:
```powershell
Invoke-RestMethod 'http://localhost:5000/api/get-words?level=1'
```
- Analyze a single image (example):
```powershell
C:\Windows\System32\curl.exe -X POST "http://localhost:5000/api/analyze-image" -F "file=@C:\Users\LENOVO\dysle\data\dyslexic\1.jpg"
```

Batch testing with Postman Runner
1. Import `tools/DysLexiCheck.postman_collection.json` into Postman.
2. Open Runner, select that collection and load the CSV `tools/analyze_images_runner.csv`.
3. Run — each row will upload the file in `filePath`.

Notes for resume/demo
- If Azure keys are not provided the server returns placeholder OCR text but still computes metrics (useful for local demos).
- For a live demo, make sure you set `.env` with valid keys and restart the stack.

Troubleshooting
- If `gunicorn` not found: ensure `backend/requirements.txt` includes `gunicorn` and rebuild.
- If Pillow fails to build in Docker: the Dockerfile installs system libs (already included).

Contact
- If you'd like, I can also add a short `demo.md` with step-by-step screenshots for a hiring demo.