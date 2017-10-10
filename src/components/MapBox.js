import React from 'react'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded, isEmpty} from 'react-redux-firebase'
import {connect} from 'react-redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import Geofire from 'geofire'
import MapStyle from './MapStyle.json'

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	const {mapStyles} = props
	let locations = Object.values(props.profile.Locations).map((v,i) => [v.lat, v.lon])
	const myLocation = locations ? locations[locations.length -1] : [11,11]
	const players = []
	if (myLocation) {
		return (
			<div>
				<GoogleMap
					zoom={50}
					defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
					options={{ styles: mapStyles, mapTypeControl: false }}
				>
					<MarkerClusterer
						averageCenter
						enableRetinaIcons
						gridSize={10}
					>
						<Marker
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: myLocation[0], lng: myLocation[1] }}>

						</Marker>
					</MarkerClusterer>
				</GoogleMap>
			</div>
		)
	} else if (!myLocation) {
		return (
			<GoogleMap
				zoom={100}
				defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: mapStyles, mapTypeControl: false }}
			>
			</GoogleMap>
		)
	} else {
		return (
			<div>loading...</div>
		)
	}
})

class MapBox extends React.PureComponent {

	constructor(props){
		super(props)
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
	}

	submitTarget(target) {
		const {submitCurrTarget, player} = this.props
		submitCurrTarget(player, target)
	}

	onToggleOpen(player) {
		const {togglePlayer} = this.props
		togglePlayer(player)
	}


	render() {
		const {profile, players} = this.props
		return (
			<div>

				{
					isLoaded(profile) && isLoaded(players) ?
						<MapWithAMarkerClusterer
							googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
							loadingElement={<div style={{ height: '100%' }} />}
							containerElement={<div style={{ height: '100vh' }} />}
							mapElement={<div style={{ height: '100%' }} />}
							{...this.props}
							onToggleOpen={this.onToggleOpen}
							submitTarget={this.submitTarget}
							mapStyles={MapStyle}
						/> : <div>loading...</div>
				}
			</div> )
	}
}


const Map = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'} , {path: 'step'}
])(MapBox)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
	step: dataToJS(firebase, '/step'),
	auth: pathToJS(firebase, 'auth')
}))(Map)

