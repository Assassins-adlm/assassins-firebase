/* eslint-disable no-undef */
import React from 'react'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import EngagePrompt from './EngagePrompt'
import GuessPrompt from './GuessPrompt'
import BattleResult from './BattleResult'
import TargetingWarning from './TargetingWarning'
import Revive from './revive'
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded, isEmpty} from 'react-redux-firebase'
import {connect} from 'react-redux'
import {compose} from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import Geofire from 'geofire'
import MapStyle from './MapStyle.json'
import {addCurrTarget, getCurrToken, battle, setStatus, revivePlayer} from '../store'
import {filterPlayers, filterPlayer} from './HelperFunc'
const NotificationSystem = require('react-notification-system')
const MapWithAMarkerClusterer = withGoogleMap(props =>{
	const playerIcon = {url: './images/markers/assassin-icon.png'}
	const otherPlayersIcon = {url: './images/markers/players-icon.png'}
	const {players, mapStyles, target, profile} = props
	const currPlayer = filterPlayer(profile)
	const allPlayers = filterPlayers(players)
	console.log('current player==>', currPlayer)
	console.log('all players==>', allPlayers)
	let myLocation
	if (currPlayer.Locations) {
		myLocation = []
		myLocation[0] = currPlayer.Locations.lat || 40
		myLocation[1] = currPlayer.Locations.lon || -74
	}
	if (myLocation && !target) {
		return (
			<div>
				<GoogleMap
					zoom={18}
					center={{ lat: myLocation[0], lng: myLocation[1]}}
					options={{ styles: mapStyles, mapTypeControl: false }}
				>
					<MarkerClusterer
						averageCenter
						enableRetinaIcons
						gridSize={10}
					>
						{allPlayers.map((player, idx) => {
							return (
								(player.Locations && player.status!=='dead') && //need to change this
					<Marker
						key={idx}
						icon={player.uid === currPlayer.uid ? playerIcon : otherPlayersIcon}
						position={{ lat: player.Locations.lat, lng: player.Locations.lon }}
					>
						{
							player.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(player)}}>
								{
									player.uid === currPlayer.uid ? <MyInfo {...currPlayer}/> : <MyTarget submitTarget={props.submitTarget} target={player} currPlayer={currPlayer}/>
								}
							</InfoWindow>
						}
					</Marker>
							)
						})}
					</MarkerClusterer>
				</GoogleMap> </div>)
	} else if (myLocation && target) {
		return (
			<GoogleMap
				zoom={15}
				center={{ lat: myLocation[0], lng: myLocation[1]}}
				options={{ styles: mapStyles, mapTypeControl: false }}
			>
				<HeatmapLayer
					data={Object.values(target.Locations).map(location => {
						return new google.maps.LatLng(location.lat, location.lon)
					})}
				>
				</HeatmapLayer>
				{
					allPlayers.map(player => player.uid === currPlayer.uid ?
						<Marker
							key={player.uid}
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: myLocation[0], lng: myLocation[1] }}
						>
							{
								player.openInfo && <InfoWindow onCloseClick={() => {props.onToggleOpen(player)}}>
									<MyInfo {...player}/>
								</InfoWindow>
							}
						</Marker> : null
					)
				}

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
		// this.onToggleOpen = this.onToggleOpen.bind(this)
		this.submitTarget = this.submitTarget.bind(this)
	}

	submitTarget(target) {
		const {submitCurrTarget, player} = this.props
		submitCurrTarget(player, target)
	}

	// onToggleOpen(player) {
	// 	const {togglePlayer} = this.props
	// 	togglePlayer(player)
	// }

	componentDidMount() {
		// const {profile, listenAllPlayer, listenMyself, getCurrentToken} = this.props
		// getCurrPlayer(profile.uid)
		// getAllPlayer()
		// listenAllPlayer()
		// listenMyself(profile.uid)
		// getCurrentToken(profile.uid)
	}

	render() {
		const {profile, target, guessPrompt, assassin, revivePlayer} = this.props
		console.log('target===>', target)
		const player = profile
		return (
			isLoaded(this.props.profile) && isLoaded(this.props.players) &&
			<div>
				{/* {
					player.Locations && player.status !== 'dead' && target && target.status !== 'dead' && !target.assassin && <EngagePrompt key={JSON.stringify(player)} player={player} target={target} battle={this.props.battle}/>
				}
				{
					guessPrompt && player.assassin && <GuessPrompt player={player} assassin={assassin} setStatus={this.props.setStatus}/>
				}
				{
					(player.status === 'dead' || player.status === 'kill') && <BattleResult player={player} status={player.status} setStatus={this.props.setStatus}/>
				}
				{
					player.status === 'dead' && <Revive revivePlayer={revivePlayer} player={player}/>
				}
				{
					player.beingTargeted && <TargetingWarning />
				} */}
				<MapWithAMarkerClusterer
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{ height: '100%' }} />}
					containerElement={<div style={{ height: '85vh' }} />}
					mapElement={<div style={{ height: '100%' }} />}
					{...this.props}
					onToggleOpen={this.onToggleOpen}
					submitTarget={this.submitTarget}
					mapStyles={MapStyle}
				/></div> )
	}
}

const mapStateToProps = (state) => {
	return {
		profile: pathToJS(state.firebase, 'profile'),
		players: dataToJS(state.firebase, 'players'),
		target: state.player.target,
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
