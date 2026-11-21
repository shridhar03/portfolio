import { createApp } from './app.js'
import { loadEnv } from './config/env.js'

const env = loadEnv()
createApp(env).listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`)
})
