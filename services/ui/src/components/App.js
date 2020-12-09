import React from 'react'
import fetchHello from "@utils/fetchHello.js"
import axios from 'axios'

export const App = () => {
  const [pageContent, setPageContent] = React.useState("Loading...")
  const onSuccess = (data) => setPageContent(JSON.stringify(data))
  const onFailure = e => setPageContent(JSON.stringify(e))

  React.useEffect(() => {
    const source = axios.CancelToken.source();
    fetchHello(process.env.API_BASE_URL, onSuccess, onFailure, {cancelToken: source.token})
    return () => source.cancel()
  })

  return (
    <div id="app">
      {pageContent}
    </div>
  )
}

export default App