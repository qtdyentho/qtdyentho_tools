$logoBytes = [IO.File]::ReadAllBytes("d:\MrTiger\Lương BHXH\QTD_Tools\LOgoQR.jpg")
$logoB64 = [Convert]::ToBase64String($logoBytes)
$qrloaBytes = [IO.File]::ReadAllBytes("d:\MrTiger\Lương BHXH\QTD_Tools\QRLOA.png")
$qrloaB64 = [Convert]::ToBase64String($qrloaBytes)
Write-Host "LOGO_LEN=$($logoB64.Length)"
Write-Host "QRLOA_LEN=$($qrloaB64.Length)"
[IO.File]::WriteAllText("d:\MrTiger\Lương BHXH\QTD_Tools\logo_b64.txt", $logoB64)
[IO.File]::WriteAllText("d:\MrTiger\Lương BHXH\QTD_Tools\qrloa_b64.txt", $qrloaB64)
Write-Host "Done"
