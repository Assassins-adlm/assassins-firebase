import firebase from '../fire'
/**
 * ACTION TYPES
 */
// const CURRENT_PLAYER = 'CURRENT_PLAYER'
// const ALL_PLAYERS = 'ALL_PLAYERS'
// const TOGGLE_SELECTED_PLAYER = 'TOGGLE_SELECTED_PLAYER'
// const CURRENT_LOCATION = 'CURRENT_LOCATION'
const CURRENT_TARGET= 'CURRENT_TARGET'
const GUESS_PROMPT = 'GUESS_PROMPT'
const CURRENT_ASSASSIN = 'CURRENT_ASSASSIN'
// const CURRENT_STATUS = 'CURRENT_STATUS'
const NOTIFYTOKEN = 'NOTIFIYTOKEN'
/**
 * INITIAL STATE
 */
const playerState = {
	// player: {}, //player.tokenid
	// players: [],
	// location: {latitude: '' , longitude: ''},
	target: null,
	token: '',
	guessPrompt: false,
	assassin: null,
}

/**
 * ACTION CREATORS
 */

// export function currentPlayer  (player) {return {type: CURRENT_PLAYER, player}}
// export function allPlayers (players) {return {type: ALL_PLAYERS, players}}
// export function toggleSelectedPlayer (player) {return {type: TOGGLE_SELECTED_PLAYER, player}}
// export function currentLocation (location) {return {type: CURRENT_LOCATION, location}}
export function currentTarget (target) {return {type: CURRENT_TARGET, target}}
export function currentAssassin (assassin) {return {type: CURRENT_ASSASSIN, assassin}}
export function getToken (token) { return {type: NOTIFYTOKEN, token}}
export function guessPrompt (bool) {return {type: GUESS_PROMPT, bool}}


// thunk creators
// export const fetchCurrPlayer = (uid) => {
// 	return (dispatch) => {
// 		firebase.database().ref(`/players/${uid}`).once('value')
// 			.then(snapshot => {
// 				// let player = {...snapshot.val(), Locations:[]}
// 				dispatch(currentPlayer(filterPlayer(snapshot.val())))
// 			}, error => console.error(error))
// 	}
// }


// export const fetchPlayers = () => {
// 	return (dispatch) => {
// 		firebase.database().ref('/players').once('value')
// 			.then(snapshot => {
// 				dispatch(allPlayers(filterPlayers(snapshot.val())))
// 			}, error => console.error(error))
// 	}
// }

export const getCurrToken = (id) => {
	return () => {
		console.log( 'getting current token for:', id)
		firebase.messaging().getToken()
			.then( (tokenSnap) => {
				console.log('tokensnap', tokenSnap)
				firebase.database().ref(`/players/${id}`).update({token:tokenSnap})
					.then( () => { console.log ('updated Token Successfully')})
			})
	}
}

var key = 'AAAAdsUjORI:APA91bH2L8WHJdjWZO8R6DMxBGmhqA-PvXdAJrTYdHZUUybvfICkdCvqeTcwJmz8ij7c31VUXShQxpbVAnqYVghhDr0DSl5rBaxZHRLxOIXNDwkfyvblaCF6Cf8sstR4MM-5UJggtWuP'

var targetNotification = {
	'title': 'You Have Been Marked',
	'body':  'Be on the LookOut',
	'icon': 'firebase-logo.png',
	'click_action': 'http://localhost:3000'
}

export const addCurrTarget = (player, target) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${player.uid}`).update({target: target.uid})
			.then(() => {
				var to = target.token
				firebase.database().ref(`/players/${target.uid}`).once('value')
					.then(snapshot => {
						dispatch(currentTarget(snapshot.val()))
						// dispatch(currentPlayer({...player, target: target.uid}))
						fetch('https://fcm.googleapis.com/fcm/send', {
							'method': 'POST',
							'headers': {
								'Authorization': 'key=' + key,
								'Content-Type': 'application/json'
							},
							'body': JSON.stringify({
								'notification': targetNotification,
								'to': to
							})
						}).then(function(response) {
							console.log(response)
						}).catch(function(error) {
							console.error(error)
						})
					})
			})
			.then(() => {
				firebase.database().ref(`/players/${target.uid}`).update({beingTargeted: true})
			})
			.catch(error => console.error(error))
	}
}

// export const listeningAllPlayer = () => {
// 	return (dispatch) => {
// 		firebase.database().ref('/players')
// 			.on('value', snapshot => {
// 				console.log('listening all players-->', snapshot.val())
// 				dispatch(allPlayers(filterPlayers(snapshot.val())))
// 			})
// 	}
// }

// export const listeningMyself = (uid) => {
// 	return (dispatch) => {
// 		const playerRef = firebase.database().ref(`/players/${uid}`)
// 		playerRef
// 			.on('value', snapshot => {
// 				let player = filterPlayer(snapshot.val())
// 				dispatch(currentPlayer(player))
// 				if (player.assassin) {
// 					firebase.database().ref(`/players/${player.assassin}`).once('value')
// 						.then(snapshot => {
// 							dispatch(currentAssassin(filterPlayer(snapshot.val())))
// 							dispatch(guessPrompt('true'))
// 						})
// 				}
// 				if (player.target) {
// 					dispatch(listeningTarget(player.target))
// 				}
// 			})
// 	}
// }

// var offTargetRef

// export const listeningTarget = (targetId) => {
// 	return (dispatch) => {
// 		offTargetRef = firebase.database().ref(`/players/${targetId}`)
// 			.on('value', snapshot => {
// 				dispatch(currentTarget(snapshot.val()))
// 			})
// 	}
// }

// export const offTarget = (targetId) => {
// 	return (dispatch) => {

// 	}
// }

export const battle = (player, target) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${target.uid}`).update({assassin: player.uid, beingTargeted: false})
			.then(() => {
				console.log('kill command!')
			})
	}
}

