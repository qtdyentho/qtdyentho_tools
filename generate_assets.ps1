$dir = Get-Location
$bgPath = Join-Path $dir "BackgroundQR.png"
$logoPath = Join-Path $dir "LOgoQR.jpg"
$loaPath = Join-Path $dir "QRLOA.png"

$bgB64 = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($bgPath))
$logoB64 = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($logoPath))
$loaB64 = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($loaPath))

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("const ASSET_STANDEE_BG = ""data:image/png;base64,$bgB64"";")
[void]$sb.AppendLine("const ASSET_LOGO = ""data:image/jpeg;base64,$logoB64"";")
[void]$sb.AppendLine("const ASSET_QRLOA_BG = ""data:image/png;base64,$loaB64"";")

$outputPath = Join-Path $dir "assets_b64.js"
[System.IO.File]::WriteAllText($outputPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "SUCCESSFULLY_GENERATED_ASSETS_JS"
