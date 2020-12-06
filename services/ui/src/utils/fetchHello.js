import axios from 'axios'

export const fetchHello = (logger = console.log) => async (baseURL, onSuccess, onFailure, options = {}) => {
  try {
    const {data} = await axios.get(`${baseURL}/hello`, options)

    if(data.status !== 200 ){
      throw new Error(data.message)
    }
    
    return onSuccess(data)
  } catch(e){
    logger(e)
    return onFailure(e)
  }
}

export default fetchHello(console.log)