# Check schemes in database
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/api/schemes" -UseBasicParsing
    $schemes = $response.Content | ConvertFrom-Json
    Write-Host "Total schemes: $($schemes.Count)" -ForegroundColor Green
    Write-Host "First 3 schemes:" -ForegroundColor Yellow
    $schemes | Select-Object -First 3 | ForEach-Object {
        Write-Host "  _id: $($_._id)"
        Write-Host "  Name: $($_.name)"
        Write-Host "  Slug: $($_.name.ToLower().Replace(' ', '-'))"
        Write-Host ""
    }
} catch {
    Write-Host "Error checking schemes: $($_.Exception.Message)" -ForegroundColor Red
}
