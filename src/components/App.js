import React, { Component } from 'react'
import MapBox from './MapBox'
import SideBar from './SideBar'
import '../index.css'
import {connect} from 'react-redux'
import Login from './LoginSignup/Login'
import { compose } from 'redux'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'
import SignUp from './LoginSignup/SignUp'

class App extends Component {
	render() {

		return (
			! isLoaded(this.props.profile) ?
				<div className='mainComp'>
					<SideBar />
					<Login/>
					<SignUp/>
				</div> :
				<div>Welcome {isLoaded(this.props.profile.name) ? this.props.profile.name : 'Joe'
				}</div>
		)
	}
}





const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}
])(App)

export default connect(({ firebase }) => ({
	profile: pathToJS(firebase, 'players'),
	players: dataToJS(firebase, '/players'),
	auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(fbWrapped)




