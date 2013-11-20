onejs = bin "one/onejs"
prova = cmd.async './bin/prova'

all 'web/dist', 'test-node', 'test-browser'

target 'web/dist', 'lib', 'web/app', ->
  onejs 'web/app/globals.js -o web/dist/globals.js'
  onejs 'web/app/index.js -o web/dist/prova.js'

task 'test-node', ->
  prova 'test/index -t 2500'

task 'test-browser', ->
  prova 'test/index.js -b -t 2500'
