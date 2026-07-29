$dir = Get-Location

$logoB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "LOgoQR.jpg")))
$bgB64   = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "BackgroundQR.png")))
$loaB64  = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "QRLOA.png")))

$logoUri = "data:image/jpeg;base64," + $logoB64
$bgUri   = "data:image/png;base64," + $bgB64
$loaUri  = "data:image/png;base64," + $loaB64

Write-Host "Logo URI length:" $logoUri.Length
Write-Host "BG URI length:" $bgUri.Length
Write-Host "Loa URI length:" $loaUri.Length

$filePath = Join-Path $dir "PWA_QTDYENTHO.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Replace constants
$oldVersionPattern = 'const CURRENT_APP_VERSION = "2026.07.29-v13.0";'
$newVersionCode = @"
const CURRENT_APP_VERSION = "2026.07.29-v14.0";
        const FIXED_ACC_NUMBER = "3800001234567899";
        const FIXED_ACC_NAME = "QUY TIN DUNG NHAN DAN YEN THO";

        const ASSET_LOGO = "$logoUri";
        const ASSET_BG_STANDEE = "$bgUri";
        const ASSET_BG_QRLOA = "$loaUri";
"@

if ($content.Contains($oldVersionPattern)) {
    $content = $content.Replace($oldVersionPattern, $newVersionCode)
    Write-Host "Replaced version & embedded Base64 assets successfully!"
} else {
    Write-Host "Version pattern not found, checking existing constants..."
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
