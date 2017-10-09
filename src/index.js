import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store/index.js'
import './index.css'
import Main from './components/Main'
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider>
			<Main />
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root'))
registerServiceWorker()
