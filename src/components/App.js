import React, { Component } from 'react'
import SideBar from './SideBar'
import MapBox from './MapBox'
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
		console.log(this.props)
		return (
			this.props.auth ?
				(
					<div className='mainComp'>
						<SideBar />
						<MapBox auth={this.props.auth}/>
					</div>
				):(
					<div className='mainComp'>
						<SideBar />
						<Login/>
						<SignUp/>
					</div>
				))
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(App)





