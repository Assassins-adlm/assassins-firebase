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
		// this.submitTarget = this.submitTarget.bind(this)
	}

	// submitTarget(myRef, target) {
	// 	// console.log('submit target!', this.props)
	// 	// console.log('me-->', myRef, 'target-->', target)
	// 	myRef.update({target: target.id})
	// 	this.setState({myTarget: target})
	// }

	render() {
		// console.log('target props-->', this.props)
		let targetId = this.props.target.id,
			myId = this.props.auth.uid,
			target = null,
			me = null
		const {players} = this.props
		const myRef = firebase.database().ref(`/players/${myId}`)
		// console.log('my ref-->', myRef)
		for (let key in players) {
			if (players[key].id===targetId) {
				target = players[key]
			}
			if (players[key].id===myId) {
				me = players[key]
			}
		}
		// console.log('target-->', target)
		return (
			<div>
				<h1>this is: {target.name}</h1>
				{
					!me.target && <button onClick={() => this.props.submitTarget(myRef, target)}>target</button>
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
