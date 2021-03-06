
import React, {Component} from 'react'
import MapBox from './MapBox/MapBox'
import AppBar from 'material-ui/AppBar';

import '../index.css'
import {connect} from 'react-redux'
import Login from './LoginSignup/Login'
import Drawer from './NavbarItems/Drawer'
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
import Nav from 'material-ui/svg-icons/navigation/menu'
import Paper from 'material-ui/Paper'

class App extends Component {
	state = {
		showLogin : false,
		showSign: false,
	}
	setIndex () {
		isEmpty(this.props.auth) ? this.props.firebase.set(`step`, 0) : null
	}
	showLogin () {
		let doIt = this.state.showLogin ? false : true
		this.setState({showLogin: doIt})
	}
	logout() {
		this.props.firebase.set(`step`, 0)
		isLoaded(this.props.firebase) ? this.props.firebase.logout() : this.props.firebase.set(`step`, 0)
	}


	render() {
		let a = isLoaded(this.state.profile) ? this.state.profile.name : ''
		return (
			<div  style={{width: '100%'}}>
				<div>
					<AppBar
						style={{backgroundColor: 'black', fontcolor: 'white' , backgroundImage: 'url(http://www.unixstickers.com/image/data/stickers/guyfawkes/guyfawkes.sh.png)',
						backgroundSize: '50px', backgroundPosition: 'left', backgroundRepeat: 'no-repeat', backgroundPositionX: '33%',
						}}
						className='navBar'
						titleStyle={{color: 'white', textAlign: 'center' , fontFamily: 'courier' }}
						title={`Assassins ${a}`}
						iconElementLeft={ isEmpty(this.props.auth)? <IconButton tooltip='SignUp' iconStyle={{background: 'white'}} touch={true}   onClick={this.setIndex.bind(this)}>
							<LogOut  />
						</IconButton> : !isEmpty(this.props.auth) && (isLoaded(this.props.step) ? this.props.step === 4: false)   ? <Drawer/> : null}
						iconElementRight={isEmpty(this.props.auth) ? <IconButton tooltip='Login' iconStyle={{background: 'white'}} touch={true}   onClick={this.showLogin.bind(this)}>
							<LogOut  />
						</IconButton> : <IconButton tooltip='Logout' iconStyle={{background: 'red'}} touch={true}   onClick={this.logout.bind(this)}>
							<LogOutAcc  />
						</IconButton>}
					/>


				</div>
				{this.state.showLogin && isEmpty(this.props.auth) ? <Login/> : null}
				{ this.props.step !== 4  ? <SignUp/> :  <div>  <Paper className='signInInfo'> { `${!isEmpty(this.props.profile) ? 'You\'re signed in, ' + this.props.profile.name : ``}` } </Paper> </div>}
				{!isEmpty(this.props.auth) ? <MapBox /> : null}

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






