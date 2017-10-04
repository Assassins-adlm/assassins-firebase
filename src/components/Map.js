import React, {Component} from 'react'
import ReactMapGL from 'react-map-gl'

export default class Map extends Component {

	render() {
		// const Map = ReactMapGL({
		// 	accessToken: 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g'
		// })
		return (
			<ReactMapGL
				width={400}
				height={400}
				latitude={37.7577}
				longitude={-122.4376}
				zoom={8}
				onViewportChange={(viewport) => {
					const {width, height, latitude, longitude, zoom} = viewport
					// Optionally call `setState` and use the state to update the map.
				}}
			/>
		)
	}
}
