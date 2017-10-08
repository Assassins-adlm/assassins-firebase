/* eslint-disable no-undef */
import React from 'react'
import firebase from '../fire'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import EngagePrompt from './EngagePrompt'
import {withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer, Circle} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import Geofire from 'geofire'
import FightScene from './fightScene'
import {generateFakeLocation, getLocation} from './HelperFunc'
import MapStyle from './MapStyle.json'
import {fetchCurrPlayer, fetchPlayers, toggleSelectedPlayer, addCurrTarget, fetchCurrTarget, listeningAllPlayer, listeningMyself, getCurrToken} from '../store'
const NotificationSystem = require('react-notification-system')

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	// console.log('props***', props)
	const {players, mapStyles} = props
	const currPlayer = props.player
	let myLocation = [0,0]
				myLocation[0] = currPlayer.Locations.lat || 74
				myLocation[1] = currPlayer.Locations.lon || -40

	// let fakeLocation = props.fakeLocation
	console.log('curr player location*****>>', myLocation)

	return (
		myLocation ?
			<GoogleMap
				zoom={15}
				defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: mapStyles, mapTypeControl: false }}
			>
				<MarkerClusterer
					averageCenter
					enableRetinaIcons
					gridSize={10}
				>
					{players.map((player, idx) => {
						return (
							(player.Locations && player.status!=='dead') && //need to change this
						<Marker
							key={idx}
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: player.Locations.lat, lng: player.Locations.lon }}
							onClick={()=> {
								props.onToggleOpen(player)
							}}
						>
							{
								player.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(player)}}>
									{
										player.id === currPlayer.id ? <MyInfo {...currPlayer}/> : <MyTarget submitTarget={props.submitTarget} target={player} currPlayer={currPlayer}/>
									}
								</InfoWindow>
							}
						</Marker>
						)
					})}
				</MarkerClusterer>
			</GoogleMap> : <div>loading...</div>)}
)

class MapBox extends React.PureComponent {

	constructor(){
		super()

		this.onToggleOpen = this.onToggleOpen.bind(this)
		// this.updateDirection = this.updateDirection.bind(this)
		// this.nearBy = this.nearBy.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
		// this._addNotification = this._addNotification.bind(this)
	}


	submitTarget(target) {
		const {submitCurrTarget, player} = this.props
		submitCurrTarget(player, target)
	}

	onToggleOpen(player) {
		const {togglePlayer} = this.props
		togglePlayer(player)
	}

	// _addNotification(_notificationSystem, mapBox, option, targetRef, assassinRef, myRef) {
	// 	if (option==='kill') {
	// 		_notificationSystem.clearNotifications()
	// 		_notificationSystem.addNotification({
	// 			message: 'Target nearby, kill him before too late!',
	// 			level: 'success',
	// 			action: {
	// 				label: 'Finish!',
	// 				callback: function() {
	// 					// mapBox.setState({fightMode: true})
	// 					console.log('finish successfully!')
	// 					// mapBox.setState({getTarget: true, getEscaped: false})
	// 					//set target player to dead
	// 					targetRef.update({status: 'dead', assassin: ''})
	// 					myRef.once('value', snapshot=>{
	// 						if(snapshot.val().kills!==undefined){
	// 							myRef.update({kills: snapshot.val().kills+1, target: ''})
	// 						} else{
	// 							myRef.update({kills: 1})
	// 						}
	// 					})
	// 					//  get target ref, update to dead
	// 				}
	// 			}
	// 		})
	// 	} else if (option==='escape') {
	// 		_notificationSystem.addNotification({
	// 			message: 'Assassin nearby, run bro!',
	// 			level: 'success',
	// 			action: {
	// 				label: 'Run away!',
	// 				callback: function() {
	// 					// mapBox.setState({})
	// 					console.log('run away successfully!')
	// 					// mapBox.setState({getTarget: false, getEscaped: true})
	// 					assassinRef.update({status: 'dead', target: ''})
	// 					myRef.update({assassin: ''})
	// 				}
	// 			}
	// 		})
	// 	}
	// }

	// componentWillMount() {
	// 	console.log('will mount-->', this.state)
	// 	// console.log(this.props)
	// 	// const {firebase} = this.props
	// 	const playerId = this.props.auth.uid
	// 	console.log('player ID-->', playerId)
	// 	// console.log('state--->', this.state)
	// 	const playersRef = firebase.database().ref('/players')
	// 	playersRef.on('value', (snapshot) => {
	// 		console.log('updating all players', snapshot.val())
	// 		let players = snapshot.val()
	// 		let allPlayers = [], currPlayer, currTarget, currAssassin
	// 		for(let key in players){
	// 			let player = {}
	// 			player.location = players[key].location //need to change this
	// 			player.openInfo = false
	// 			player.id = key
	// 			player.status = players[key].status
	// 			allPlayers.push(player)
	// 			if (players[key].id === playerId) {
	// 				currPlayer = players[key]
	// 				// console.log('curr player-->', currPlayer)
	// 			}
	// 			if (players[key].target === playerId) {
	// 				currAssassin = players[key]
	// 				console.log('curr assassin-->', currAssassin)
	// 			}
	// 		}
	// 		// console.log('end for')
	// 		for (let key in players) {
	// 			if (players[key].id === currPlayer.target) {
	// 				currTarget = players[key]
	// 			}
	// 		}
	// 		if (!this.state.fightMode) {
	// 			// console.log('state-->', this.state)
	// 			this.setState({
	// 				markers: allPlayers,
	// 				currPlayer,
	// 				currTarget,
	// 				currAssassin
	// 			})
	// 			if (currTarget) {
	// 				let fakeLocation = generateFakeLocation(currTarget.location)
	// 				this.setState({fakeLocation})
	// 				this.updateDirection(currPlayer, fakeLocation)
	// 			} else {
	// 				this.setState({directions: null, fakeLocation:[]})
	// 			}
	// 		}
	// 	})
	// }

