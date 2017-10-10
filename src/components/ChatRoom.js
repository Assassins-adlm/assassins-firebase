import React from 'react'
import firebase from '../fire'
import {Link} from 'react-router-dom'
import '../chatRoom.css'
// testing fetchAllMessages
import {fetchAllMessages} from '../store'
import { compose } from 'redux'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'

class ChatRoom extends React.Component {

	componentDidMount() {
		this.props.fetchAllMessages()
	}

	addMessage(e) {
		e.preventDefault()
		if (this.inputEl.value.length){
			let message = {
				name: this.state.user.displayName,
				body: this.inputEl.value
			}
			firebase.database().ref('messages').push(message)
			this.inputEl.value = ''
		}
	}

	render() {
		return (
		
			<div id="wrapper" className="row">
				<div className="col-xs-12">
					<div id="menu">
						<p className="logout"><Link id="exit" to="/home">Exit Chat</Link></p>
						<div style={{clear:'both'}}></div>
					</div>

					<div id="chatbox">
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
						<input name="usermsg" type="text" id="usermsg" size="63" ref={ el => this.inputEl = el }/>
						<input name="submitmsg" type="submit"  id="submitmsg" value="Send" />
					</form>
				</div>
			</div> 
		)
	}
}
// {
// 	this.state.messages.map( message => <li key={message.id}>{message.text.name}: {message.text.body}</li> )
// }

// : <Link to="/home">Please Login!</Link>

const mapStateToProps = (state) => {
	return {
		messages: state.message,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchAllMessages() {
			dispatch(fetchAllMessages())
		}
		
	}
}

export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(ChatRoom)

// console.log('wtf do we have here, ', fetchAllMessages)
		

// let messagesRef = firebase.database().ref('messages').limitToLast(100)
// messagesRef.once('value').then(snapshot =>{
// 	const message = Object.values(snapshot.val())
// 	message.forEach(x => console.log(x.name, x.body))
// })
// this.props.fetchAllMessages()
		

// messagesRef.on('child_added', snapshot => {
// 	let message = {
// 		text: {
// 			name: snapshot.val().name,
// 			body: snapshot.val().body
// 		},
// 		id: snapshot.key
// 	}
// 	this.setState({ messages: this.state.messages.concat(message) })
// })
// firebase.auth().onAuthStateChanged((user) => {
// 	this.setState({loading: false, user})
// })