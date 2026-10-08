param(
    [Parameter(Mandatory = $true)]
    [string]$Package
)

$ErrorActionPreference = "Stop"

$Book = $PSScriptRoot
$Downloads = Join-Path $env:USERPROFILE "Downloads"

# Accept either a full ZIP path or a filename in Downloads.
if (-not (Test-Path -LiteralPath $Package -PathType Leaf)) {
    $Package = Join-Path $Downloads $Package
}

if (-not (Test-Path -LiteralPath $Package -PathType Leaf)) {
    throw "ZIP package not found: $Package"
}

if ([IO.Path]::GetExtension($Package) -ne ".zip") {
    throw "Only ZIP packages are supported."
}

$Temp = Join-Path ([IO.Path]::GetTempPath()) (
    "fastgc_book_" + [guid]::NewGuid().ToString("N")
)

$Backup = Join-Path $Book (
    ".book-backups\" + (Get-Date -Format "yyyyMMdd_HHmmss_fff")
)

$AllowedExtensions = @(
    ".md", ".png", ".jpg", ".jpeg",
    ".webp", ".gif", ".svg", ".csv", ".json"
)

$Copies = @()
$Applied = @()

try {
    Add-Type -AssemblyName System.IO.Compression

    # Inspect ZIP entries before extraction.
    $Archive = [IO.Compression.ZipFile]::OpenRead($Package)

    try {
        foreach ($Entry in $Archive.Entries) {
            $Name = $Entry.FullName.Replace("\", "/")

            if ($Name.EndsWith("/")) { continue }

            if ($Name.StartsWith("/") -or
                $Name -match '(^|/)\.\.(/|$)' -or
                $Name -match '^[A-Za-z]:' -or
                $Name -match '(^|/)\.git(/|$)') {
                throw "Unsafe ZIP entry: $Name"
            }

            if (-not $Name.StartsWith("docs/")) {
                throw "Unexpected file outside docs/: $Name"
            }

            $Ext = [IO.Path]::GetExtension($Name).ToLowerInvariant()

            if ($AllowedExtensions -notcontains $Ext) {
                throw "Unsupported file type: $Name"
            }
        }
    }
    finally {
        $Archive.Dispose()
    }

    New-Item -ItemType Directory -Path $Temp -Force | Out-Null
    Expand-Archive -LiteralPath $Package -DestinationPath $Temp

    $Root = [IO.Path]::GetFullPath($Book).TrimEnd("\", "/")
    $Files = @(Get-ChildItem $Temp -Recurse -File)

    if ($Files.Count -eq 0) {
        throw "ZIP package contains no files."
    }

    # Prepare destinations and verify they stay within docs/.
    foreach ($File in $Files) {
        $Relative = $File.FullName.Substring($Temp.Length).TrimStart("\", "/")
        $Target = [IO.Path]::GetFullPath((Join-Path $Book $Relative))
        $DocsRoot = [IO.Path]::GetFullPath((Join-Path $Book "docs"))

        if (-not $Target.StartsWith(
            $DocsRoot + [IO.Path]::DirectorySeparatorChar,
            [StringComparison]::OrdinalIgnoreCase
        )) {
            throw "Invalid destination: $Relative"
        }

        $Copies += [pscustomobject]@{
            Source = $File.FullName
            Target = $Target
            Relative = $Relative
        }
    }

    # Preserve original files before replacement.
    foreach ($Item in $Copies) {
        if (Test-Path -LiteralPath $Item.Target -PathType Leaf) {
            $Saved = Join-Path $Backup $Item.Relative
            New-Item -ItemType Directory -Path (
                Split-Path $Saved -Parent
            ) -Force | Out-Null

            Copy-Item -LiteralPath $Item.Target -Destination $Saved
        }
    }

    # Apply the package.
    foreach ($Item in $Copies) {
        New-Item -ItemType Directory -Path (
            Split-Path $Item.Target -Parent
        ) -Force | Out-Null

        Copy-Item -LiteralPath $Item.Source `
            -Destination $Item.Target -Force

        $Applied += $Item
        Write-Host "Installed: $($Item.Relative)" -ForegroundColor Green
    }

    # Validate the complete MkDocs site.
    Push-Location $Book
    try {
        python -m mkdocs build --strict

        if ($LASTEXITCODE -ne 0) {
            throw "MkDocs strict build failed."
        }
    }
    finally {
        Pop-Location
    }

    Write-Host ""
    Write-Host "BOOK UPDATE SUCCESSFUL" -ForegroundColor Green
    Write-Host "Files installed: $($Copies.Count)"
    Write-Host "Backup: $Backup"
    Write-Host ""
    git -C $Book status --short
}
catch {
    Write-Warning "Update failed. Restoring previous files."

    foreach ($Item in $Applied) {
        $Saved = Join-Path $Backup $Item.Relative

        if (Test-Path -LiteralPath $Saved) {
            Copy-Item -LiteralPath $Saved `
                -Destination $Item.Target -Force
        }
        elseif (Test-Path -LiteralPath $Item.Target) {
            Remove-Item -LiteralPath $Item.Target -Force
        }
    }

    throw
}
finally {
    if (Test-Path $Temp) {
        Remove-Item $Temp -Recurse -Force
    }
}
