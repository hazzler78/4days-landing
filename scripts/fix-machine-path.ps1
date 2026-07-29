# Run as Administrator (right-click PowerShell -> Run as administrator)
# Fixes bloated Machine PATH that breaks tools spawning "powershell".

$machine = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$seen = @{}
$clean = foreach ($p in ($machine -split ';' | Where-Object { $_ -and $_.Trim() })) {
  $key = $p.TrimEnd('\').ToLowerInvariant()
  if (-not $seen.ContainsKey($key)) {
    $seen[$key] = $true
    $p.TrimEnd('\')
  }
}
$cleanPath = ($clean -join ';')

Write-Host "Before: $($machine.Length) chars, $(($machine -split ';').Count) entries"
Write-Host "After:  $($cleanPath.Length) chars, $($clean.Count) entries"

[System.Environment]::SetEnvironmentVariable("Path", $cleanPath, "Machine")
Write-Host "Done. Close ALL terminals and open a new one, then run: gen-ai login"
pause
