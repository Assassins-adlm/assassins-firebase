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
			<GoogleMap
				zoom={15}
				defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: mapStyles, mapTypeControl: false }}
			>
				<MarkerClusterer
					averageCenter
					enableRetinaIcons
					gridSize={10}
				>
					{players.map((player, idx) => {
						return (
							(player.Locations && player.status!=='dead') && //need to change this
						<Marker
							key={idx}
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: player.Locations.lat, lng: player.Locations.lon }}
							onClick={()=> {
								props.onToggleOpen(player)
							}}
						>
							{
								player.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(player)}}>
									{
										player.id === currPlayer.id ? <MyInfo {...currPlayer}/> : <MyTarget submitTarget={props.submitTarget} target={player} currPlayer={currPlayer}/>
									}
								</InfoWindow>
							}
						</Marker>
						)
					})}
				</MarkerClusterer>
			</GoogleMap> )
	} else if (!myLocation) {
		return (
			<GoogleMap
				zoom={15}
				defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: mapStyles, mapTypeControl: false }}
			>
				<HeatmapLayer
					data={Object.values(target.Locations).map(location => {
						return new google.maps.LatLng(location.lat, location.lon)
					})}
				>
				</HeatmapLayer>
			</GoogleMap>
		)
	} else {
		return (
			<div>loading...</div>
		)
	}
})

class MapBox extends React.PureComponent {

	constructor(){
		super()
		this.onToggleOpen = this.onToggleOpen.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
	}

	submitTarget(target) {
		// console.log('target-->', target.id)
		const {submitCurrTarget, player} = this.props
		submitCurrTarget(player, target)
	}

	onToggleOpen(player) {
		const {togglePlayer} = this.props
		togglePlayer(player)
	}

	componentDidMount() {


	}

	render() {
		console.log('redering!!')
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
	auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(Map)

// export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(MapBox)
