import React, { Component } from 'react'
import Geolocation from 'react-geolocation'
import {currentPlayer, currentLocation, currentTargets} from '../store'
import {connect} from 'react-redux'
import { compose } from 'redux'



class GetLocation extends Component {
	constructor( props ) {
		super(props)
		this.state = {
			currentLocation: {}
		}

	}
	componentDidMount () {
		this.props.getLocation({latitude: this.state.currentLocation.latitude, longitude: this.state.currentLocation.longitude})

	}
	render() {
<<<<<<< HEAD
		// console.log(this.state.currentLocation)
=======
>>>>>>> master
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


const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = ( dispatch ) => {
	return {
		getPlayer( evt ) {
			dispatch(currentPlayer(evt))
		}
		,
		getLocation( evt ) {
			console.log(evt)
			dispatch(currentLocation(evt))
		}
		,
		getTargets( evt ) {
			dispatch(currentTargets(evt))
		}
	}
}


const LocationTracker = connect(mapStateToProps, mapDispatchToProps)(GetLocation)
export default LocationTracker

