onejs = bin "one/onejs"
fox = cmd.async './bin/fox'

all 'web/dist', 'test-node', 'test-browser'

target 'web/dist', 'lib', 'web/app', ->
  onejs 'web/app/globals.js -o web/dist/globals.js'
  onejs 'web/app/index.js -o web/dist/fox.js'

task 'test-node', ->
  fox 'test/index -t 2500'

task 'test-browser', ->
  fox 'test/index.js -b -t 2500'
