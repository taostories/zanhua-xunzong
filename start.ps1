$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:5188'
try {
    $existing = Invoke-WebRequest -UseBasicParsing -Uri $previewUrl -TimeoutSec 2
    if ($existing.Content -match 'ZANHUA|art-config.js') {
        Start-Process $previewUrl
        exit 0
    }
    throw 'Port 5188 is occupied by another service. Use another ZANHUA_PORT with node serve.cjs.'
} catch {
    if ($_.Exception.Message -like '*occupied*') { throw }
}
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
$nodeBinary = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' }
if (!(Test-Path -LiteralPath $nodeBinary)) {
    Write-Host 'Node.js was not found. Opening index.html directly. Install Node.js for local-server PNG export.'
    Start-Process (Join-Path $projectRoot 'index.html')
    exit 0
}
$serverScript = Join-Path $projectRoot 'serve.cjs'
Start-Process -FilePath $nodeBinary -ArgumentList ('"' + $serverScript + '"') -WorkingDirectory $projectRoot -WindowStyle Hidden
for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try {
        $ready = Invoke-WebRequest -UseBasicParsing -Uri $previewUrl -TimeoutSec 1
        if ($ready.StatusCode -eq 200) { Start-Process $previewUrl; exit 0 }
    } catch { Start-Sleep -Milliseconds 250 }
}
throw 'The preview server did not become ready. Run node serve.cjs to see the error.'
