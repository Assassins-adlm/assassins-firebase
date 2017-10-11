import React from 'react'
import firebase from '../fire'
import { Link } from 'react-router-dom'
import '../chatRoom.css'

import {fetchAllMessages, fetchPlayers} from '../store'
import { compose } from 'redux'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'

class ChatRoom extends React.Component {

	componentDidMount() {
		this.props.fetchAllMessages()
		this.props.fetchPlayers()
		//change chatbox view depending on selected player
		//push message to the selected player
		//attach an id to the message to the person I'm messaging
		//attach an id to the message of the person who messaged me back
	}
	componentDidUpdate() {
		let el = this.refs.chatbox
		el.scrollTop = el.scrollHeight
	}

	addMessage(e) {
		e.preventDefault()
		if (this.inputEl.value.length){
			let message = {
				name: this.props.auth.displayName,
				body: this.inputEl.value
			}
			firebase.database().ref('messages').push(message)
			this.props.fetchAllMessages()
			this.inputEl.value = ''
		}
	}

	handleChange(e){
		let selectPlayer = e.target.value || 'All'
		let players = this.props.players
		let id = players.filter(player => player.name === selectPlayer)[0].id || 'All'
		console.log('SUP ', selectPlayer)
		// console.log('something', e.target.value)
	}

	render() {
		return (
			isLoaded(this.props.auth) ?
				<div id="wrapper" className="row">
					<div className="col-xs-12">
						<div id="menu">
							<p className="welcome">Welcome, <b>{this.props.auth.displayName}</b></p>
							
							<p>
								<select onChange={this.handleChange.bind(this)}>
									<option>All</option>
									{
										this.props.players.map((player, ind) =>{
											return(
												<option key={ind}>{player.name}</option>
											)
										})
									}
								</select>
							</p>
							<p className="logout"><Link id="exit" to="/home">Exit Chat</Link></p>
							<div style={{clear:'both'}}></div>
						</div>

						<div id="chatbox" ref="chatbox">
							<ul style={{listStyle: 'none'}}>
								{
									Array.isArray(this.props.messages) && this.props.messages.map((message,ind) =>{
										return (
											<li key={ind}>{message.name}: {message.body}</li>
										)
									}) 
								}
							</ul>
						</div>
						<form name="message" onSubmit={this.addMessage.bind(this)}>
							<input name="usermsg" type="text" id="usermsg" autoComplete="off" size="63" ref={ el => this.inputEl = el }/>
							<input name="submitmsg" type="submit"  id="submitmsg" value="Send" />
						</form>
					</div>
				</div> :  <Link to="/home">Please Login!</Link>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		messages: state.message,
		players: state.player.players
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchAllMessages() {
			dispatch(fetchAllMessages())
		},
		fetchPlayers(){
			dispatch(fetchPlayers())
		}
		
	}
}

export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(ChatRoom)