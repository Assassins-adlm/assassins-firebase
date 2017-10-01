import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index.js'
import './index.css'
import Main from './components/Main'
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Main />
		</Router>
	</Provider>,
	document.getElementById('root'))
registerServiceWorker()
