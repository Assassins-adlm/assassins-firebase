import firebase from '../fire'


// ACTION TYPE
const ALL_MESSAGES = 'ALL_MESSAGES'


// INITITAL STATE
const messageState = {
	messages: []
}
// ACTION CREATOR

export function allMessages(message) {
	return {type: ALL_MESSAGES, message}
} 


// THUNKS
export const fetchAllMessages = () => dispatch => {
	let messagesRef = firebase.database().ref('messages').limitToLast(100)
	messagesRef.once('value').then(snapshot => {
		const snap = snapshot.val() || []
		const messages = Object.values(snap) 
		dispatch(allMessages(messages))
	})
}


// REDUCERS
export default function (state = messageState, action) {
	switch(action.type){
	case ALL_MESSAGES:
		return [...messageState.messages].concat(action.message)
	default: 
		return state
	}
            
}


