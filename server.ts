import express from 'express'
import { print } from 'listening-on'
import { env } from './env'

let app = express()

app.use(express.urlencoded({ extended: false }))

let text = ''

app.post('/', (req, res) => {
  text = req.body.text || ''
  res.redirect('/')
})

app.get('/text', (req, res) => {
  res.end(text)
})

app.get('/', (req, res) => {
  res.header('Content-Type', 'text/html')
  res.write(/* html */ `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clipboard</title>
    <style>
      body {
        margin: 0;
      }
      #main {
        display: flex;
        height: calc(100vh - 2rem);
      }
      textarea {
        margin: auto;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);
      }
    </style>
  </head>
  <body>
    <form method="post" action="/">
      <div id="main">
        <textarea id="text" name="text"></textarea>
      </div>
      <div style="display: flex">
        <div style="margin: auto">
          <input type="button" value="Refresh" onclick="location.reload()">
          <input type="submit" value="Save" />
        </div>
      </div>
    </form>
    <script>
			text.value = ${JSON.stringify(text)}
    </script>
  </body>
</html>`)
  res.end()
})

app.listen(env.PORT, () => {
  print(env.PORT)
})
