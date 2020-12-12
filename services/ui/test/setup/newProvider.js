import {Pact} from '@pact-foundation/pact'
import { integer } from '@pact-foundation/pact/dsl/matchers'
import path from 'path'

export const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

export const defaultBaseURL = 'http://localhost:4000'

let providerInstance

export const newProvider = (consumer, provider, options = {}) => {
  if(providerInstance){
    return providerInstance
  }

  providerInstance = new Pact({
    consumer,
    provider,
    port: 4000,
    logLevel: "WARN",
    log: path.resolve(process.cwd(), 'test', 'contract', 'pact.log'),
    dir: path.resolve(process.cwd(), 'test', 'contract', 'pact'),
    ...options
  })

  return providerInstance
}

