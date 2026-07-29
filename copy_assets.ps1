$dir = Get-Location
$publicDir = Join-Path $dir "public"
if (!(Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir
}
Copy-Item (Join-Path $dir "BackgroundQR.png") $publicDir -Force
Copy-Item (Join-Path $dir "QRLOA.png") $publicDir -Force
Copy-Item (Join-Path $dir "LOgoQR.jpg") $publicDir -Force
Write-Host "Assets copied to public/ successfully!"
