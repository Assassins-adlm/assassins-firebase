import React, { Component } from 'react'
import FirebaseUIAuth from './firebaseUIAuth'
import firebase, { ui } from '../fire'
import MapBox from './MapBox'
import SideBar from './SideBar'
import CharacterCreator from './charactercreator'
import '../index.css'

class App extends Component {


	constructor() {
		super()
		this.state = {
			loading: true,
			user   : null,
			newPlayer: true
		}
		this.uiConfig = {
			// Called when the user has been successfully signed in.
			callbacks    : {
				signInSuccess: ( currentUser, credential, redirectUrl ) => {
					// Do not redirect.
					return false
				}
			},
			// Opens IDP Providers sign-in flow in a popup.
			signInFlow   : 'popup',
			signInOptions: [
				{
					provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					scopes  : ['https://www.googleapis.com/auth/plus.login']
				},
				{
					provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					scopes  : [
						'public_profile',
						'email',
						'user_likes',
						'user_friends'
					]
				},
				firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				firebase.auth.GithubAuthProvider.PROVIDER_ID,
				{
					provider          : firebase.auth.EmailAuthProvider.PROVIDER_ID,
					// Whether the display name should be displayed in Sign Up page.
					requireDisplayName: true
				}
			],
			// Terms of service url.
			tosUrl: 'https://www.google.com'
		}
		this.doesUserExist= this.doesUserExist.bind(this)
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({loading: false, user})
			// console.log('user id--->', this.state.user.uid)
			if(this.state.user){
				this.doesUserExist()
			}
		})
	}

	doesUserExist() {
		let playerRef = firebase.database().ref('players')
		playerRef.on('value', (snapshot) => {
			let players = snapshot.val()
			for (let player in players) {
				if(players[player].id==this.state.user.uid){
					console.log('Match')
					this.setState({
						newPlayer: false
					})

				}
			}
		})
	}

	deleteAccount() {
		firebase.auth().currentUser.delete().catch(( error ) => {
			if (error.code === 'auth/requires-recent-login') {
				// The user's credential is too old. She needs to sign in again.
				firebase.auth().signOut().then(() => {
					// The timeout allows the message to be displayed after the UI has
					// changed to the signed out state.
					setTimeout(() => {
						alert('Please sign in again to delete your account.')
					}, 1)
				})
			}
		})
	}
	getPlayer( data ) {
		this.props.getPlayer(data)
	}

	render() {
		// let styles = {
		// 	width: '30px',
		// 	height: '50px'
		// }
		return (
			<div>
				{this.state.loading ? (
					<div id="loading">Loading...</div>
				) : (
					this.state.user ? (
						this.state.newPlayer
							? (<div>
								<SideBar />
								<CharacterCreator props = {this.state.user} />
							</div> )
							:(
								<div>
									<SideBar />
									<MapBox props = {this.state.user} />
										  	</div>)
					) : (
						<div >
							<h4 className = "space">You are signed out.</h4>
							<FirebaseUIAuth ui={ui} {...this.uiConfig} />
						</div>
					)
				)}
			</div>
		)
	}
}


// const mapDispatchToProps = ( dispatch ) => {
// 	return {
// 		getPlayer( evt ) {
// 			console.log(evt)
// 			dispatch(currentPlayer(evt))
// 		}
// 	}
// }

// export default connect(state => state, mapDispatchToProps)(App)



export default App



