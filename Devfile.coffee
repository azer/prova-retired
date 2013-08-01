onejs = bin "one/onejs"
fox = cmd './bin/fox'

all 'web/dist', 'test'

target 'web/dist', 'web/app', ->
  onejs 'web/app/globals.js -o web/dist/globals.js'
  onejs 'web/app/index.js -o web/dist/fox.js'

task 'test', ->
  fox 'test/index.js -b'