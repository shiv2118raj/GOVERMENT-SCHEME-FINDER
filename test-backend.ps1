# Test backend server status
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend is working! Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
}
