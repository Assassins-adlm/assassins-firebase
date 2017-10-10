import React from 'react'
import firebase from '../fire'
import {Link} from 'react-router-dom'
import '../chatRoom.css'

import {fetchAllMessages} from '../store'
import { compose } from 'redux'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'
// import ReactDOM from 'react-dom'

class ChatRoom extends React.Component {

	componentDidMount() {
		this.props.fetchAllMessages()
		this.scrollToBottom()
	}
	componentDidUpdate() {
		this.scrollToBottom()
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

	scrollToBottom() {
		// const node = ReactDOM.findDOMNode(this.messagesEnd);
		// node.scrollIntoView({ behavior: "smooth" });
		const obj = isLoaded(this.refs.endMessage)?this.refs.endMessage : <div>...Loading</div>
		// obj.scrollIntoView()
		console.log('find me dude ',obj)
	}

	render() {
		return (
			isLoaded(this.props.auth) ?
				<div id="wrapper" className="row">
					<div className="col-xs-12">
						<div id="menu">
							<p className="welcome">Welcome, <b>{this.props.auth.displayName}</b></p>
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
						<div style={{ float:"left", clear: "both" }}
							ref="endMessage">
						</div>


						<form name="message" onSubmit={this.addMessage.bind(this)}>
							<input name="usermsg" type="text" id="usermsg" size="63" ref={ el => this.inputEl = el }/>
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

