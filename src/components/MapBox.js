/* eslint-disable no-undef */
import React from 'react'
import firebase from '../fire'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import {withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer, Circle} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import Geofire from 'geofire'
import FightScene from './fightScene'
import {generateFakeLocation, getLocation} from './HelperFunc'
import MapStyle from './MapStyle.json'
const NotificationSystem = require('react-notification-system')

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	// console.log('map props-->', props)
	// console.log('markers-->', props.markers)
	let myLocation = props.currPlayer.location //need to change this
	let fakeLocation = props.fakeLocation
	return (
		myLocation ?
			<GoogleMap
				zoom={15}
				defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: props.mapStyles, mapTypeControl: false }}
			>
				{
					fakeLocation.length && <Circle center={{ lat: fakeLocation[0], lng: fakeLocation[1]}}
						radius={1000}
					/>
				}
				{props.directions && <DirectionsRenderer options={{preserveViewport: true, suppressMarkers: true}} directions={props.directions}
				/>}
				<MarkerClusterer
					averageCenter
					enableRetinaIcons
					gridSize={10}
				>
					{props.markers.map((marker, idx) => {
						return (
							(marker.location && marker.status!=='dead') && //need to change this
						<Marker
							key={idx}
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: marker.location[0], lng: marker.location[1] }}
							onClick={()=> {
								props.onToggleOpen(marker)
							}}
						>
							{
								marker.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(marker)}}>
									{
										marker.id === props.currPlayer.id ? <MyInfo currPlayer={props.currPlayer}/> : <MyTarget submitTarget={props.submitTarget} target={marker}/>
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
		this.state={
			markers: [],
			currPlayer: {},
			currLocation: [],
			currTarget: {},
			currAssassin: {},
			fakeLocation: [],
			directions: null,
			fightMode: false,
			getTarget: false
		}
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.updateDirection = this.updateDirection.bind(this)
		this.nearBy = this.nearBy.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
		this._addNotification = this._addNotification.bind(this)
	}


	submitTarget(myId, myRef, target, targetRef) {
		myRef.update({target: target.id})
		targetRef.update({assassin: myId})
		this.setState({currTarget: target})
	}

	onToggleOpen(newMarker) {
		newMarker.openInfo = !newMarker.openInfo
		this.setState({markers: this.state.markers.map(marker=>marker.id===newMarker.id ? newMarker : marker)})
	}

	_addNotification(_notificationSystem, mapBox, option, targetRef, assassinRef, myRef) {
		if (option==='kill') {
			_notificationSystem.clearNotifications()
			_notificationSystem.addNotification({
				message: 'Target nearby, kill him before too late!',
				level: 'success',
				action: {
					label: 'Finish!',
					callback: function() {
						// mapBox.setState({fightMode: true})
						console.log('finish successfully!')
						// mapBox.setState({getTarget: true, getEscaped: false})
						//set target player to dead
						targetRef.update({status: 'dead', assassin: ''})
						myRef.once('value', snapshot=>{
							if(snapshot.val().kills!==undefined){
								myRef.update({kills: snapshot.val().kills+1, target: ''})
							} else{
								myRef.update({kills: 1})
							}
						})
						//  get target ref, update to dead
					}
				}
			})
		} else if (option==='escape') {
			_notificationSystem.addNotification({
				message: 'Assassin nearby, run bro!',
				level: 'success',
				action: {
					label: 'Run away!',
					callback: function() {
						// mapBox.setState({})
						console.log('run away successfully!')
						// mapBox.setState({getTarget: false, getEscaped: true})
						assassinRef.update({status: 'dead', target: ''})
						myRef.update({assassin: ''})
					}
				}
			})
		}
	}

	componentWillMount() {
		console.log('will mount-->', this.state)
		// console.log(this.props)
		// const {firebase} = this.props
		const playerId = this.props.auth.uid
		console.log('player ID-->', playerId)
		// console.log('state--->', this.state)
		const playersRef = firebase.database().ref('/players')
		playersRef.on('value', (snapshot) => {
			console.log('updating all players', snapshot.val())
			let players = snapshot.val()
			let allPlayers = [], currPlayer, currTarget, currAssassin
			for(let key in players){
				let player = {}
				player.location = players[key].location //need to change this
				player.openInfo = false
				player.id = key
				player.status = players[key].status
				allPlayers.push(player)
				if (players[key].id === playerId) {
					currPlayer = players[key]
					// console.log('curr player-->', currPlayer)
				}
				if (players[key].target === playerId) {
					currAssassin = players[key]
					console.log('curr assassin-->', currAssassin)
				}
			}
			// console.log('end for')
			for (let key in players) {
				if (players[key].id === currPlayer.target) {
					currTarget = players[key]
				}
			}
			if (!this.state.fightMode) {
				// console.log('state-->', this.state)
				this.setState({
					markers: allPlayers,
					currPlayer,
					currTarget,
					currAssassin
				})
				if (currTarget) {
					let fakeLocation = generateFakeLocation(currTarget.location)
					this.setState({fakeLocation})
					this.updateDirection(currPlayer, fakeLocation)
				} else {
					this.setState({directions: null, fakeLocation:[]})
				}
			}
		})
	}

	nearBy(){
		// const {firebase} = this.props
		const myId = this.props.auth.uid
		const myRef = firebase.database().ref(`/players/${myId}`)

		myRef.on('value', snapshot => {
			const targetId = snapshot.val().target
			let assassinId
			if (this.state.currAssassin) {
				assassinId = this.state.currAssassin.id
			}
			// const assassinId = this.state.currAssassin.id
			const myLocation = snapshot.val().location  // need to change this
			// console.log('my location-->', myLocation)
			console.log('curr assassin-->', this.state.currAssassin)
			const targetRef = firebase.database().ref(`/players/${targetId}`)
			const assassinRef = firebase.database().ref(`/players/${assassinId}`)
			targetRef.on('value', snapshot => {
				// console.log('targetid-->', targetId)
				if (snapshot.val() && !this.state.fightMode && snapshot.val().assassin) {
					const targetLocation = snapshot.val().location // need to change this
					// console.log('target location -->', targetLocation)
					if (myLocation && targetLocation) {
						const distance = Geofire.distance(myLocation, targetLocation)
						console.log('target distance ---> ', distance)
						if (distance < 0.008) {
						// this.setState({fightMode: true})
							const notificationSystem = this.refs.notificationSystem
							this._addNotification(notificationSystem, this, 'kill', targetRef, assassinRef, myRef)
							console.log('fight!!')
						}
					}
				}
			})
			assassinRef.on('value', snapshot => {
				if (snapshot.val() && !this.state.fightMode && snapshot.val().target) {
					const assassinLocation = snapshot.val().location // need to change this
					// console.log('target location -->', targetLocation)
					if (myLocation && assassinLocation) {
						const distance = Geofire.distance(myLocation, assassinLocation)
						console.log('assassin distance ---> ', distance)
						if (distance < 0.008) {
						// this.setState({fightMode: true})
							const notificationSystem = this.refs.notificationSystem
							this._addNotification(notificationSystem, this, 'escape', targetRef, assassinRef, myRef)
							console.log('fight!!')
						}
					}
				}
			})
		})
	}

	updateDirection(currPlayer, fakeLocation) { //need to change this
		const DirectionsService = new google.maps.DirectionsService()
		DirectionsService.route({
			origin: new google.maps.LatLng(currPlayer.location[0], currPlayer.location[1]),
			destination: new google.maps.LatLng(fakeLocation[0], fakeLocation[1]),
			travelMode: google.maps.TravelMode.WALKING
		}, (result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				this.setState({
					directions: result,
				})
			} else {
				console.error(`error fetching directions ${result}`)
			}
		})
	}

	componentDidMount() {
		const {firebase} = this.props
		const currPlayer = this.state.currPlayer
		getLocation(currPlayer, firebase)  //need to change this
		this.nearBy()
	}

	render() {
		// console.log('state-->', this.state)
		return (
			this.state.fightMode ?
				<FightScene /> : (isLoaded(this.props) ?
					<div>
						{/* <button onClick={this._addNotification}>Add notification</button> */}
						<NotificationSystem ref="notificationSystem" />
						<MapWithAMarkerClusterer
							googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
							loadingElement={<div style={{ height: '100%' }} />}
							containerElement={<div style={{ height: '100vh' }} />}
							mapElement={<div style={{ height: '100%' }} />}
							{...this.state}
							onToggleOpen={this.onToggleOpen}
							submitTarget={this.submitTarget}
							mapStyles={MapStyle}
		    	/></div> : <div>loading...</div>)
		)
	}
}

const mapStateToProps = (state) => {
	// console.log('state==>', state)
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(MapBox)
