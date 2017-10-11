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

	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		myTarget: {},
	// 		me: {}
	// 	}
	// }

	// componentDidMount() {
	// 	const {players} = this.props
	// 	let targetId = this.props.target.id,
	// 		myId = this.props.auth.uid,
	// 		myTarget={},
	// 		me={}
	// 	// console.log('my ref-->', myRef)
	// 	for (let key in players) {
	// 		if (players[key].id===targetId) {
	// 			myTarget = players[key]
	// 		} else if (players[key].id===myId) {
	// 			me = players[key]
	// 		}
	// 	}
	// 	this.setState({myTarget, me})
	// }

	render() {
		const {submitTarget, target, currPlayer} = this.props
		console.log('target-->', target.name)
		return (
			<div>
				<h1>this is: {target.name}</h1>
				<p>score: {target.kills || 0}</p>
				{
					!currPlayer.target && currPlayer.status!=='dead' && <button onClick={() => submitTarget(target)}>target</button>
				}
			</div>
		)
	}
}

export default MyTarget
