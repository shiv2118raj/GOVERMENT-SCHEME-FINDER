# Test chat service endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/chat" -Method "POST" -Body "message=hello&language=en" -ContentType "application/x-www-form-urlencoded" -UseBasicParsing
    Write-Host "✅ Chat service working! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Chat service not working: $($_.Exception.Message)" -ForegroundColor Red
}
