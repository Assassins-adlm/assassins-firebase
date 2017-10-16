/* eslint-disable no-undef */
import React from 'react'
import styled, {keyframes} from 'styled-components'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
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
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import Geofire from 'geofire'
import MapStyle from './MapStyle.json'
import {addCurrTarget, getCurrToken, battle, setStatus, revivePlayer} from '../../store'
import {filterPlayers, filterPlayer} from './HelperFunc'
const NotificationSystem = require('react-notification-system')
const MapWithAMarkerClusterer = withGoogleMap(props =>{
	const playerIcon = {url: './images/markers/assassin-icon.png'}
	const otherPlayersIcon = {url: './images/markers/players-icon.png'}
	const {mapStyles, currPlayer, players} = props
	const targets = Object.values(players).filter(player => {
		return player.uid === (currPlayer.targets ? currPlayer.targets[0][1] : null)
	})[0]
	console.log('current player==>', currPlayer)
	console.log('all targets==>', targets)
	// console.log('all players==>', allPlayers)
	let myLocation

	if (currPlayer.Locations) {
		myLocation = []
		myLocation[0] = currPlayer.Locations.lat || 40
		myLocation[1] = currPlayer.Locations.lon || -74
	}

	let color = props.profile.beingTargeted ? 'yellow' : (props.profile.assassins ? 'red' : 'green'), duration = 0.5

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

	console.log('my location==>', myLocation)
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
		// const {profile, target} = this.props
		// console.log('target===>', target)
		// const player = profile
		console.log(this.props.profile)
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
		// target: state.player.target,
		assassin: state.player.assassin,
		guessPrompt: state.player.guessPrompt,
		token: state.player.token
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getCurrentToken(id) {
			dispatch(getCurrToken(id))
		},
		getCurrPlayer(uid) {
			dispatch(fetchCurrPlayer(uid))
		},
		getAllPlayer() {
			dispatch(fetchPlayers())
		},
		togglePlayer(player) {
			dispatch(toggleSelectedPlayer(player))
		},
		submitCurrTarget(player, target) {
			dispatch(addCurrTarget(player, target))
		},
		setStatus(player, role, status) {
			dispatch(setStatus(player, role, status))
		},
		listenAllPlayer() {
			dispatch(listeningAllPlayer())
		},
		listenMyself(uid) {
			dispatch(listeningMyself(uid))
		},
		battle(player, target) {
			dispatch(battle(player, target))
		},
		revivePlayer(player) {
			dispatch(revivePlayer(player))
		}
	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(MapBox)
