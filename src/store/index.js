import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {reactReduxFirebase, firebaseStateReducer, getFirebase} from 'react-redux-firebase'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import player from './player.js'
import game from './game'

const firebaseConfig = {
	apiKey: 'AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g',
	authDomain: 'assassins-aldm.firebaseapp.com',
	databaseURL: 'https://assassins-aldm.firebaseio.com',
	projectId: 'assassins-aldm',
	storageBucket: 'assassins-aldm.appspot.com',
	messagingSenderId: '510113560850',
}
const config = {
	userProfile: '/players',
	enableLogging: false,
}
const initialState = {id: null}


const rootReducer = combineReducers({
	firebase: firebaseStateReducer, player
})



const createStoreWithFirebase = compose(
	reactReduxFirebase(firebaseConfig, {
		userProfile: '/players',
		enableLogging: false,
	})
)(createStore)


const store = createStoreWithFirebase(rootReducer, initialState)



export default store

export * from './player'
export * from './game'
