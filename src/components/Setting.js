import React from 'react'
import {connect} from 'react-redux'
import firebase from '../fire'
import { compose } from 'redux'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'

class Setting extends React.Component {

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {

		}
		console.log('props user id-->', this.props)
	}

	render() {
		return (
			// <form>

			// </form>
			<div>this is my setting page!</div>
		)
	}
}

const mapState = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players')
	}
}

export default compose(
	firebaseConnect([{path: 'players'}, {path: 'auth'}]),
	connect(mapState)
)(Setting)
