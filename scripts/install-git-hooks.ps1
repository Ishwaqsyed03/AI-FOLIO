# PowerShell script to install local git hooks from .githooks into .git\hooks
Param()
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)
$source = Join-Path $repoRoot ".githooks"
$target = Join-Path $repoRoot ".git\hooks"
if (-not (Test-Path $source)) { Write-Output "No .githooks directory found. Nothing to install."; exit 0 }
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }
Get-ChildItem -Path $source -File | ForEach-Object {
  $dest = Join-Path $target $_.Name
  Copy-Item -Path $_.FullName -Destination $dest -Force
  # Ensure executable flag for WSL/git bash environments
  try { icacls $dest /grant Everyone:RX } catch {}
}
Write-Output "Installed git hooks from .githooks to .git/hooks"
