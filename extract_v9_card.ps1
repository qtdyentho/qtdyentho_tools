$dir = Get-Location
$content = git show 74db889:PWA_QTDYENTHO.html | Out-String
$idx = $content.IndexOf("buildQRCardCanvas")
if ($idx -gt 0) {
    Write-Host $content.Substring($idx, 1500)
}
