import React from 'react'
import firebase from '../fire'
import {
	firebaseConnect,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'

class MyTarget extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			myTarget: {},
			me: {}
		}
		this.submitTarget = this.submitTarget.bind(this)
	}

	submitTarget(myRef, target) {
		// console.log('submit target!', this.props)
		console.log('me-->', myRef, 'target-->', target)
		myRef.update({target: target.id})
	}

	render() {
		console.log('player-->', this.props)
		let targetId = this.props.target.id,
			myId = this.props.auth.uid,
			players = this.props.players,
			target = null,
			me = null,
		  myRef = firebase.database().ref(`/players/${myId}`)
		console.log('my ref-->', myRef)
		for (let key in players) {
			if (players[key].id===targetId) {
				target = players[key]
			}
			if (players[key].id===myId) {
				me = players[key]
			}
		}
		return (
			<div>
				<h1>this is: {target.name}</h1>
				{
					!me.target.length && <button onClick={() => this.submitTarget(myRef, target)}>target</button>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	// console.log('state-->', state)
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(MyTarget)
