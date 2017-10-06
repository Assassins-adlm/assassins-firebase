/* eslint-disable no-undef */
import firebase from '../fire'
import React from 'react'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import {withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer, Circle} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import Geofire from 'geofire'
import FightScene from './fightScene'
import {generateFakeLocation, getLocation} from './HelperFunc'
import MapStyle from './MapStyle.json'
const NotificationSystem = require('react-notification-system')

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	let myLocation = props.currPlayer.location
	let fakeLocation = props.fakeLocation
	return (
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
				gridSize={60}
			>
				{props.markers.map((marker, idx) => {
					return (
						marker.location &&
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
		</GoogleMap>)}
)

class MapBox extends React.PureComponent {

	constructor(){
		super()
		this.state={
			markers: [],
			currPlayer: null,
			currTarget: null,
			fakeLocation: [],
			directions: null,
			fightMode: false
		}
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.updateDirection = this.updateDirection.bind(this)
		this.nearBy = this.nearBy.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
		this._addNotification = this._addNotification.bind(this)
	}

	submitTarget(myRef, target) {
		myRef.update({target: target.id})
		this.setState({currTarget: target})
	}

	onToggleOpen(newMarker) {
		newMarker.openInfo = !newMarker.openInfo
		this.setState({markers: this.state.markers.map(marker=>marker.id===newMarker.id ? newMarker : marker)})
	}

	_addNotification(_notificationSystem, mapBox) {
		_notificationSystem.addNotification({
			message: 'Target nearby, kill him before too late!',
			level: 'success',
			action: {
				label: 'Finish Him!',
				callback: function() {
					mapBox.setState({fightMode: true})
				}
			}
		})
	}

	componentWillMount() {
		const playerId = this.props.auth.uid
		// console.log('state--->', this.state)
		firebase.database().ref('players')
			.on('value', (snapshot) => {
				let players = snapshot.val()
				let allPlayers = [], currPlayer,currTarget
				for(let key in players){
					let player = {}
					player.location = players[key].location
					player.openInfo = false
					player.id = key
					allPlayers.push(player)
					if (players[key].id === playerId) {
						currPlayer = players[key]
					}
				}
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
						currTarget
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

	updateDirection(currPlayer, fakeLocation) {
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
		// console.log('state-->', this.state)
		const currPlayer = this.state.currPlayer
		const {firebase} = this.props
		getLocation(currPlayer, firebase)
		this.nearBy()
	}

	nearBy(){
		let myId = this.props.auth.uid
		let myRef = firebase.database().ref(`/players/${myId}`)

		myRef.on('value', snapshot => {
			let targetId = snapshot.val().target
			let myLocation = snapshot.val().location
			// console.log('my location-->', myLocation)
			let targetRef = firebase.database().ref(`/players/${targetId}`)
			targetRef.on('value', snapshot => {
				// console.log('state-->', this.state)
				if (!this.state.fightMode) {
					let targetLocation = snapshot.val().location
					// console.log('target location -->', targetLocation)
					if (myLocation && targetLocation) {
						let distance = Geofire.distance(myLocation, targetLocation)
						console.log('distance ---> ', distance)
						if (distance < 0.008) {
							let notificationSystem = this.refs.notificationSystem
							this._addNotification(notificationSystem, this)
							console.log('fight!!')
						}
					}
				}
			})
		})
	}

	render() {
		return (
			this.state.fightMode ?
				<FightScene /> :
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
		    	/>
				</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(MapBox)
