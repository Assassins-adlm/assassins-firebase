import firebase from '../fire'
/**
 * ACTION TYPES
 */
const CURRENT_PLAYER = 'CURRENT_PLAYER'
const ALL_PLAYERS = 'ALL_PLAYERS'
const TOGGLE_SELECTED_PLAYER = 'TOGGLE_SELECTED_PLAYER'
const CURRENT_LOCATION = 'CURRENT_LOCATION'
const CURRENT_TARGET= 'CURRENT_TARGET'
/**
 * INITIAL STATE
 */

const playerState = {
	player: {},
	players: [],
	location: {latitude: '' , longitude: ''},
	target: {},
}

/**
 * ACTION CREATORS
 */

export function currentPlayer  (player) {return {type: CURRENT_PLAYER, player}}
export function allPlayers (players) {return {type: ALL_PLAYERS, players}}
export function toggleSelectedPlayer (player) {return {type: TOGGLE_SELECTED_PLAYER, player}}
export function currentLocation (location) {return {type: CURRENT_LOCATION, location}}
export function currentTarget (target) {return {type: CURRENT_TARGET, target}}

// thunk
export const fetchCurrPlayer = (uid) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${uid}`).once('value')
			.then(snapshot => {
				// let player = {...snapshot.val(), Locations:[]}
				dispatch(currentPlayer(filterPlayer(snapshot.val())))
			}, error => console.error(error))
	}
}

export const fetchPlayers = () => {
	return (dispatch) => {
		firebase.database().ref('/players').once('value')
			.then(snapshot => {
				dispatch(allPlayers(filterPlayers(snapshot.val())))
			}, error => console.error(error))
	}
}

export const fetchCurrTarget = (uid) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${uid}`).once('value')
			.then(snapshot => {
				let targetId = snapshot.val().target
				if (targetId) {
					firebase.database().ref(`/players/${targetId}`).once('value')
						.then(snapshot => {
							let target = filterPlayer(snapshot.val())
							dispatch(currentTarget(target))
							dispatch(listeningTarget(target))
						})
				}
			})
	}
}

export const addCurrTarget = (player, target) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${player.id}`).update({target: target.id})
			.then(() => {
				dispatch(currentTarget(target))
				dispatch(currentPlayer({...player, target: target.id}))
				dispatch(listeningTarget(target))
			}, error => console.error(error))
	}
}

export const listeningAllPlayer = () => {
	return (dispatch) => {
		firebase.database().ref('/players')
			.on('value', snapshot => {
				// console.log('listening all players-->', snapshot.val())
				dispatch(allPlayers(filterPlayers(snapshot.val())))
			})
	}
}

export const listeningMyself = (uid) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${uid}`)
			.on('value', snapshot => {
				dispatch(currentPlayer(filterPlayer(snapshot.val())))
			})
	}
}

export const listeningTarget = (target) => {
	return (dispatch) => {
		firebase.database().ref(`/players/${target.id}`)
			.on('value', snapshot => {
				dispatch(currentTarget(filterPlayer(snapshot.val())))
			})
	}
}

/**
 * REDUCER
 */

export default function (state = playerState, action) {
	switch (action.type) {
	case CURRENT_PLAYER:
		return {
			...state,
			player: action.player
		}
	case ALL_PLAYERS:
		return {
			...state,
			players: action.players.map(player => {
				return {...player, openInfo: false}
			})
		}
	case TOGGLE_SELECTED_PLAYER:
		return {
			...state,
			players: state.players.map(player => player.id === action.player.id ? {...player, openInfo: !player.openInfo} : player)
		}
	case CURRENT_LOCATION:
		return Object.assign({}, state, { location: {latitude: action.location.latitude, longitude: action.location.longitude}})
	case CURRENT_TARGET:
		return {
			...state,
			target: action.target
		}
	default:
		return state
	}
}

// helper funcs
const filterPlayers = (players) => {
	let filteredPlayers = Object.values(players).filter(player => {
		if (player.Locations) {
			let Locations = Object.values(player.Locations)
			let Location = Locations[Locations.length-1]
			player.Locations = Location
			return player
		}
	})
	return filteredPlayers
}

const filterPlayer = (player) => {
	if (player.Locations) {
		let Locations = Object.values(player.Locations)
		let Location = Locations[Locations.length-1]
		player.Locations = Location
		return player
	}
	return {}
}

