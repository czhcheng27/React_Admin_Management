import React from 'react'
import ReactDom from 'react-dom'

import App from './App'
import memoryUtlis from './utils/memoryUtlis'
import storageUtlis from './utils/storageUtlis'

const user = storageUtlis.getUser()
memoryUtlis.user = user

ReactDom.render(<App/>, document.getElementById('root'))