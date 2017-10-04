import firebase from '../fire'
import React from 'react'
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

const MyMarker = () => {
	return (
		<h1>wow</h1>
	)
}

const MapWithAMarkerClusterer = withScriptjs(withGoogleMap(props =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: 40.704, lng: -74.009}}
	>
		<MarkerClusterer
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.markers.map((marker, idx) => (
				<Marker
					key={idx}
					position={{ lat: marker[0], lng: marker[1] }}
					onClick={props.onToggleOpen}
				>
					{
						props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
							<MyMarker />
						</InfoWindow>
					}
				</Marker>
			))}
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

	onToggleOpen() {
		console.log('toggle')
		this.setState({isOpen: !this.state.isOpen})
	}

	componentWillMount() {
		const playersRef = firebase.database().ref('players')
		playersRef.on('value', (snapshot) => {
			let players = snapshot.val()
			let newlocations = []
			for(var player in players){
				console.log(players[player].location, 'for loop')
				newlocations.push(players[player].location)
			}
			console.log(newlocations, '!!!!')
			this.setState({
				markers: newlocations
			})
		})
	}

	render() {
		let user = this.state.players
		//markers={this.state.markers}
		return (
			<MapWithAMarkerClusterer
				googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
				loadingElement={<div style={{ height: '100%' }} />}
				containerElement={<div style={{ height: '100vh' }} />}
				mapElement={<div style={{ height: '100%' }} />}
				markers={this.state.markers}
				onToggleOpen={this.onToggleOpen}
				isOpen={this.state.isOpen}
			/>
		)
	}
}


