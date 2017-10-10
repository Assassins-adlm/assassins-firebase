
import React, {Component} from 'react'
import MapBox from './MapBox'

import SideBar from './SideBar'
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
import IconButton from 'material-ui/IconButton'
import LogOut from 'material-ui/svg-icons/navigation/cancel'

class App extends Component {
	render() {
		return (
			<div  style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<IconButton tooltip="Close" touch={true} style='background-color: red' >
					<LogOut style='background-color: red' />
				</IconButton>

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
	step: pathToJS(firebase, '/step'),
	auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(fbWrapped)






