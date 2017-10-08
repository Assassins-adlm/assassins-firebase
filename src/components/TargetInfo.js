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
		// console.log('target-->', target)
		return (
			<div>
				<h1>this is: {target.name}</h1>
				{
					!currPlayer.target && <button onClick={() => submitTarget(target)}>target</button>
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
