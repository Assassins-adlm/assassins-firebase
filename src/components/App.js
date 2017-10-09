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
			<div className='mainComp'>
				<SideBar />
				<Login/>
				<SignUp/>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(App)





