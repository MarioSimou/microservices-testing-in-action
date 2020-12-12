import newMockServer from '@test/setup/mockServer'
import axios from 'axios'

const baseURL = 'http://localhost:3000'
const mockServer = newMockServer(baseURL)

describe('mockServer', () => {
  
  describe('hello', () => {
    beforeEach(mockServer.clean)
    
    const url = new URL('hello', baseURL)

    it('should succeed to fetch the data', async () => {
      mockServer.mockHello(200)
      const res = await axios.get(url.href)
      expect(res.status).toBe(200)
      expect(res.data).toStrictEqual({
        status: 200,
        success: true,
        message: "",
        data: "hello"
      })
    })

    it('should fail to fetch the data', async () => {
      mockServer.mockHello(400)

      try {
        await axios.get(url.href)  
      }catch(e){
        expect(e.response.status).toBe(400)        
        expect(e.response.data).toStrictEqual({
          status: 400,
          success: false,
          message: "error: bad request"
        })
      }
    })
  })
})