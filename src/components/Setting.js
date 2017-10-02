import React from 'react'
import {connect} from 'react-redux'
import firebase from '../fire'
import { compose } from 'redux'
import {Redirect} from 'react-router-dom'
import App from './App'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'

class Setting extends React.Component {

	constructor() {
		super()
		this.state = {
			redirect: false
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(e) {
		e.preventDefault()
		// console.log('name-->', e.target.name.value)
		const player = {
			id: this.props.auth.uid,
			name: e.target.name.value,
			// gender: e.target.gender.value,
			image: e.target.image.value
		}
		console.log('update player-->', player)
		this.props.firebase.database().ref('players/' + this.props.auth.uid).update(player)
		// need to redirected
		this.setState({redirect: true})
		// console.log(this.props)
	}

	render() {
		// console.log('auth-->', this.props.auth)
		// console.log('players->', this.props.myProfile)
		let currPlayer, players = this.props.myProfile
		if (players) {
			const {uid} = this.props.auth
			for (let key in players) {
				if (players[key].id === uid) {
					currPlayer = players[key]
				}
			}
		}
		console.log('curr player-->', currPlayer)
		if (this.state.redirect) {
			return <Redirect to="/home" component={App} />
		}
		return (
			currPlayer ?
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="col-md-4 control-label" htmlFor="textinput">Name</label>
						<div className="col-md-4">
							<input id="textinput" name="name" placeholder="input your name" className="form-control input-md" required="" defaultValue={currPlayer.name} type="text" />
						</div>
					</div>

					<div className="form-group">
						<label className="col-md-4 control-label" htmlFor="textinput">Avatar Image</label>
						<div className="col-md-4">
							<input type="file" name="image" accept="image/*" capture="user" />
						</div>
					</div>
					<input type="submit" value="Submit"/>
				</form> : <div></div>
		// <div>this is my setting page!</div>
		)
	}
}

const mapState = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players')
	}
}

// const mapDispatch = (dispatch) => {
// 	return {

// 	}
// }

export default compose(
	firebaseConnect([{path: 'players'}, {path: 'auth'}]),
	connect(mapState)
)(Setting)
