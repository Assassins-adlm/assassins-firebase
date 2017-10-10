
import React, {Component} from 'react'
import MapBox from './MapBox'

import SideBar from './SideBar'
import MapBox from './MapBox'
import '../index.css'
import {connect} from 'react-redux'
import Login from './LoginSignup/Login'
import {compose} from 'redux'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'
import SignUp from './LoginSignup/SignUp'

class App extends Component {
	render() {
		console.log(this.props)
		return (
			<div  style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<SideBar/>
				<Login/>
				<SignUp/>
			</div>
		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'}
])(App)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
	auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(fbWrapped)






