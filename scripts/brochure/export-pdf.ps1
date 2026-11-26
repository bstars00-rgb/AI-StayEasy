# Turns the .pptx files built by build.cjs into PDFs with PowerPoint.
#   -Dir  folder with the .pptx files     -Out  folder for the PDFs     -Png  optional folder for page previews
param([Parameter(Mandatory)][string]$Dir, [Parameter(Mandatory)][string]$Out, [string]$Png)
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force $Out | Out-Null
$ppt = New-Object -ComObject PowerPoint.Application
try {
  foreach ($file in Get-ChildItem $Dir -Filter *.pptx) {
    $pres = $ppt.Presentations.Open($file.FullName, $true, $false, $false)
    $pres.SaveAs((Join-Path (Resolve-Path $Out) "$($file.BaseName).pdf"), 32)
    if ($Png) {
      New-Item -ItemType Directory -Force $Png | Out-Null
      for ($i = 1; $i -le $pres.Slides.Count; $i++) {
        $pres.Slides.Item($i).Export((Join-Path (Resolve-Path $Png) "$($file.BaseName)-p$i.png"), 'PNG', 620, 877)
      }
    }
    Write-Output "$($file.BaseName): $($pres.Slides.Count) pages"
    $pres.Close()
  }
} finally {
  $ppt.Quit()
}
