import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {reactReduxFirebase, firebaseStateReducer, getFirebase} from 'react-redux-firebase'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

const firebaseConfig = {
	apiKey: 'AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g',
	authDomain: 'assassins-aldm.firebaseapp.com',
	databaseURL: 'https://assassins-aldm.firebaseio.com',
	projectId: 'assassins-aldm',
	storageBucket: 'assassins-aldm.appspot.com',
	messagingSenderId: '510113560850',
}

const initialState = {id: null}

const rootReducer = combineReducers({
	firebase: firebaseStateReducer
})

const createStoreWithFirebase = compose(
	applyMiddleware(
		thunk.withExtraArgument(getFirebase)),
	reactReduxFirebase(firebaseConfig, {
		userProfile: '/players',
		enableLogging: false,
	})
)(createStore)

const store = createStoreWithFirebase(rootReducer, initialState)

export default store

