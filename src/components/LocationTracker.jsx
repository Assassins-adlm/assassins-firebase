import React, { Component } from 'react'
import Geolocation from 'react-geolocation'

export default class GetLocation extends Component {
	constructor( props ) {
		super()
		this.state = {
			currentLocation: {}
		}

	}

	render() {
		// console.log(this.state.currentLocation)
		return (
			<div>
				<div> {navigator.geolocation.getCurrentPosition(pos => pos.toString())}</div>
				<Geolocation render={({
					fetchingPosition,
					position: { coords: { latitude, longitude } = {} } = {},
					error,
					getCurrentPosition
				}) =>
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
					</div>}
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

