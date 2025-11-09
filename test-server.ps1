# Simple PowerShell script to test server status
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:5002/' -Method 'GET' -UseBasicParsing
    Write-Host "✅ Server is running - Status Code:" $response.StatusCode -ForegroundColor Green
    Write-Host "Response:" $response.Content -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server not responding:" $_.Exception.Message -ForegroundColor Red
}
