$body = @{
    email = "admin@water.gov"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

Write-Host "Login successful!"
Write-Host "Token: $($response.token.Substring(0, 20))..."
Write-Host "User: $($response.user.username)"
Write-Host "Role: $($response.user.role)"
