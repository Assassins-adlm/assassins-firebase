import React from 'react';
import firebase from '../fire';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user});
		});
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
      <div>
        <form onSubmit={this.addMessage.bind(this)}>
          {/* <label for="" name="name" value={} /> */}
          <input name="body" type="text" ref={ el => this.inputEl = el }/>
          <input type="submit"/>
        </form>
        <ul>
          {
            this.state.messages.map( message => <li key={message.id}>{message.text.name}: {message.text.body}</li> )
          }
        </ul>
      </div>
    )
  }
}
