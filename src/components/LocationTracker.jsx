import React, { Component } from 'react'
import Geolocation from 'react-geolocation'
import firebase from '../fire'

export default class GetLocation extends Component {
	constructor( props ) {
		super()
		// this.state = {
		// 	// currentLocation: {}
		// 	longitude: 0,
		// 	latitude:0
		// }

	}

	render() {
		const playerRef = firebase.database().ref()
		const position = playerRef.child('position')
		return (
			<div>
				<div> {navigator.geolocation.getCurrentPosition(pos => position.push({latitude: pos.coords.latitude, longitude: pos.coords.longitude}))}</div>
				<Geolocation render={({
					fetchingPosition,
					position: { coords: { latitude, longitude } = {} } = {},
					error,
					getCurrentPosition
				}) =>(
					<div>
						<button onClick={()=>{getCurrentPosition()}}>Get Position</button>
						{error &&
							<div>
								{error.message}
							</div>}
						<pre>
							latitude: {latitude}
							longitude: {longitude}
					    </pre>
					</div>
				)
				}
				/>
			</div>
		)
	}
}

//
// const mapState = (state) => {
// 	return {
// 		player: state.user.email
// 	}
// }

// export default connect(mapState)(UserHome)

