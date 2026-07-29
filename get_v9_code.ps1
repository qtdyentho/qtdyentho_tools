$content = git show 74db889:PWA_QTDYENTHO.html
$idx = $content.IndexOf("function renderStandeeCanvasToTarget")
if ($idx -gt 0) {
    Write-Host $content.Substring($idx, 1500)
}
