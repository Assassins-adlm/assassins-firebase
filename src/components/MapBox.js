/* eslint-disable no-undef */
import React from 'react'
import firebase from '../fire'
import MyTarget from './TargetInfo'
import MyInfo from './MyInfo'
import EngagePrompt from './EngagePrompt'
import {withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer, Circle} from 'react-google-maps'
import {firebaseConnect, dataToJS, pathToJS, isLoaded} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import Geofire from 'geofire'
import FightScene from './fightScene'
import {generateFakeLocation, getLocation} from './HelperFunc'
import MapStyle from './MapStyle.json'
import {fetchCurrPlayer, fetchPlayers, toggleSelectedPlayer, addCurrTarget, fetchCurrTarget, listeningAllPlayer, listeningMyself, getCurrToken, determinWinner} from '../store'
const NotificationSystem = require('react-notification-system')

const MapWithAMarkerClusterer = withGoogleMap(props =>{
	// console.log('props***', props)
	const {players, mapStyles} = props
	const currPlayer = props.player
	let myLocation = [0,0]
	myLocation[0] = currPlayer.Locations.lat || 74
	myLocation[1] = currPlayer.Locations.lon || -40

	// let fakeLocation = props.fakeLocation
	console.log('curr player location*****>>', myLocation)

	return (
		myLocation ?
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
			</GoogleMap> : <div>loading...</div>)}
)

class MapBox extends React.PureComponent {

	constructor(){
		super()
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
		const {auth, getCurrPlayer, getAllPlayer, getCurrTarget, listenAllPlayer, listenMyself, getCurrentToken} = this.props
		getCurrPlayer(auth.uid)
		getAllPlayer()
		getCurrTarget(auth.uid)
		listenAllPlayer()
		listenMyself(auth.uid)
		getCurrentToken(auth.uid)
	}

	render() {
		console.log('redering!!')
		// console.log('props****>>', this.props)
		const {player, target} = this.props
		return (
			(isLoaded(this.props) ?
				<div>
					{
						player.Locations && target.Locations && <EngagePrompt key={JSON.stringify(player)} player={player} target={target} battle={this.props.battle}/>
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
		    	/></div> : <div>loading...</div>)
		)
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		players: state.player.players,
		player: state.player.player,
		target: state.player.target,
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
		getCurrTarget(uid) {
			dispatch(fetchCurrTarget(uid))
		},
		togglePlayer(player) {
			dispatch(toggleSelectedPlayer(player))
		},
		submitCurrTarget(player, target) {
			dispatch(addCurrTarget(player, target))
		},
		listenAllPlayer() {
			dispatch(listeningAllPlayer())
		},
		listenMyself(uid) {
			dispatch(listeningMyself(uid))
		},
		battle(id) {
			dispatch(determinWinner(id))
		}
	}
}

export default compose(firebaseConnect([{path: 'auth'}]), connect(mapStateToProps, mapDispatchToProps))(MapBox)
