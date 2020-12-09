import React from 'react'
import App from '@components/App'
import fetchHello from '@utils/fetchHello'
import { act, screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('../utils/fetchHello.js')

describe('App.js', () => {
  beforeEach(()=> {
    process.env.API_BASE_URL = "http://localhost:3000"
    fetchHello.mockReset()
  })

  it('should handle success', async () => {
    fetchHello.mockResolvedValue(true)
    render(<App/>)
    
    await act(async () => fetchHello)
    const [args] = fetchHello.mock.calls
    const [baseURL, onSuccess, onFailure, options] = args

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(fetchHello).toHaveBeenCalledTimes(1)
    expect(baseURL).toBe('http://localhost:3000')
    expect(options.cancelToken).toBeTruthy()
    expect(onFailure).toBeTruthy()

    act(() => onSuccess({hello: "world"}))
    expect(screen.getByText(JSON.stringify({hello: "world"})))
  })

  it('should handle failure', async () => {
    fetchHello.mockResolvedValue(false)

    render(<App/>)

    await act(async ()=> fetchHello)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    const [args] = fetchHello.mock.calls
    const [baseURL, onSuccess, onFailure, options] = args
    
    expect(fetchHello).toHaveBeenCalledTimes(1)
    expect(baseURL).toBe('http://localhost:3000')
    expect(options.cancelToken).toBeTruthy()
    expect(onSuccess).toBeTruthy()

    
    act(() => onFailure({message: 'error'}))
    expect(screen.getByText(JSON.stringify({message: 'error'})))
  })
})