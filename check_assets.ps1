$logoB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes('LOgoQR.jpg'))
$bgB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes('BackgroundQR.png'))
$loaB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes('QRLOA.png'))

Write-Host "LOgoQR.jpg B64 length:" $logoB64.Length
Write-Host "BackgroundQR.png B64 length:" $bgB64.Length
Write-Host "QRLOA.png B64 length:" $loaB64.Length
