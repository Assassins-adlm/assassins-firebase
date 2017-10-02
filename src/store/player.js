/**
 * ACTION TYPES
 */
const CURRENT_PLAYER = 'CURRENT_PLAYER'
const CURRENT_LOCATION = 'CURRENT_LOCATION'
const CURRENT_TARGETS= 'CURRENT_TARGETS'
/**
 * INITIAL STATE
 */

<<<<<<< HEAD
const playerState = {}
=======
const playerState = {
	player: '',
	location: {latitude: '' , longitude: ''},
	targets: [],
}
>>>>>>> master

/**
 * ACTION CREATORS
 */

export function currentPlayer  (player) {return {type: CURRENT_PLAYER, player}}
export function currentLocation (location) {return {type: CURRENT_LOCATION, location}}
export function currentTargets (targets) {return {type: CURRENT_TARGETS, targets}}

/**
 * REDUCER
 */

export default function (state = playerState, action) {
	switch (action.type) {
	case CURRENT_PLAYER:
		return Object.assign({}, state, { player: action.player})
	case CURRENT_LOCATION:
		return Object.assign({}, state, { location: {latitude: action.location.latitude, longitude: action.location.longitude}})
	case CURRENT_TARGETS:
		return Object.assign({}, state, { targets: action.targets})

	default:
		return state
	}
}



