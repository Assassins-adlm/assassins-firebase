import React, { Component } from 'react'
// import {connect} from 'react-redux'
// import {Col, Row, Button} from 'react-bootstrap'
import Geolocation from 'react-geolocation'

export default class GetLocation extends Component {
	constructor( props ) {
		super()
		this.state = {
			currentLocation: {}
		}

	}

	render() {
		return (
			<div>
				<Geolocation
					render={( {
						fetchingPosition,
						position: { coords: { latitude, longitude } = {} } = {},
						error,
						getCurrentPosition
					} ) =>
						<div>
							<button onClick={getCurrentPosition}>Get Position</button>
							{error &&
							<div>
								{error.message}
							</div>}
							<pre>
                                latitude: {latitude}
								longitude: {longitude}
					      </pre>
						</div>}
				/></div>
		)
	}
}
