import React from 'react'
import firebase from '../fire'
import SideBar from './SideBar'
import { Link } from 'react-router-dom'
import App from './App'
import '../profile.css'


class PlayerProfile extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			user: null
		}
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user})
		})
	}

	render() {
		return (
			this.state.user ?
				<div>
					<SideBar />
					<div className="container">
						<div className="profile">
							<img align="left" className="profile-background-image" src="./images/profile-background.jpg" alt="Profile image background"/>
							<img align="left" className="image-profile thumbnail" src={this.state.user.photoURL} alt="Profile image avatar"/>
							<div className="profile-text">
								{
									this.state.user && <h1>{this.state.user.displayName}</h1>
								}
								<p>Rookie Assassin / Joined 9/30/2017</p>
							</div>
						</div>
						<hr/>
						<div className="row">
							<div className="col-xs-4 profile-title">Rank<p>Rookie</p></div>
							<div className="col-xs-4 profile-title">Kills<p>5</p></div>
							<div className="col-xs-4 profile-title">Death<p>2</p></div>
						</div>
					</div>
				</div> :
				<div>
					<Link to="/home"><button className="btn btn-primary">Login</button></Link>
				</div>
		)
	}
}

export default PlayerProfile
