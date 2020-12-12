import nock from 'nock'
import notFound from '@test/setup/mocks/notFound.json'
import badRequest from '@test/setup/mocks/badRequest.json'
import hello from '@test/setup/mocks/hello.json'

const cors = {
  'Access-Control-Allow-Origin': '*'
}

const mockServerFactory = (baseURL) => {
  const mockHello = (status) => {
    const instance = nock(baseURL).get('/hello')
    switch(status){
      case 200:
        return instance.reply(status, hello, cors)
      case 404:
        return instance.reply(status, notFound, cors)
      default:
        return instance.reply(status, badRequest, cors)
    }
  }
  const clean = () => nock.cleanAll()

  return {
    mockHello,
    clean,
  }
}

export default mockServerFactory