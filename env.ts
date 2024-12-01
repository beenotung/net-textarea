import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export let env = {
  PORT: 8123,
}

populateEnv(env, { mode: 'halt' })
