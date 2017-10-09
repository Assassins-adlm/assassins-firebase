import Geofire from 'geofire'
import firebase from '../fire'
import {filterPlayer} from './player'
/**
 * ACTION TYPES
 */
const CHANGE_MODE = 'CHANGE_MODE'

/**
 * INITIAL STATE
 */
const gameState = {
	mode: ''
}

/**
 * ACTION CREATORS
 */

export function changeMode (mode) {return {type: CHANGE_MODE, mode}}

// thunk creators


// game reducer
export default function (state = gameState, action) {
	switch (action.type) {
	case CHANGE_MODE:
		return {
			...state,
			mode: action.mode
		}
	default:
		return state
	}
}
