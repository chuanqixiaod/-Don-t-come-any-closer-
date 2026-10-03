Add-Type -AssemblyName System.Web
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
$root = 'c:\Users\11749\seatgame-web'
Write-Host 'Server started on http://localhost:8080/'
while($listener.IsListening){
  $ctx = $listener.GetContext()
  $url = $ctx.Request.Url.AbsolutePath
  if($url -eq '/'){ $url = '/prototype.html' }
  $file = Join-Path $root $url.TrimStart('/')
  if(Test-Path $file -PathType Leaf){
    $buf = [IO.File]::ReadAllBytes($file)
    $ctx.Response.ContentType = 'text/html; charset=utf-8'
    $ctx.Response.ContentLength64 = $buf.Length
    $ctx.Response.OutputStream.Write($buf,0,$buf.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
