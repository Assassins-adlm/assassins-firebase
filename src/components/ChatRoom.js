import React from 'react';
import firebase from '../fire';
import {Link} from 'react-router-dom';
import '../chatRoom.css';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
  }

  componentDidMount() {
    let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      let message = {
        text: {
          name: snapshot.val().name,
          body: snapshot.val().body
        },
        id: snapshot.key
      }
      console.log('message--->', message)
      this.setState({ messages: [message].concat(this.state.messages) });
    })
    firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user});
		});
  }

  addMessage(e) {
    e.preventDefault();
    console.log('body-->', this.inputEl.value)
    console.log('user-->', this.state.user.displayName)
    if (this.inputEl.value.length){
      let message = {
        name: this.state.user.displayName,
        body: this.inputEl.value
      }
      firebase.database().ref('messages').push(message);
      this.inputEl.value = '';
    }
  }

  render() {
    return (
      this.state.user ?
      <div id="wrapper" className="row">
        <div className="col-xs-12">
          <div id="menu">
              <p className="welcome">Welcome, <b>{this.state.user.displayName}</b></p>
              <p className="logout"><Link id="exit" to="/home">Exit Chat</Link></p>
              <div style={{clear:"both"}}></div>
          </div>

          <div id="chatbox">
            <ul>
                {
                  this.state.messages.map( message => <li key={message.id}>{message.text.name}: {message.text.body}</li> )
                }
            </ul>
          </div>

          <form name="message" onSubmit={this.addMessage.bind(this)}>
              <input name="usermsg" type="text" id="usermsg" size="63" ref={ el => this.inputEl = el }/>
              <input name="submitmsg" type="submit"  id="submitmsg" value="Send" />
          </form>
        </div>
      </div> : <Link to="/home">Please Login!</Link>
    )
  }
}
