/* eslint-disable no-undef */
import React from 'react'
import styled, {keyframes} from 'styled-components'
import EngagePrompt from './EngagePrompt'
import GuessPrompt from './GuessPrompt'
import BattleResult from './BattleResult'
import TargetingWarning from './TargetingWarning'
import LockTarget from './LockTarget'
import Revive from './revive'
import {withGoogleMap, GoogleMap, Marker, InfoWindow, OverlayView} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded, isEmpty} from 'react-redux-firebase'
import {connect} from 'react-redux'
import {compose} from 'redux'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import MapStyle from './MapStyle.json'
import {filterPlayer} from './HelperFunc'

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	const playerIcon = {url: './images/markers/assassin-icon.png'}
	const {mapStyles, currPlayer, players} = props
	const targets = Object.values(players).filter(player => {
		return player.uid === (currPlayer.targets ? currPlayer.targets[0][1] : null)
	})[0]
	let myLocation

	if (currPlayer.Locations) {
		myLocation = []
		myLocation[0] = currPlayer.Locations.lat || 40
		myLocation[1] = currPlayer.Locations.lon || -74
	}

	let color = props.profile.beingTargeted ? 'yellow' : (props.profile.assassins ? 'red' : 'green'), duration = 2

	const pulseAnimation = keyframes`
  0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
	50% {opacity: 1.0;}
	100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
`

	const Pulse = styled.div`
  position: relative;
  height: 150px;
  width: 150px;
  z-index: 2;
  opacity: 0;
  border: 5px solid ${color};
  background: transparent;
  border-radius: 50%;
  animation: ${pulseAnimation} ${duration}s ease-out infinite;
`
	const getPixelPositionOffset = (width, height) => ({
		x: -(width / 2),
		y: -(height / 2),
	})

	if (myLocation) {
		return (
			<div>
				<GoogleMap
					zoom={18}
					defaultCenter={{ lat: myLocation[0], lng: myLocation[1]}}
					options={{ styles: mapStyles, mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
				>
					{
						targets && <HeatmapLayer
							data={Object.values(targets.Locations).map(location => {
								return new google.maps.LatLng(location.lat, location.lon)
							})}
						>
						</HeatmapLayer>
					}
					<div>
						<Marker
							icon={playerIcon}
							position={{ lat: myLocation[0], lng: myLocation[1] }}
						>
							<OverlayView
								position={{ lat: myLocation[0], lng: myLocation[1] }}
								mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
								getPixelPositionOffset={getPixelPositionOffset}
								key={Math.random()}
							>
								<div>
									<Pulse/>
								</div>
							</OverlayView>
						</Marker>
					</div>
				</GoogleMap> </div>)
	} else {
		return (
			<div>loading...</div>
		)
	}
})

class MapBox extends React.PureComponent {

	constructor(props){
		super(props)
	}

	render() {
		const currPlayer = isLoaded(this.props.profile) ? filterPlayer(this.props.profile) : null
		return (
			currPlayer && isLoaded(this.props.players) &&
			<div>
				{
					currPlayer.Locations && currPlayer.status !== 'dead' && currPlayer.status !== 'fail' && currPlayer.status !== 'assassinate' && currPlayer.targets && <EngagePrompt key={Math.random()} currPlayer={currPlayer} players={this.props.players} battle={this.props.battle}/>
				}
				{
					currPlayer.status && currPlayer.status === 'assassinate' && <LockTarget />
				}
				{
					currPlayer.assassins && <GuessPrompt />
				}
				{
					(currPlayer.status === 'dead' || currPlayer.status === 'kill' || currPlayer.status === 'reveal' || currPlayer.status === 'fail') && <BattleResult currPlayer={currPlayer}/>
				}
				{
					(currPlayer.status === 'dead' || currPlayer.status === 'fail') && <Revive />
				}
				{
					this.props.profile.beingTargeted && <TargetingWarning />
				}
				{
					(this.props.profile.status !== 'dead' && this.props.profile.status !== 'fail') &&
					<MapWithAMarkerClusterer
						googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<div style={{ height: '100%' }} />}
						containerElement={<div style={{ height: '80vh' }} />}
						mapElement={<div style={{ height: '100%' }} />}
						{...this.props}
						currPlayer={currPlayer}
						onToggleOpen={this.onToggleOpen}
						submitTarget={this.submitTarget}
						mapStyles={MapStyle}
					/>
				}
			</div> )
	}
}

const mapStateToProps = (state) => {
	return {
		profile: pathToJS(state.firebase, 'profile'),
		players: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'}]), connect(mapStateToProps))(MapBox)
