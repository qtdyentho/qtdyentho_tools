$dir = Get-Location
$pwaFile = Join-Path $dir "PWA_QTDYENTHO.html"
$assetsFile = Join-Path $dir "assets_b64.js"

$pwa = [System.IO.File]::ReadAllText($pwaFile, [System.Text.Encoding]::UTF8)
$assets = [System.IO.File]::ReadAllText($assetsFile, [System.Text.Encoding]::UTF8)

# Replace existing block if present
$pattern = "(?s)/\*\s*EMBEDDED_ASSETS_START\s*\*/.*?/\*\s*EMBEDDED_ASSETS_END\s*\*/"
$pwa = [System.Text.RegularExpressions.Regex]::Replace($pwa, $pattern, "")

$block = "/* EMBEDDED_ASSETS_START */`n$assets`n/* EMBEDDED_ASSETS_END */`n"
$anchor = "// ==================== 3. STANDEE QR & QR LOA GENERATOR ENGINE ===================="

$pwa = $pwa.Replace($anchor, "$block`n$anchor")

[System.IO.File]::WriteAllText($pwaFile, $pwa, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESSFULLY_INJECTED_ASSETS"
