/* eslint-disable no-undef */
import firebase from '../fire'
import React from 'react'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	InfoWindow,
	DirectionsRenderer,
	Circle
} from 'react-google-maps'
import {
	firebaseConnect,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import Geofire from 'geofire'
import FightScene from './fightScene'

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	// console.log('props-->', props)
	let myLocation = props.currPlayer.location
	// let targetLocation = props.currTarget.location
	let fakeLocation = props.fakeLocation
	// console.log('fake location-->', fakeLocation)
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
										marker.id === props.currPlayer.id ? <MyInfo currPlayer={props.currPlayer}/> : <MyTarget target={marker}/>
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
			players:[],
			markers: [],
			currPlayer: null,
			currTarget: null,
			directions: null,
			fightMode: false

		}
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.updateDirection = this.updateDirection.bind(this)
		this.nearBy = this.nearBy.bind(this)
	}


	nearBy(){
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user})
			var firebaseRef = firebase.database().ref('players')
			var geoFire = new Geofire(firebaseRef)
			var Assassin = firebaseRef.child(`${user.uid}`)
			//.orderByChild('tst').limitToLast(1)
			Assassin.on('value', snapshot => {
				let targetId = snapshot.val().target
				let assassinLocation = snapshot.val().location
				var victim = firebaseRef.child(`${targetId}/target`)
				victim.on('value', snapshot => {
					// let info = Object.values(snapshot.val())
					let victimId = snapshot.val()
					var target = firebaseRef.child(`${victimId}/location`)//.orderByChild('tst').limitToLast(1)
					target.on('value', snap=>{
						let info2 = snap.val()
						let distance = Geofire.distance(assassinLocation, info2)
						console.log(distance)
						distance<.008 ? this.setState({fightMode: true}): console.log('GET CLOSER!!!')
						// })
					})
				})
			})
		})
	}

	onToggleOpen(newMarker) {
		newMarker.openInfo = !newMarker.openInfo
		this.setState({markers: this.state.markers.map(marker=>marker.id===newMarker.id ? newMarker : marker)})
	}

	componentWillMount() {
		const playerId = this.props.auth.uid
		const playersRef = firebase.database().ref('players')
		playersRef.on('value', (snapshot) => {
			let players = snapshot.val()
			let allPlayers = [], currPlayer
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
			let currTarget
			for (let key in players) {
				if (players[key].id === currPlayer.target) {
					currTarget = players[key]
				}
			}
			// console.log('curr target', currTarget)
			this.setState({
				markers: allPlayers,
				currPlayer,
				currTarget
			})
			if (currPlayer.target && currTarget) {
				let fakeLocation = this.generateFakeLocation(currTarget.location)
				this.setState({fakeLocation})
				this.updateDirection(currPlayer, fakeLocation)
			} else {
				this.setState({directions: null})
			}
		})
	}

	generateFakeLocation(location) {
		let latOffset = Math.random()*0.005, lonOffset = Math.random()*0.005
		let fakeLocation = []
		if (Math.random() > 0.5) {
			fakeLocation[0] = location[0] + latOffset
		} else {
			fakeLocation[0] = location[0] - latOffset
		}
		if (Math.random() > 0.5) {
			fakeLocation[1] = location[1] + lonOffset
		} else {
			fakeLocation[1] = location[1] - lonOffset
		}
		return fakeLocation
	}

	updateDirection(currPlayer, fakeLocation) {
		// console.log('curr target', currTarget)
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
		// })
	}

	getLocation(currPlayer) {
		var id, target, options
		function success(pos) {
			let crd = pos.coords
			// console.log('pos-->', crd)
			let myId = currPlayer.id
			let myRef = firebase.database().ref(`/players/${myId}`)
			myRef.update({location: [crd.latitude, crd.longitude]})
			// if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
			// 	console.log('Congratulations, you reached the target')
			// 	navigator.geolocation.clearWatch(id)
			// }
		}
		function error(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message)
		}
		target = {
			latitude : 0,
			longitude: 0
		}
		options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		}
		id = navigator.geolocation.watchPosition(success, error, options)
	}

	componentDidMount() {
		let myTarget = this.state.currPlayer.target
		const currPlayer = this.state.currPlayer
		const currTarget = this.state.currTarget
		if (myTarget.length) {
			// console.log('test!!')
			let fakeLocation = this.generateFakeLocation(currTarget.location)
			this.setState({fakeLocation})
			this.updateDirection(currPlayer, fakeLocation)
			this.nearBy()
		}
		this.getLocation(currPlayer)
	}

	nearBy(){
		let myId = this.props.auth.uid
		let playersRef = firebase.database().ref('players')
		let myRef = firebase.database().ref(`/players/${myId}`)
		myRef.on('value', snapshot => {
			let targetId = snapshot.val().target
			let myLocation = snapshot.val().location
			console.log('my location-->', myLocation)
			let targetRef = firebase.database().ref(`/players/${targetId}`)
			targetRef.on('value', snapshot => {
				let targetLocation = snapshot.val().location
				console.log('target location -->', targetLocation)
				let distance = Geofire.distance(myLocation, targetLocation)
				console.log('distance ---> ', distance)
       distance < .008 ? this.setState({fightMode: true}) : console.log("get closer")
			})
		})
	}

	render() {


		return (
			this.state.fightMode ?
				<FightScene /> :
				<MapWithAMarkerClusterer
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{ height: '100%' }} />}
					containerElement={<div style={{ height: '100vh' }} />}
					mapElement={<div style={{ height: '100%' }} />}
					markers={this.state.markers}
					onToggleOpen={this.onToggleOpen}
					currPlayer={this.state.currPlayer}
					currTarget={this.state.currTarget}
					fakeLocation={this.state.fakeLocation}
					directions={this.state.directions}
					mapStyles={[{'featureType':'all','elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'all','elementType':'labels.text.stroke','stylers':[{'color':'#000000'},{'lightness':13}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#144b53'},{'lightness':14},{'weight':1.4}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#08304b'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#0c4152'},{'lightness':5}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#0b434f'},{'lightness':25}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#0b3d51'},{'lightness':16}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'}]},{'featureType':'transit','elementType':'all','stylers':[{'color':'#146474'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#021019'}]}]}
		    	/>
		)
	}
}

const mapStateToProps = (state) => {
	// console.log('state-->', state)
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players' }, {path: 'auth'}]), connect(mapStateToProps))(MapBox)
