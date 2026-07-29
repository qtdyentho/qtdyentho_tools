$body = @{
    accountNo = "3800200138221012"
    accountName = "NGUYEN THI NGUYET"
    acqId = "970446"
    amount = 100000
    addInfo = "TT STANDEE NGUYEN THI NGUYET"
    template = "qr_only"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://api.vietqr.io/v2/generate" -Method Post -Body $body -ContentType "application/json"
    Write-Host "OFFICIAL_VIETQR_STRING:"
    Write-Host $res.data.qrCode
} catch {
    Write-Host "ERR:" $_
}
