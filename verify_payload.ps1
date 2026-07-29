function pad2($n) { if ($n -lt 10) { return "0" + $n } else { return "" + $n } }

function calcCRC16($str) {
    $crc = 0xFFFF
    for ($c = 0; $c -lt $str.Length; $c++) {
        $crc = $crc -bxor ([int][char]$str[$c] -shl 8)
        for ($i = 0; $i -lt 8; $i++) {
            if (($crc -band 0x8000) -ne 0) {
                $crc = (($crc -shl 1) -bxor 0x1021) -band 0xFFFF
            } else {
                $crc = ($crc -shl 1) -band 0xFFFF
            }
        }
    }
    $hex = $crc.ToString("X")
    while ($hex.Length -lt 4) { $hex = "0" + $hex }
    return $hex
}

function generatePayload($bin, $acc, $memo, $amount) {
    $tag00_bank = "0006" + $bin
    $tag01_acc = "01" + (pad2 $acc.Length) + $acc
    $subTag01 = $tag00_bank + $tag01_acc
    $tag01_full = "01" + (pad2 $subTag01.Length) + $subTag01
    $tag02_service = "0208QRIBFTTA"
    $tag38_content = "0010A000000727" + $tag01_full + $tag02_service
    $tag38 = "38" + (pad2 $tag38_content.Length) + $tag38_content
    $tag53_curr = "5303704"

    $tag54 = ""
    if ($amount -gt 0) {
        $amtStr = "" + [Math]::Round([double]$amount)
        $tag54 = "54" + (pad2 $amtStr.Length) + $amtStr
    }

    $tag58_country = "5802VN"

    $tag62 = ""
    if ($memo -and $memo.Trim()) {
        $mClean = $memo.Trim()
        $tag08_memo = "08" + (pad2 $mClean.Length) + $mClean
        $tag62 = "62" + (pad2 $tag08_memo.Length) + $tag08_memo
    }

    $payload = "000201" + "010212" + $tag38 + $tag53_curr + $tag54 + $tag58_country + $tag62 + "6304"
    return $payload + (calcCRC16 $payload)
}

$gen = generatePayload "970446" "3800200138221012" "TT STANDEE NGUYEN THI NGUYET" 100000
$off = "00020101021238600010A00000072701300006970446011638002001382210120208QRIBFTTA530370454061000005802VN62320828TT STANDEE NGUYEN THI NGUYET6304CAC6"

Write-Host "GEN: $gen"
Write-Host "OFF: $off"
Write-Host "MATCH? "$($gen -eq $off)
