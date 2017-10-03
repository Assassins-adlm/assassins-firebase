import React, {Component} from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'

// let randCoords = [
// 	[-73.9445475,40.6740157],
// 	[-74.01316889999998, 40.7130082],
// 	[-74.0445004, 40.6892494]
// ]
// let long, lat
export default class MapBox extends Component {

	constructor(){
		super()
		this.state = {
			 players:[],
			 positions: []
		}
		this.getLocationUpdate = this.getLocationUpdate.bind(this)
	}

	getLocationUpdate(){

		var watchID
		var geoLoc
		//  var longitude;
		//  var latitude;

		//  long = longitude;
		//  lat = latitude;
		//  console.log('boopbeep',this.state)
		// this.setState({
		//         long: longitude,
		//         lat: latitude
		// })

		function showLocation(position) {
			var latitude = position.coords.latitude
			var longitude = position.coords.longitude

			long = longitude,
			lat = latitude


			var accuracy = position.coords.accuracy
			alert('Latitude : ' + latitude + ' Longitude: ' + longitude + ' accuracy: ' + accuracy)

		}

		function errorHandler(err) {
			if(err.code == 1) {
				alert('Error: Access is denied!')
			}

			else if( err.code == 2) {
				alert('Error: Position is unavailable!')
			}
		}

		if(navigator.geolocation){
			// timeout at 60000 milliseconds (60 seconds)
			var options = {timeout:6000}
			geoLoc = navigator.geolocation
			watchID = geoLoc.watchPosition(showLocation, errorHandler, options)
		}

		else{
			alert('Sorry, browser does not support geolocation!')
		}
	}

	componendDidMount(){
		const playersRef = firebase.database().ref('players')
		playersRef.on('value', (snapshot) => {
			let players = snapshot.val()
			let playersList = []
			for(var player in players){
				playersList.push(players[player])
			}
			this.setState ({
				players: playersList
			})
		})
		// const locationsRef = firebase.database().ref('position')
		// locationsRef.on('value', (snapshot) => {
		// 	let location = snapshot.val()
		// 	let locationList = []
		// 	for(var location in locations){
		// 		locationList.push(locations[location])
		// 	}
		// 	this.setState ({
		// 		position: locationList
		// 	})
		// })
	}


	render(){

		let user = this.props.props
		const Map = ReactMapboxGl({
			accessToken: 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g'
		})
		let listOfPlayers = this.state.players
		console.log(listOfPlayers, "PlayerList")

		return(

			<div>
				<Map
					style="mapbox://styles/mapbox/dark-v9"
					containerStyle={{
						height: '100vh',
						width: '100vw'
					}}
					center={[-74.0, 40.731]}>
					{
						listOfPlayers.map((player, ind) => {
					   		return(
										<Layer
											key={ind}
											type="symbol"
											// id={ind}
											layout={{ 'icon-image': 'marker-15' }}>
											<Feature coordinates={}/>
										</Layer>
							)
						})
					}
				</Map>
			</div>
		)
	}
}




