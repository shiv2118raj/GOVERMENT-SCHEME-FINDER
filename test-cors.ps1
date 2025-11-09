# PowerShell script to test CORS preflight request
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"

try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:5002/login" `
    -Method "OPTIONS" `
    -WebSession $session `
    -Headers @{
        "Accept"="*/*"
        "Access-Control-Request-Headers"="content-type"
        "Access-Control-Request-Method"="POST"
        "Origin"="http://localhost:3000"
        "Sec-Fetch-Mode"="cors"
    }

    Write-Host "CORS preflight request successful!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response Headers:" -ForegroundColor Yellow
    $response.Headers | Format-Table -AutoSize
} catch {
    Write-Host "CORS preflight request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
