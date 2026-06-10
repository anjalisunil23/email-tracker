# Run in a separate terminal while backend is on port 5002:
#   npx ngrok http 5002
# Copy the https://....ngrok-free.app URL into backend/.env:
#   BACKEND_URL=https://YOUR-ID.ngrok-free.app
#   USE_TRACKING_TUNNEL=false
# Restart the backend after updating .env

Write-Host "1. Start backend: npm run dev" -ForegroundColor Cyan
Write-Host "2. In another terminal: npx ngrok http 5002" -ForegroundColor Cyan
Write-Host "3. Copy the https Forwarding URL into backend/.env as BACKEND_URL" -ForegroundColor Cyan
Write-Host "4. Set USE_TRACKING_TUNNEL=false and restart backend" -ForegroundColor Cyan
