import { Pact, Matchers } from '@pact-foundation/pact'
import path from 'path'
import axios from 'axios'

const provider = new Pact({
  consumer: 'ui',
  provider: 'api',
  port: 4000,
  logLevel: "WARN",
  log: path.resolve(__dirname, 'pact.log'),
  dir: path.resolve(__dirname, 'pact')
})

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
}

describe('hello', () => {
  beforeAll(async () => {
    await provider.setup()
  })

  it('should be successful', async () => {
    await provider.addInteraction({
      uponReceiving: 'hello success',
      withRequest: {
        method: 'GET',
        path: '/hello'
      },
      willRespondWith: {
        status: 200,
        body: {
          status: 200,
          success: true,
          message: "",
          data: "hello",
        },
        headers: defaultHeaders
      }
    })

    const res = await axios.get('http://localhost:4000/hello')
    expect(res.status).toBe(200)
    expect(res.data).toEqual({
      status: 200,
      success: true,  
      message: "",
      data: "hello"
    })
  })

  // it('should fail', async () => {
  //   await provider.addInteraction({
  //     uponReceiving: "hello failure",
  //     withRequest: {
  //       method: 'GET',
  //       path: '/hello',
  //     },
  //     willRespondWith: {
  //       status: 400,
  //       body: {
  //         status: 400,
  //         success: false,
  //         message: Matchers.like("error: bad request")
  //       },
  //       headers: defaultHeaders
  //     }
  //   })

  //   try {
  //     await axios.get('http://localhost:4000/hello')
  //   }catch(e){
  //     expect(e.response.status).toBe(400)
  //     expect(e.response.data).toEqual({
  //       status: 400,
  //       success: false,
  //       message: "error: bad request",
  //     })
  //   }
  // })

  afterEach(() => provider.verify())
  afterAll(() => provider.finalize())
})
