import axios from 'axios'
import {newProvider, defaultHeaders, defaultBaseURL} from '@test/setup/newProvider'

const provider = newProvider('ui', 'api')

describe('hello', () => {
  beforeAll(async () => provider.setup())

  it('should be successful', async () => {
    await provider.addInteraction({
      uponReceiving: 'hello',
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


    const helloURL = new URL('/hello', defaultBaseURL)
    const res = await axios.get(helloURL.href)
    expect(res.status).toBe(200)
    expect(res.data).toEqual({
      status: 200,
      success: true,  
      message: "",
      data: "hello"
    })
  })

  it('should successfully call helloWithName endpoint', async () => {
    await provider.addInteraction({
      uponReceiving: 'helloWithName',
      withRequest: {
        method: 'GET',
        path: '/hello/john',
      },
      willRespondWith: {
        status: 200,
        headers: defaultHeaders,
        body: {
          status: 200,
          success: true,  
          message: "",
          data: "hello John"
        },
      },
    })

    const helloWithNameURL = new URL('/hello/john', defaultBaseURL)
    const res = await axios.get(helloWithNameURL.href)  
    expect(res.status).toBe(200)
    expect(res.data).toEqual({status: 200, success: true, message: "", data: "hello John"})
  })

  afterEach(() => provider.verify())
  afterAll(() => provider.finalize())
})
