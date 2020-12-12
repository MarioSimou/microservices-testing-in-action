import React from 'react'
import App from '@components/App'
import fetchHello from '@utils/fetchHello'
import fetchHelloWithName from '@utils/fetchHelloWithName'
import { act, render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('../utils/fetchHello.js')
jest.mock('../utils/fetchHelloWithName.js')

afterEach(cleanup)

describe('App.js', () => {
  beforeEach(()=> {
    process.env.API_BASE_URL = "http://localhost:3000"
    fetchHello.mockReset()
    fetchHelloWithName.mockReset()
  })

  describe('fetchHelloWithName', () => {
    it('should handle success', async () => {
      fetchHelloWithName.mockResolvedValue(true)
      fetchHello.mockResolvedValue(true)

      const {getAllByText, getByTestId} = render(<App/>)

      expect(getAllByText(/Loading/).length).toBe(2)

      await act(async () => fetchHelloWithName)

      const [args] = fetchHelloWithName.mock.calls
      
      expect(args[0]).toBe('http://localhost:3000')
      expect(args[1]).toBe('foo')
      expect(args[2]).toBeTruthy()
      expect(args[3]).toBeTruthy()
      expect(args[4].cancelToken).toBeTruthy()

      await act(async () => args[2]({hello: "hello Foo"}))
      
      expect(getByTestId('helloWithName').textContent).toEqual(JSON.stringify({hello: 'hello Foo'}))
    })

    it('should handle failure', async () => {
      fetchHelloWithName.mockResolvedValue(false)
      fetchHello.mockResolvedValue(true)

      const {getAllByText, getByTestId} = render(<App/>)

      expect(getAllByText(/Loading/).length).toBe(2)

      await act(async () => fetchHelloWithName)

      const [args] = fetchHelloWithName.mock.calls
      
      expect(args[0]).toBe('http://localhost:3000')
      expect(args[1]).toBe('foo')
      expect(args[2]).toBeTruthy()
      expect(args[3]).toBeTruthy()
      expect(args[4].cancelToken).toBeTruthy()

      await act(async () => args[3]({message: "error"}))
      
      expect(getByTestId('helloWithName').textContent).toEqual(JSON.stringify({message: 'error'}))
    })
  })

  describe('fetchHello', () => {
    it('should handle success', async () => {
      fetchHello.mockResolvedValue(true)
      fetchHelloWithName.mockResolvedValue(true)
      const {getAllByText, getByTestId} = render(<App/>)
  
      expect(getAllByText('Loading...').length).toBe(2)
  
      await act(async () => fetchHello)
  
      const [argsFetchHello] = fetchHello.mock.calls
  
      expect(fetchHello).toHaveBeenCalledTimes(1)
      expect(argsFetchHello[0]).toBe('http://localhost:3000')
      expect(argsFetchHello[2]).toBeTruthy()
      expect(argsFetchHello[3].cancelToken).toBeTruthy()
  
      act(() => argsFetchHello[1]({hello: "world"}))
  
      expect(getByTestId('helloPlain').textContent).toEqual(JSON.stringify({hello: "world"}))
    })

    it('should handle failure', async () => {
      fetchHello.mockResolvedValue(false)
      fetchHelloWithName.mockResolvedValue(true)
  
      const {getAllByText, getByTestId} = render(<App/>)
      
      expect(getAllByText(/Loading/).length).toBe(2)

      await act(async ()=> fetchHello)

      const [argsFetchHello] = fetchHello.mock.calls
  
      expect(fetchHello).toHaveBeenCalledTimes(1)
      expect(argsFetchHello[0]).toBe('http://localhost:3000')
      expect(argsFetchHello[1]).toBeTruthy()
      expect(argsFetchHello[3].cancelToken).toBeTruthy()
  
      act(() => argsFetchHello[2]({message: "error"}))
        
      expect(getByTestId('helloPlain').textContent).toBe(JSON.stringify({message: 'error'}))
    })

  })
})