$dir = Get-Location
$file = Join-Path $dir "PWA_QTDYENTHO.html"
$content = git show 74db889:PWA_QTDYENTHO.html | Out-String
$match = [System.Text.RegularExpressions.Regex]::Match($content, "(?s)function renderStandeeCanvasToTarget.*?function renderQRLoaCanvasToTarget")
if ($match.Success) {
    Write-Host $match.Value.Substring(0, [Math]::Min(1200, $match.Value.Length))
}
