# Test if Pesapal Proxy Function is Public

Write-Host "Testing Pesapal Proxy Function..." -ForegroundColor Cyan
Write-Host ""

try {
    $body = '{"action":"auth"}'
    $response = Invoke-WebRequest -Uri 'https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -ErrorAction Stop
    
    Write-Host "✅ SUCCESS! Function is public and working!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host $response.Content
    Write-Host ""
    Write-Host "🎉 Your Pesapal payment integration is ready!" -ForegroundColor Green
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "❌ FAILED: Still getting 401 Unauthorized" -ForegroundColor Red
        Write-Host ""
        Write-Host "The Edge Function is still protected." -ForegroundColor Yellow
        Write-Host "You need to make it public by following the instructions in PESAPAL_401_FIX.md" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Quick link: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/functions" -ForegroundColor Cyan
    } else {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
