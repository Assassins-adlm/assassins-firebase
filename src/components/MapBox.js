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

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	let myLocation = props.currPlayer.location //need to change this
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
				gridSize={10}
			>
				{props.markers.map((marker, idx) => {
					console.log('marker location-->', marker.location) //need to change this
					return (
						marker.location &&   //need to change this
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
			currLocation: [],
			currTarget: null,
			fakeLocation: [],
			directions: null,
			fightMode: false
		}
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.updateDirection = this.updateDirection.bind(this)
		this.nearBy = this.nearBy.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
	}


	submitTarget(myRef, target) {
		myRef.update({target: target.id})
		this.setState({currTarget: target})
	}

	onToggleOpen(newMarker) {
		newMarker.openInfo = !newMarker.openInfo
		this.setState({markers: this.state.markers.map(marker=>marker.id===newMarker.id ? newMarker : marker)})
	}

	componentWillMount() {
		const playerId = this.props.auth.uid
		firebase.database().ref('players')
			.on('value', (snapshot) => {
				let players = snapshot.val()
				let allPlayers = [], currPlayer,currTarget
				for(let key in players){
					let player = {}
					player.location = players[key].location //need to change this
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
				this.setState({
					markers: allPlayers,
					currPlayer,
					currTarget
				})
				if (currTarget) {
					let fakeLocation = generateFakeLocation(currTarget.location) //need to change this
					this.setState({fakeLocation})
					this.updateDirection(currPlayer, fakeLocation) //need to change this
					this.nearBy()
				} else {
					this.setState({directions: null, fakeLocation:[]})
				}
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
		const currPlayer = this.state.currPlayer
		const {firebase} = this.props
		getLocation(currPlayer, firebase)  //need to change this
	}

	nearBy(){
		let myId = this.props.auth.uid
		let myRef = firebase.database().ref(`/players/${myId}`)
		myRef.on('value', snapshot => {
			let targetId = snapshot.val().target
			let myLocation = snapshot.val().location  // need to change this
			// console.log('my location-->', myLocation)
			let targetRef = firebase.database().ref(`/players/${targetId}`)
			targetRef.on('value', snapshot => {
				let targetLocation = snapshot.val().location // need to change this
				// console.log('target location -->', targetLocation)
				if (myLocation && targetLocation) {
					let distance = Geofire.distance(myLocation, targetLocation)
					console.log('distance ---> ', distance)
					if (distance < 0.008) {
						// this.setState({fightMode: true})
						console.log('fight!!')
					}
				}
				// console.log('distance ---> ', distance)
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
					{...this.state}
					onToggleOpen={this.onToggleOpen}
					submitTarget={this.submitTarget}
					mapStyles={MapStyle}
		    	/>
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
