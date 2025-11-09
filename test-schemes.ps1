# Test schemes endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/api/schemes" -UseBasicParsing
    Write-Host "✅ Schemes endpoint working! Status: $($response.StatusCode)" -ForegroundColor Green
    $schemes = $response.Content | ConvertFrom-Json
    Write-Host "Number of schemes: $($schemes.Count)" -ForegroundColor Cyan
    if ($schemes.Count -gt 0) {
        Write-Host "First scheme: $($schemes[0].name)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Schemes endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}
