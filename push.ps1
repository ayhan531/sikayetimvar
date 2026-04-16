# GitHub Push Script
# Run this script with: powershell -File push.ps1 YOUR_TOKEN

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$repoPath = "C:\Users\Cem\Desktop\şikayetimvar"

Set-Location $repoPath

# Set the remote with token
git remote set-url origin "https://ayhan531:$Token@github.com/ayhan531/sikayetimvar.git"

# Push to GitHub
git push -u origin master

Write-Host "Push completed!"
