import firebase from '../fire'
import React from 'react'
import MyTarget from './TargetInfo'
// import FaAnchor from 'react-icons/lib/fa/ancho'
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	InfoWindow
} from 'react-google-maps'
// import {
// 	firebaseConnect,
// 	isLoaded,
// 	isEmpty,
// 	dataToJS,
// 	populateDataToJS,
// 	pathToJS
// } from 'react-redux-firebase'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'

const MapWithAMarkerClusterer = withScriptjs(withGoogleMap(props =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: 40.704, lng: -74.009}}
		defaultOptions={{ styles: props.mapStyles }}
	>
		<MarkerClusterer
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.markers.map((marker, idx) => {
				{/* console.log('marker -->', marker) */}
				{/* let ma = marker */}
				return (
					<Marker
						key={idx}
						position={{ lat: marker.location[0], lng: marker.location[1] }}
						onClick={()=> {
							props.onToggleOpen(marker)
						}}
					>
						{
							marker.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(marker)}}>
								<MyTarget target={marker}/>
							</InfoWindow>
						}
					</Marker>
				)
			})}
		</MarkerClusterer>
	</GoogleMap>
))

export default class MapBox extends React.PureComponent {

	constructor(){
		super()
		this.state={
			players:[],
			markers: [],
			isOpen: false
		}
		this.onToggleOpen = this.onToggleOpen.bind(this)
	}

	onToggleOpen(newMarker) {
		// console.log('toggle')
		// console.log(newMarker.id)
		// this.setState({isOpen: !this.state.isOpen})
		newMarker.openInfo = !newMarker.openInfo
		this.setState({markers: this.state.markers.map(marker=>marker.id===newMarker.id ? newMarker : marker)})
	}

	componentWillMount() {
		const playersRef = firebase.database().ref('players')
		playersRef.on('value', (snapshot) => {
			let players = snapshot.val()
			let allPlayers = []
			for(let key in players){
				// console.log('location-->', players[key].location)
				let player = {}
				player.location = players[key].location
				player.openInfo = false
				player.id = key
				allPlayers.push(player)
			}
			// console.log('all players-->', allPlayers)
			this.setState({
				markers: allPlayers
			})
		})
	}

	render() {
		let user = this.state.players
		// markers={this.state.markers}
		// console.log('marker-->', this.state.markers)
		return (
			<MapWithAMarkerClusterer
				googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
				loadingElement={<div style={{ height: '100%' }} />}
				containerElement={<div style={{ height: '100vh' }} />}
				mapElement={<div style={{ height: '100%' }} />}
				markers={this.state.markers}
				onToggleOpen={this.onToggleOpen}
				isOpen={this.state.isOpen}
				mapStyles={[
					{
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#212121'
							}
						]
					},
					{
						'elementType': 'labels.icon',
						'stylers': [
							{
								'visibility': 'off'
							}
						]
					},
					{
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#757575'
							}
						]
					},
					{
						'elementType': 'labels.text.stroke',
						'stylers': [
							{
								'color': '#212121'
							}
						]
					},
					{
						'featureType': 'administrative',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#757575'
							}
						]
					},
					{
						'featureType': 'administrative.country',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#9e9e9e'
							}
						]
					},
					{
						'featureType': 'administrative.locality',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#bdbdbd'
							}
						]
					},
					{
						'featureType': 'poi',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#757575'
							}
						]
					},
					{
						'featureType': 'poi.park',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#181818'
							}
						]
					},
					{
						'featureType': 'poi.park',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#616161'
							}
						]
					},
					{
						'featureType': 'poi.park',
						'elementType': 'labels.text.stroke',
						'stylers': [
							{
								'color': '#1b1b1b'
							}
						]
					},
					{
						'featureType': 'road',
						'elementType': 'geometry.fill',
						'stylers': [
							{
								'color': '#2c2c2c'
							}
						]
					},
					{
						'featureType': 'road',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#8a8a8a'
							}
						]
					},
					{
						'featureType': 'road.arterial',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#373737'
							}
						]
					},
					{
						'featureType': 'road.highway',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#3c3c3c'
							}
						]
					},
					{
						'featureType': 'road.highway.controlled_access',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#4e4e4e'
							}
						]
					},
					{
						'featureType': 'road.local',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#616161'
							}
						]
					},
					{
						'featureType': 'transit',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#757575'
							}
						]
					},
					{
						'featureType': 'water',
						'elementType': 'geometry',
						'stylers': [
							{
								'color': '#000000'
							}
						]
					},
					{
						'featureType': 'water',
						'elementType': 'labels.text.fill',
						'stylers': [
							{
								'color': '#3d3d3d'
							}
						]
					}
				]}
			/>
		)
	}
}


