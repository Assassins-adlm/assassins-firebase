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
	messagesRef.once('value').then(snapshot =>{
		dispatch(allMessages(getMessages(snapshot.val())))
	})
}



// REDUCERS
export default function (state = messageState, action) {
	switch(action.type){
	case ALL_MESSAGES:
		return [...state].concat(action.message)
	default: 
		return state
	}
            
}

// HELPER FUNCS
const getMessages = messages =>{
	return Object.values(messages).map(message => 
	{
		message.name,
		message.body
	}
	)}



// export default function (state = playerState, action) {
// 	switch (action.type) {
// 	case CURRENT_PLAYER:
// 		return {
// 			...state,
// 			player: action.player
// 		}
// 	case ALL_PLAYERS:
// 		return {
// 			...state,
// 			players: action.players.map(player => {
// 				return {...player, openInfo: false}
// 			})
// 		}
// 	case TOGGLE_SELECTED_PLAYER:
// 		return {
// 			...state,
// 			players: state.players.map(player => player.id === action.player.id ? {...player, openInfo: !player.openInfo} : player)
// 		}
// 	case CURRENT_LOCATION:
// 		return Object.assign({}, state, { location: {latitude: action.location.latitude, longitude: action.location.longitude}})
// 	case CURRENT_TARGET:
// 		return {
// 			...state,
// 			target: action.target
// 		}
// 	default:
// 		return state
// 	}


// console.log(Object.values(snapshot.val()))
// let message = {
// 	text: {
// 		name: snapshot.val().name,
// 		body: snapshot.val().body
// 	},
// 	id: snapshot.key
// }
// let messagesRef = firebase.database().ref('messages').limitToLast(100)
// messagesRef.once('value').then(snapshot =>{
// 	const message = Object.values(snapshot.val())
// 	message.forEach(x => console.log(x.name, x.body))
// })
// }