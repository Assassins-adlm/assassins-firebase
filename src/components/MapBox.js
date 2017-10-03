import React, {Component} from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import firebase from '../fire'

let randCoords = [
	[-73.9445475,40.6740157],
	[-74.01316889999998, 40.7130082],
	[-74.0445004, 40.6892494]
]

export default class MapBox extends Component {
	constructor(){
		super()
		this.getLocationUpdate = this.getLocationUpdate.bind(this)
	}

	getLocationUpdate(){

		var watchID
		var geoLoc

		function showLocation(position) {
			var latitude = position.coords.latitude
			var longitude = position.coords.longitude
			var accuracy = position.coords.accuracy

			const playerRef = firebase.database().ref()
			const watchPosition = playerRef.child('watchPosition')
		
			var coords = Promise.all([longitude, latitude, accuracy])
				.then(res => {
					// console.log('long ', res[0])
					// console.log('latitude', res[1])
					// console.log('accurary', res[2])
					watchPosition.push({longitude: res[0], latitude: res[1], accuracy: res[2]})
				})
			// console.log('coordinates ', coords)
			//   watchPosition.push({})
			// alert('Latitude : ' + latitude + ' Longitude: ' + longitude + ' accuracy: ' + accuracy)

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
			var options = {enableHighAccuracy: true, timeout:6000}
			geoLoc = navigator.geolocation
			watchID = geoLoc.watchPosition(showLocation, errorHandler, options)
		}

		else{
			alert('Sorry, browser does not support geolocation!')
		}
	}


	render(){
		let user = this.props.props
		const Map = ReactMapboxGl({
			accessToken: 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g'
		})
	
		this.getLocationUpdate()
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
						randCoords.map((coord, ind) => {
							return(
								<Layer
									key={ind}
									type="symbol"
									layout={{ 'icon-image': 'marker-15' }}>
									<Feature coordinates={coord}/>
								</Layer>

							)
						})
					}


				</Map>
				<span className="space">
					<h1> WELCOME </h1>
					<h3>{user.displayName}</h3>
				</span>
			</div>
		)
	}
}





