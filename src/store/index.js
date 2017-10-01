import { composeWithDevTools } from 'redux-devtools-extension'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import player from './player.js'



//
// const reducer = combineReducers({user, products, categories, orders, users, newUser, newCategory, newProduct, newReview, newOrder, searchProduct, modals, cart, orderProduct, orderStatus})
// const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))



const reducer = combineReducers({player})
// const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
// const store = createStore(reducer)
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))


export default store
export * from './player'