	// nearBy(){
	// 	// const {firebase} = this.props
	// 	const myId = this.props.auth.uid
	// 	const myRef = firebase.database().ref(`/players/${myId}`)

	// 	myRef.on('value', snapshot => {
	// 		const targetId = snapshot.val().target
	// 		let assassinId
	// 		if (this.state.currAssassin) {
	// 			assassinId = this.state.currAssassin.id
	// 		}
	// 		// const assassinId = this.state.currAssassin.id
	// 		const myLocation = snapshot.val().location  // need to change this
	// 		// console.log('my location-->', myLocation)
	// 		console.log('curr assassin-->', this.state.currAssassin)
	// 		const targetRef = firebase.database().ref(`/players/${targetId}`)
	// 		const assassinRef = firebase.database().ref(`/players/${assassinId}`)
	// 		targetRef.on('value', snapshot => {
	// 			// console.log('targetid-->', targetId)
	// 			if (snapshot.val() && !this.state.fightMode && snapshot.val().assassin) {
	// 				const targetLocation = snapshot.val().location // need to change this
	// 				// console.log('target location -->', targetLocation)
	// 				if (myLocation && targetLocation) {
	// 					const distance = Geofire.distance(myLocation, targetLocation)
	// 					console.log('target distance ---> ', distance)
	// 					if (distance < 0.1) {
	// 					// this.setState({fightMode: true})
	// 						const notificationSystem = this.refs.notificationSystem
	// 						this._addNotification(notificationSystem, this, 'kill', targetRef, assassinRef, myRef)
	// 						console.log('fight!!')
	// 					}
	// 				}
	// 			}
	// 		})
	// 		assassinRef.on('value', snapshot => {
	// 			if (snapshot.val() && !this.state.fightMode && snapshot.val().target) {
	// 				const assassinLocation = snapshot.val().location // need to change this
	// 				// console.log('target location -->', targetLocation)
	// 				if (myLocation && assassinLocation) {
	// 					const distance = Geofire.distance(myLocation, assassinLocation)
	// 					console.log('assassin distance ---> ', distance)
	// 					if (distance < 0.1) {
	// 					// this.setState({fightMode: true})
	// 						const notificationSystem = this.refs.notificationSystem
	// 						this._addNotification(notificationSystem, this, 'escape', targetRef, assassinRef, myRef)
	// 						console.log('fight!!')
	// 					}
	// 				}
	// 			}
	// 		})
	// 	})
	// }

	// updateDirection(currPlayer, fakeLocation) { //need to change this
	// 	const DirectionsService = new google.maps.DirectionsService()
	// 	DirectionsService.route({
	// 		origin: new google.maps.LatLng(currPlayer.location[0], currPlayer.location[1]),
	// 		destination: new google.maps.LatLng(fakeLocation[0], fakeLocation[1]),
	// 		travelMode: google.maps.TravelMode.WALKING
	// 	}, (result, status) => {
	// 		if (status === google.maps.DirectionsStatus.OK) {
	// 			this.setState({
	// 				directions: result,
	// 			})
	// 		} else {
	// 			console.error(`error fetching directions ${result}`)
	// 		}
	// 	})
	// }



	componentDidMount() {
		const {auth, getCurrPlayer, getAllPlayer, getCurrTarget, listenAllPlayer, listenMyself, getCurrentToken} = this.props
		getCurrPlayer(auth.uid)
		getAllPlayer()
		getCurrTarget(auth.uid)
		listenAllPlayer()
		listenMyself(auth.uid)
		getCurrentToken(auth.uid)
	}


	render() {
		console.log('redering!!')
		// console.log('props****>>', this.props)
		const {player, target} = this.props
		return (
			(isLoaded(this.props) ?
				<div>
					{
						player.Locations && target.Locations && <EngagePrompt player={player} target={target} />
					}
					<MapWithAMarkerClusterer
						googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<div style={{ height: '100%' }} />}
						containerElement={<div style={{ height: '100vh' }} />}
						mapElement={<div style={{ height: '100%' }} />}
						{...this.props}
						onToggleOpen={this.onToggleOpen}
						submitTarget={this.submitTarget}
						mapStyles={MapStyle}
		    	/></div> : <div>loading...</div>)
		)
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: state.player.players,
		player: state.player.player,
		target: state.player.target,
		token: state.player.token
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getCurrentToken(id) {
			dispatch(getCurrToken(id))
		},
		getCurrPlayer(uid) {
			dispatch(fetchCurrPlayer(uid))
		},
		getAllPlayer() {
			dispatch(fetchPlayers())
		},
		getCurrTarget(uid) {
			dispatch(fetchCurrTarget(uid))
		},
		togglePlayer(player) {
			dispatch(toggleSelectedPlayer(player))
		},
		submitCurrTarget(player, target) {
			dispatch(addCurrTarget(player, target))
		},
		listenAllPlayer() {
			dispatch(listeningAllPlayer())
		},
		listenMyself(uid) {
			dispatch(listeningMyself(uid))
		}
	}
}

export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(MapBox)
