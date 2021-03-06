use Rack::Static,
  :urls => ["/vendor", "/images", "/js", "/css"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('public/minesweeper.html', File::RDONLY)
  ]
}