import {fetchHelloWithName} from '@utils/fetchHelloWithName'
import axios from 'axios'

jest.mock('axios')

describe.only('fetchHelloWithName', () => {
  beforeEach(axios.mockReset)

  const baseURL = 'http://localhost:4000'

  it('should successfully fetch the data', async () => {
    const payload = {
      status: 200,
      success: true,
      data: 'hello john'
    }

    axios.get.mockResolvedValue({data: payload})
    const loggerStub = jest.fn(() => null)
    const onSuccessStub = jest.fn(()=> true)
    const onFailureStub = jest.fn(() => false)
    const options = {}
    const res = await fetchHelloWithName(loggerStub)(baseURL, 'john', onSuccessStub, onFailureStub, options)

    expect(res).toBe(true)
    expect(loggerStub.mock.calls.length).toBe(0)
    expect(onFailureStub.mock.calls.length).toBe(0)
    expect(onSuccessStub.mock.calls.length).toBe(1)
    expect(onSuccessStub.mock.calls[0][0]).toEqual(payload)
    expect(axios.get.mock.calls[0]).toEqual(['http://localhost:4000/hello/john', {}])
  })

  it('should handle an unsuccessful payload', async () => {
    const payload = {
      status: 400,
      success: false,
      message: "error: bad request",
    }

    axios.get.mockResolvedValue({data: payload})
    
    const loggerStub = jest.fn(() => null)
    const onSuccessStub = jest.fn(()=> true)
    const onFailureStub = jest.fn(() => false)
    const options = {}
    const res = await fetchHelloWithName(loggerStub)(baseURL, 'john', onSuccessStub, onFailureStub, options)

    expect(res).toBe(false)
    expect(loggerStub.mock.calls.length).toBe(1)
    expect(onFailureStub.mock.calls.length).toBe(1)
    expect(onSuccessStub.mock.calls.length).toBe(0)
    expect(onFailureStub.mock.calls[0][0].message).toEqual(payload.message)
    expect(axios.get.mock.calls[0]).toEqual(['http://localhost:4000/hello/john', {}])
  })

  it('should handle a failure', async () => {
    const payload = {
      status: 500,
      success: false,
      message: "error: internal server error",
    }

    axios.get.mockRejectedValue({response: {data: payload}})
    
    const loggerStub = jest.fn(() => null)
    const onSuccessStub = jest.fn(()=> true)
    const onFailureStub = jest.fn(() => false)
    const options = {}
    const res = await fetchHelloWithName(loggerStub)(baseURL, 'john', onSuccessStub, onFailureStub, options)

    expect(res).toBe(false)
    expect(loggerStub.mock.calls.length).toBe(1)
    expect(onFailureStub.mock.calls.length).toBe(1)
    expect(onSuccessStub.mock.calls.length).toBe(0)
    expect(loggerStub.mock.calls[0][0].response.data).toEqual(payload)
    expect(onFailureStub.mock.calls[0][0].response.data).toEqual(payload)
    expect(axios.get.mock.calls[0]).toEqual(['http://localhost:4000/hello/john', {}])
  })
})