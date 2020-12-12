import React from 'react'
import fetchHello from "@utils/fetchHello.js"
import fetchHelloWithName from '@utils/fetchHelloWithName.js'
import axios from 'axios'

export const App = () => {
  const [helloPlain, setHelloPlain] = React.useState("Loading...")
  const [helloPlainWithName, setHelloWithName] = React.useState("Loading...")
  const onSuccessHelloPlain = (data) => setHelloPlain(JSON.stringify(data))  
  const onFailureHelloPlain = e => setHelloPlain(JSON.stringify(e))
  const onSuccessHelloPlainWithName = (data) => setHelloWithName(JSON.stringify(data))  
  const onFailureHelloPlainWithName = e => setHelloWithName(JSON.stringify(e))

  React.useEffect(() => {
    const source = axios.CancelToken.source();
    fetchHello(process.env.API_BASE_URL, onSuccessHelloPlain, onFailureHelloPlain, {cancelToken: source.token})
    fetchHelloWithName(process.env.API_BASE_URL, 'foo', onSuccessHelloPlainWithName, onFailureHelloPlainWithName, {cancelToken: source.token})
    return () => source.cancel()
  }, [])

  return (
    <div id="app">
      <div data-testid="helloPlain">{helloPlain}</div>
      <div data-testid="helloWithName">{helloPlainWithName}</div>
    </div>
  )
}

export default App