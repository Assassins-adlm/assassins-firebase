import fetch from 'isomorphic-fetch'
import firebase from '../fire'
import React from 'react'
import { compose, withProps } from 'recompose'
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
} from 'react-google-maps'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	populateDataToJS,
	pathToJS
} from 'react-redux-firebase'

import Geofire from 'geofire'



import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'

const MapWithAMarkerClusterer = compose(
	withProps({
		googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
		loadingElement: <div style={{ height: '100%' }} />,
		containerElement: <div style={{ height: '100vh' }} />,
		mapElement: <div style={{ height: '100%' }} />,
	}),
	withScriptjs,
	withGoogleMap
)(props =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: 40.704, lng: -74.009}}
	>
		<MarkerClusterer
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.markers.map(marker => (
				<Marker
					key={marker.photo_id}
					position={{ lat: marker[0], lng: marker[1] }}
				/>
			))}
		</MarkerClusterer>
	</GoogleMap>
)

export default class MapBox extends React.PureComponent {

	constructor(){
		super()
		this.state={
			players:[],
	  	markers: [],
		}
	}

	// componentWillMount() {
	// 	const playersRef = firebase.database().ref('players')
	// 	playersRef.on('value', (snapshot) => {
	// 		let players = snapshot.val()
	// 		let newlocations = []
	// 		for(var player in players){
	// 			console.log(players[player].location, 'for loop')
	// 			newlocations.push(players[player].location)

	// 		}
	// 		console.log(newlocations, '!!!!')
	// 		this.setState({
	// 			markers: newlocations
	// 		})
	// 	})
	// }

	// GEOFIRE TEST

	componentDidMount(){
		var firebaseRef = firebase.database().ref('Players')
		var geoFire = new Geofire(firebaseRef)
		var Dennis = firebaseRef.child('Dennis/Locations').orderByChild('tst').limitToLast(1)
		var Leslie = firebaseRef.child('leslie/Locations').orderByChild('tst').limitToLast(1)



		// var coords = data => data

		Dennis.on('value', snapshot =>{
			let info = Object.values(snapshot.val())[0]

			let lat = info.lat
			let long = info.lon
			// coords([long, lat])

			Leslie.on('value', snap=>{
				let info2 = Object.values(snap.val())[0]
				let lat2 = info2.lat
				let long2 = info2.lon
				let distance = Geofire.distance([lat, long], [lat2, long2])
        console.log('Patrick is awesome, ',distance)
        // console.log('asdfasdf',info, info2)
			})

		})



		// console.log('kaeadfb ',  Dennis)

		// target.on('value', snapshot =>{
		// 	// var lat2 = +Object.values(snapshot.val())[0].lat
		// 	// var long2 = +Object.values(snapshot.val())[0].lon
		// 	// here.setState({
		// 	// 	player2: [lat2, long2]
		// 	// })
		// })

		// var distance = Geofire.distance([lat1, long1], [lat2, long2])

	}




	// GEOFIRE TEST


	render() {

		let user = this.state.players

		//markers={this.state.markers}
		return (
			<MapWithAMarkerClusterer markers={this.state.markers}/>
		)
	}
}





// let location = firebase.database().ref('Players/leslie/Locations')
// let now = Date.now()
// let cutoff = now - 570 //57 === 1 min
// let old = location.orderByChild('tst').endAt(cutoff).limitToLast(1)

// old.once('value', function(snapshot) {
// 	// snapshot.ref.remove()

// 	var updates = {}
// 	snapshot.forEach(function(child) {
// 		updates[child.key] = null
// 	})
// 	return location.update(updates)

// })