export const revivePlayer = (player) => {
	return () => {
		firebase.database().ref(`/players/${player.uid}`).update({status: 'alive'})
	}
}

export const setStatus = (player, role, status) => {
	console.log('player-->', player, 'status-->', status)
	return (dispatch) => {
		if (role==='assassin') {
			let playerRef = firebase.database().ref(`/players/${player.uid}`)
			playerRef.once('value')
				.then(snapshot => {
					let targetId = snapshot.val().target
					let targetRef = firebase.database().ref(`/players/${targetId}`)
					// console.log('***===>', offTargetRef)
					// targetRef.off('value', offTargetRef)
				})
				.then(() => {
					playerRef.update({status: status, target: ''})
						.then(() => {
							console.log('set assassin status!!!')
							if (status === 'kill') {
								let currKills
								playerRef.once('value')
									.then(snapshot => {
										currKills = snapshot.val().kills || 0
									})
									.then(() => {
										playerRef.update({kills: currKills+1})
									})
							} else if (status === 'dead') {
								let currKills
								playerRef.once('value')
									.then(snapshot => {
										currKills = snapshot.val().kills || 0
									})
									.then(() => {
										playerRef.update({kills: currKills-1})
									})
							}
							dispatch(currentTarget(null))
						})
				})
		} else if (role==='player') {
			let playerRef = firebase.database().ref(`/players/${player.uid}`)
			playerRef.update({status: status, assassin: ''})
				.then(() => {
					console.log('set player status!!!')
					if (status === 'kill') {
						let currKills
						playerRef.once('value')
							.then(snapshot => {
								currKills = snapshot.val().kills || 0
							})
							.then(() => {
								playerRef.update({kills: currKills+1})
							})
					} else if (status === 'dead') {
						let currKills
						playerRef.once('value')
							.then(snapshot => {
								currKills = snapshot.val().kills || 0
							})
							.then(() => {
								playerRef.update({kills: currKills-1})
							})
					}
					dispatch(currentAssassin(null))
				})
		}
	}
}

/**
 * REDUCER
 */

export default function (state = playerState, action) {
	switch (action.type) {
	// case CURRENT_PLAYER:
	// 	return {
	// 		...state,
	// 		player: action.player
	// 	}
	// case ALL_PLAYERS:
	// 	return {
	// 		...state,
	// 		players: action.players.map(player => {
	// 			return {...player, openInfo: player.openInfo ? true : false}
	// 		})
	// 	}
	// case TOGGLE_SELECTED_PLAYER:
	// 	return {
	// 		...state,
	// 		players: state.players.map(player => player.uid === action.player.uid ? {...player, openInfo: !player.openInfo} : player)
	// 	}
	// case CURRENT_LOCATION:
	// 	return Object.assign({}, state, { location: {latitude: action.location.latitude, longitude: action.location.longitude}})
	case CURRENT_TARGET:
		return {
			...state,
			target: action.target
		}
	case GUESS_PROMPT:
		return {
			...state,
			guessPrompt: action.bool
		}
	case CURRENT_ASSASSIN:
		return {
			...state,
			assassin: action.assassin
		}
	default:
		return state
	}
}

// helper funcs
// const filterPlayers = (players) => {
// 	let filteredPlayers = Object.values(players).filter(player => {
// 		if (player.Locations) {
// 			let Locations = Object.values(player.Locations)
// 			let Location = Locations[Locations.length-1]
// 			if (typeof Location === 'object') {
// 				player.Locations = Location
// 				return player
// 			}
// 		}
// 	})
// 	return filteredPlayers
// }

// export const filterPlayer = (player) => {
// 	if (player && player.Locations) {
// 		let Locations = Object.values(player.Locations)
// 		let Location = Locations[Locations.length-1]
// 		player.Locations = Location
// 		return player
// 	}
// 	return {}
// }
