import axios from 'axios'


export const fetchHelloWithName = (logger = console.log) => async (baseURL, name, onSuccess, onFailure, options = {}) => {
  try {
    const helloURL = new URL(`/hello/${name}`, baseURL)
    const {data} = await axios.get(helloURL.href, options)

    if(!data.success){
      throw new Error(data.message)
    }

    return onSuccess(data)
  }catch(e){
    logger(e)
    return onFailure(e)
  }
}

export default fetchHelloWithName(console.log)