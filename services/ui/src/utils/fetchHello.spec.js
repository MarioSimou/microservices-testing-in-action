import {fetchHello} from "../utils/fetchHello"
import axios from 'axios'

jest.mock('axios')

describe('fetchHello.js', () => {
  const baseURL = 'http://localhost:3000'
  const options = { timeout: 10000 }

  beforeEach(() => axios.mockReset())

  it('should succeed', async () => {
    const loggerStub = jest.fn(e => null);
    const onSuccessStub = jest.fn(data => null)
    const onFailureStub = jest.fn(e => null)
    const responseData = {
      data: {
        status: 200,
        success: true,
        data: 'hello'
      },
      status: 200,
    }

    axios.get.mockResolvedValue(responseData)

    await fetchHello(loggerStub)(baseURL, onSuccessStub, onFailureStub, options)

    expect(onSuccessStub.mock.calls[0][0]).toEqual(responseData.data)
    expect(onFailureStub.mock.calls.length).toBe(0)
    expect(loggerStub.mock.calls.length).toBe(0)
    expect(axios.get.mock.calls[0]).toEqual([
      `${baseURL}/hello`,
      options,
    ])
  })

  it('should fail', async () => {
    const loggerStub = jest.fn(e => null);
    const onSuccessStub = jest.fn(data => null)
    const onFailureStub = jest.fn(e => null)
    const internalServerError = new Error('Error: Internal Server Error')

    axios.get.mockRejectedValue(internalServerError)

    await fetchHello(loggerStub)(baseURL, onSuccessStub, onFailureStub, options)

    expect(onSuccessStub.mock.calls.length).toBe(0)
    expect(onFailureStub.mock.calls[0][0]).toEqual(internalServerError)
    expect(axios.get.mock.calls[0]).toEqual([
    `${baseURL}/hello`,
      options,
    ])
    expect(loggerStub.mock.calls[0][0]).toEqual(internalServerError)
  })

  it('should return an invalid status code in the payload', async () => {
    const loggerStub = jest.fn(e => null);
    const onSuccessStub = jest.fn(data => null)
    const onFailureStub = jest.fn(e => null)
    const responseData = {
      data: {
        status: 400,
        message: 'Error: Internal Server Error'  
      },
    }

    axios.get.mockResolvedValue(responseData)

    await fetchHello(loggerStub)(baseURL, onSuccessStub, onFailureStub, options)

    expect(onSuccessStub.mock.calls.length).toBe(0)
    expect(onFailureStub.mock.calls[0][0]).toEqual(new Error('Error: Internal Server Error'))
    expect(loggerStub.mock.calls[0][0]).toEqual(new Error('Error: Internal Server Error'))
    expect(axios.get.mock.calls[0]).toEqual([
    `${baseURL}/hello`,
      options,
    ])

  })
})