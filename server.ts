import express from 'express'
import { print } from 'listening-on'
import { env } from './env'

let app = express()

app.use(express.text())

let rooms = new Map<string, string>()

app.post('/text', async (req, res) => {
  let room = req.query.room as string || ''
  let text = req.body
  rooms.set(room, text)
  res.end()
})

app.get('/text', (req, res) => {
  let room = req.query.room as string || ''
  let text = rooms.get(room) || ''
  res.end(text)
})

app.get('/', (req, res) => {
  let room = req.query.room as string || ''
  let text = rooms.get(room) || ''
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
        overflow: hidden;
      }
      #app {
        height: calc(100dvh - 0.5rem);
        display: flex;
        flex-direction: column;
        padding: 0.25rem;
        gap: 0.25rem;
      }
      .menu {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
      }
      #textInput {
        flex: 1;
      }
      #refreshButton {
        color: black;
      }
      #saveButton {
        margin-right: 1rem;
        color: red;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="menu">
        <label>Slug: <input type="text" id="roomInput" placeholder="Room"></label>
        <button id="refreshButton">Refresh</button>
      </div>
      <textarea id="textInput"></textarea>
      <div class="menu">
        <button id="saveButton">Save</button>
      </div>
    </div>
    <script>
      let room = ${JSON.stringify(room)}
      roomInput.value = room

      let text = ${JSON.stringify(text)}
      textInput.value = text

      if (room === '') {
        roomInput.focus()
      } else {
        textInput.focus()
      }

      textInput.oninput = resetSaveButton
      function resetSaveButton() {
        saveButton.textContent = 'Save'
      }

      // save by Ctrl + Enter
      textInput.onkeydown = checkSaveKey
      function checkSaveKey(event) {
        if (event.ctrlKey && event.key === 'Enter') {
          saveText()
        }
      }

      roomInput.onchange = switchRoom
      function switchRoom() {
        console.log('switchRoom')
        let params = new URLSearchParams()
        params.set('room', roomInput.value)
        let url = '/?' + params
        history.pushState({}, '', url)
        loadText()
      }

      refreshButton.onclick = loadText
      window.onpopstate = loadText
      async function loadText() {
        console.log('loadText')
        let url = '/text' + location.search
        let res = await fetch(url)
        let text = await res.text()
        textInput.value = text
        textInput.focus()
      }

      saveButton.onclick = saveText
      async function saveText() {
        console.log('saveText')
        let url = '/text' + location.search
        let text = textInput.value
        let res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: text,
        })
        if (!res.ok) {
          saveButton.textContent = 'Save Failed'
          let result = res.statusText || ('status: ' + res.status)
          alert(result)
          return
        }
        saveButton.textContent = 'Saved'
      }
    </script>
  </body>
</html>`)
  res.end()
})

app.listen(env.PORT, () => {
  print(env.PORT)
})
