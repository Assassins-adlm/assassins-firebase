import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reactReduxFirebase, firebaseStateReducer, getFirebase } from 'react-redux-firebase'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import player from './player.js'

var firebaseConfig = {
	apiKey: 'AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g',
	authDomain: 'assassins-aldm.firebaseapp.com',
	databaseURL: 'https://assassins-aldm.firebaseio.com',
	projectId: 'assassins-aldm',
	storageBucket: 'assassins-aldm.appspot.com',
	messagingSenderId: '510113560850'
}

const initialState = {}

const rootReducer = combineReducers({
	firebase: firebaseStateReducer, player
})

const store = createStore(rootReducer, initialState, compose(
	applyMiddleware(
		thunk.withExtraArgument(getFirebase), createLogger
	), reactReduxFirebase(firebaseConfig, { userProfile: 'users', enableLogging: false })
))
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

export * from './player'

// Add Firebase to reducers
