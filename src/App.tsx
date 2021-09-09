import React from 'react'
import { render } from 'react-dom'
import Dashboard from '../src/components/dashboard'
import Alertify from 'alertifyjs'

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
mainElement.setAttribute('class', 'root')
document.body.appendChild(mainElement)

// Run main process
const App = () => {
  return (
    <Dashboard />
  )
}

render(<App />, mainElement)
