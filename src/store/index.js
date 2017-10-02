import { composeWithDevTools } from 'redux-devtools-extension'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import player from './player.js'




var firebaseConfig = {
	apiKey: "AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g",
	authDomain: "assassins-aldm.firebaseapp.com",
	databaseURL: "https://assassins-aldm.firebaseio.com",
	projectId: "assassins-aldm",
	storageBucket: "assassins-aldm.appspot.com",
	messagingSenderId: "510113560850"
}

const reduxFirebaseConfig = { userProfile: 'users' }



const createStoreWithFirebase = compose(reactReduxFirebase(firebaseConfig, reduxFirebaseConfig))(createStore)

const initialState = {}

const rootReducer = combineReducers({
	firebase: firebaseStateReducer, player
})

const store = createStoreWithFirebase(rootReducer, initialState)
// const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

export * from './player'

// Add Firebase to reducers
