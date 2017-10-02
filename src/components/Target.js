import React from 'react'
import firebase from '../fire'
import SideBar from './SideBar'

export default class Target extends React.Component {

	constructor(){
		super()
		this.state = {
			user: null,
			players: [],
			hasTarget: false,
		}
		this.loadAllPlayers = this.loadAllPlayers.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}


	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user})
			console.log(this.state.user.target, "Target")
			if(this.state.user.target===undefined){
				 this.loadAllPlayers()
			}
			else {
				this.setState({
					hasTarget: true
				})
			}
		})
	}

	loadAllPlayers(){
		const playersRef = firebase.database().ref('players')
		playersRef.on('value',(snapshot) => {
			let players = snapshot.val()
			let newPlayers =[]
			for(var player in players){
				newPlayers.push(players[player])
			}
			let newList = newPlayers.filter( player => {
				return this.state.user.uid!==player.id
			})
			this.setState ({
				players: newList
			})
		 })
	}

	handleClick(player){
		let currentUser = this.state.user
		return function(){
			let assassinId
			const playerRef = firebase.database().ref('players')
			playerRef.on('value',(snapshot) => {
				let players = snapshot.val()

				for(var player in players){
					if(players[player].id===currentUser.uid){
						console.log(players[player], player)
						return assassinId = player
					}
				}
			})
			const selectRef = firebase.database().ref(`/players/${assassinId}`)
			selectRef.update({
				target: player
			})
		}
	}

	render(){
		let players = this.state.players

		return(
			<div>
		  	{
					//if user has a target already
			   	this.state.hasTarget ? (
						<h1 className = "space" >Your target is {this.state.user.target.name}</h1>
						 ) :
						 (
							<div>
								<SideBar />
								<div >
									<h1 className = "space"> Choose Your Kill </h1>
									<h3 className = "space"> Targets </h3>
									<table >
										{
											players.map( (player) => {

												return (
													<tr key ={player.id}>
														<td >
															{player.name}
														</td>
														<td>
															<button className = "submit" type="submit" onClick= {this.handleClick(player)}>Target</button>
														</td>
													</tr>
												)})
										}
									</table>
								</div>
							</div>
	        	)}
			</div>
		)
	}
}
