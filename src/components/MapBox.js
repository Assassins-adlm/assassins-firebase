/* eslint-disable no-undef */
import React from 'react'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import EngagePrompt from './EngagePrompt'
import GuessPrompt from './GuessPrompt'
import BattleResult from './BattleResult'
import TargetingWarning from './TargetingWarning'
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded, isEmpty} from 'react-redux-firebase'
import {connect} from 'react-redux'
import {compose} from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import Geofire from 'geofire'
import MapStyle from './MapStyle.json'
import {fetchCurrPlayer, fetchPlayers, toggleSelectedPlayer, addCurrTarget, listeningAllPlayer, listeningMyself, getCurrToken, battle, setStatus} from '../store'
const NotificationSystem = require('react-notification-system')

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	const {players, mapStyles, target} = props
	const currPlayer = props.player
	let myLocation
	if (currPlayer.Locations) {
		myLocation = []
		myLocation[0] = currPlayer.Locations.lat || 40
		myLocation[1] = currPlayer.Locations.lon || -74
	}
	if (myLocation && !target.Locations) {
		return (
			<div>
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
									player.uid === currPlayer.uid ? <MyInfo {...currPlayer}/> : <MyTarget submitTarget={props.submitTarget} target={player} currPlayer={currPlayer}/>
								}
							</InfoWindow>
						}
					</Marker>
							)
						})}
					</MarkerClusterer>
				</GoogleMap> </div>)
	} else if (myLocation && target.Locations) {
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
				{
					players.map(player => player.uid === currPlayer.uid ?
						<Marker
							key={player.uid}
							icon={{
								url: './images/markers/assassin-icon.png'
							}}
							position={{ lat: myLocation[0], lng: myLocation[1] }}
							onClick={()=> {
								props.onToggleOpen(player)
							}}
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

	componentDidMount() {
		const {auth, getCurrPlayer, getAllPlayer, listenAllPlayer, listenMyself, getCurrentToken} = this.props
		getCurrPlayer(auth.uid)
		getAllPlayer()
		listenAllPlayer()
		listenMyself(auth.uid)
		getCurrentToken(auth.uid)

	}

	render() {
		const {player, target, guessPrompt, assassin} = this.props
		return (
			<div>
				{
					player.Locations && target.Locations && player.status !== 'dead' && target.status !== 'dead' && !target.assassin && <EngagePrompt key={JSON.stringify(player)} player={player} target={target} battle={this.props.battle}/>
				}
				{
					guessPrompt && player.assassin && <GuessPrompt player={player} assassin={assassin} setStatus={this.props.setStatus}/>
				}
				{
					(player.status === 'dead' || player.status === 'kill') && <BattleResult status={player.status}/>
				}
				{
					player.beingTargeted && <TargetingWarning />
				}
				<MapWithAMarkerClusterer
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{ height: '100%' }} />}
					containerElement={<div style={{ height: '100vh' }} />}
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
		players: state.player.players,
		player: state.player.player,
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
		}
	}
}

export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(MapBox)
