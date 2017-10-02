import React from 'react'
import firebase from '../fire'
import SideBar from './SideBar'

export default class Target extends React.Component {

	constructor(){
		super()
		this.state = {
			user: null,
			players: []
		}
		this.loadAllPlayers = this.loadAllPlayers.bind(this)
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
      this.setState({loading: false, user})
      this.loadAllPlayers()
		})
	}

	loadAllPlayers(){
		const playersRef = firebase.database().ref('players')
		playersRef.on('value',(snapshot) => {
      let players = snapshot.val()
			for(let player in players) {
				if(this.state.user.uid!==players[player].id){
					this.state.players.push(players[player])
				}
			}
		})
	}

	render(){
    let players = this.state.players
    console.log( "players", players)

		return (

			<div>
				<SideBar />
				<div className = "space">
          <h1 > Choose Your Kill </h1>
          <table >
              <tr>
                <th> Player </th>
              </tr>
          <tbody>
          {
            players.map( player => {
              return (
              <tr>
                <span>
                <td>{player.name}</td>
                <button type = "button"> Target
                </button></span>
              </tr>
            )})
          }
          </tbody>
          </table>
				</div>
			</div>
		)
	}
}
