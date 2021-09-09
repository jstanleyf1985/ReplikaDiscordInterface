import { createGlobalStyle } from 'styled-components'
import BGImage from '../img/defaultbg.png'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-image: url(${BGImage});
    background-attachment: flex;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: black;
  }

  body {
    margin: 0;
    padding: 0;
    height: 99.5%;
    width: 99.5%;
    -webkit-app-region: drag;
  }

  & .root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  & .ajs-dialog {
    -webkit-app-region: no-drag;
  }
`

export default GlobalStyle
