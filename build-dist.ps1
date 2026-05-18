# Build dist folder for GoDaddy deployment
# Run from project root: .\build-dist.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dist = Join-Path $root "dist"

Write-Host "Building dist for GoDaddy..." -ForegroundColor Cyan

# Core HTML/JS
Copy-Item (Join-Path $root "index.html") (Join-Path $dist "index.html") -Force
Copy-Item (Join-Path $root "inject.js") (Join-Path $dist "inject.js") -Force
Copy-Item (Join-Path $root "event-sponsors.html") (Join-Path $dist "event-sponsors.html") -Force
Write-Host "  index.html, inject.js, event-sponsors.html" -ForegroundColor Green

# Assets (production bundle only)
$assetsSrc = Join-Path $root "assets"
$assetsDst = Join-Path $dist "assets"
$productionAssets = @("index-BcyvbPgd.js", "index-CamUc_Fe.css")
if (Test-Path $assetsSrc) {
    if (Test-Path $assetsDst) { Remove-Item $assetsDst -Recurse -Force }
    New-Item -ItemType Directory -Path $assetsDst | Out-Null
    foreach ($file in $productionAssets) {
        $src = Join-Path $assetsSrc $file
        if (-not (Test-Path $src)) { throw "Missing production asset: $file" }
        Copy-Item $src (Join-Path $assetsDst $file) -Force
    }
    Write-Host "  assets/ ($($productionAssets -join ', '))" -ForegroundColor Green
}

# Static files
@(
    "favicon.ico",
    "favicon.png",
    "placeholder.svg",
    "anbi-algemeen-nut-beogende-instelling.svg",
    "robots.txt",
    "sitemap.xml",
    "miniindiagrocerry.webp",
    "shivahero.jpg",
    "shiva.mp4",
    "avi.jpg",
    "footer.png",
    "header.png",
    "whatsapp.png"
) | ForEach-Object {
    $src = Join-Path $root $_
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $dist $_) -Force
        Write-Host "  $_" -ForegroundColor Green
    }
}

# API (PHP for GoDaddy)
$apiSrc = Join-Path $root "api"
$apiDst = Join-Path $dist "api"
if (Test-Path $apiSrc) {
    if (-not (Test-Path $apiDst)) { New-Item -ItemType Directory -Path $apiDst | Out-Null }
    Get-ChildItem $apiSrc -File | Where-Object { $_.Name -ne 'sheets-config.example.php' } | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $apiDst $_.Name) -Force
    }
  Write-Host "  api/" -ForegroundColor Green
}
$sheetsConfig = Join-Path $root "api\sheets-config.php"
if (Test-Path $sheetsConfig) {
    Copy-Item $sheetsConfig (Join-Path $apiDst "sheets-config.php") -Force
    Write-Host "  api/sheets-config.php" -ForegroundColor Green
}

# .htaccess for GoDaddy (Apache) - SPA fallback
# IMPORTANT: UTF-8 without BOM. PowerShell Set-Content -Encoding UTF8 often adds BOM and Apache may return 500.
$htaccess = @"
# SPA fallback: serve index.html for client-side routes
RewriteEngine On
RewriteBase /
RewriteRule ^events/?$ /index.html [L]
RewriteRule ^about/?$ /index.html [L]
RewriteRule ^services/?$ /index.html [L]
RewriteRule ^contact/?$ /index.html [L]
RewriteRule ^sanskars/?$ /index.html [L]
RewriteRule ^donate/?$ /index.html [L]
# Do not rewrite files or directories that exist on disk
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
"@
$htaccessPath = Join-Path $dist ".htaccess"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($htaccessPath, $htaccess, $utf8NoBom)
Write-Host "  .htaccess (GoDaddy SPA rewrites, UTF-8 no BOM)" -ForegroundColor Green

Write-Host "Done. Upload the contents of the 'dist' folder to your GoDaddy server (e.g. public_html)." -ForegroundColor Cyan
