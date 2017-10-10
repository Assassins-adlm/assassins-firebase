
import React, {Component} from 'react'
import MapBox from './MapBox'
import AppBar from 'material-ui/AppBar';

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
import LogOut from 'material-ui/svg-icons/content/add'
import LogOutAcc from 'material-ui/svg-icons/navigation/close'
import Paper from 'material-ui/Paper'

class App extends Component {
	state = {
		showLogin : false,
		showSign: false,
	}
	setIndex () {
		 this.props.firebase.set(`step`, 0)
	}
	showLogin () {
		let doIt = this.state.showLogin ? false : true
		this.setState({showLogin: doIt})
	}
	logout() {
		isLoaded(this.props.firebase) ? this.props.firebase.logout() : null
		this.props.firebase.set(`step`, 0)

	}


	render() {
		let a = isLoaded(this.state.profile) ? this.state.profile.name : ''
			console.log(this.props)
		return (
			<div  style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<div>
					<AppBar
						title={`Assassins ${a}`}
						iconClassNameRight="muidocs-icon-navigation-expand-more"
						iconElementLeft={isLoaded(this.props.step) &&  this.props.step !== 4 ? <IconButton tooltip='SignUp' iconStyle={{background: 'white'}} touch={true}   onClick={this.setIndex.bind(this)}>
							<LogOut  />
						</IconButton> : null}
						iconElementRight={isEmpty(this.props.auth) ? <IconButton tooltip='Login' iconStyle={{background: 'grey'}} touch={true}   onClick={this.showLogin.bind(this)}>
							<LogOut  />
						</IconButton> : <IconButton tooltip='Logout' iconStyle={{background: 'red'}} touch={true}   onClick={this.logout.bind(this)}>
							<LogOutAcc  />
						</IconButton>}
					/>


				</div>
				{this.state.showLogin && isEmpty(this.props.auth) ? <Login/> : null}
				{isLoaded(this.props.step) &&  this.props.step !== 4  ? <SignUp/> :
				<div>
					<Paper> { `${!isEmpty(this.props.profile) ? 'You\'re signed in, ' + this.props.profile.name : ``}` } </Paper>
					<MapBox />
				</div>}
			</div>

		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'} , {path: 'step'}
])(App)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
	step: dataToJS(firebase, '/step'),
	auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(fbWrapped)






