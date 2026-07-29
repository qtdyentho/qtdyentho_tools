$dir = Get-Location
$pwa = [System.IO.File]::ReadAllText((Join-Path $dir "PWA_QTDYENTHO.html"), [System.Text.Encoding]::UTF8)
if ($pwa -match 'RS_BLOCK_TABLE = \[(.*?)\];') {
    Write-Host "RS_BLOCK_TABLE count:" $matches[1].Split(',').Count
}
