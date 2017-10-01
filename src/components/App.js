import React, { Component } from 'react';
import FirebaseUIAuth from './firebaseUIAuth';
import firebase, { ui } from '../fire'
import SideBar from './SideBar';
import '../index.css';
import { connect } from 'react-redux'
import { currentPlayer } from '../store/index'

class App extends Component {
	state = {
		loading: true,
		user   : null
	}

	constructor() {
		super();
		this.uiConfig = {
			// Called when the user has been successfully signed in.
			callbacks    : {
				signInSuccess: ( currentUser, credential, redirectUrl ) => {
					// Do not redirect.
					return false;
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
			tosUrl       : 'https://www.google.com'
		};
		this.getPlayer = this.getPlayer.bind(this)
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(( user ) => {
			this.setState({ loading: false, user });
		});
		this.state.user ? this.props.getPlayer(this.state.user.email) : null
	}

	deleteAccount = () => {
		firebase.auth().currentUser.delete().catch(( error ) => {
			if (error.code === 'auth/requires-recent-login') {
				// The user's credential is too old. She needs to sign in again.
				firebase.auth().signOut().then(() => {
					// The timeout allows the message to be displayed after the UI has
					// changed to the signed out state.
					setTimeout(() => {
						alert('Please sign in again to delete your account.');
					}, 1);
				});
			}
		});
	}
	getPlayer = ( data ) => {
		this.props.getPlayer(data)
	}

	render() {
		return (
			<div className="App">
				{this.state.loading ? (
					<div id="loading">Loading...</div>
				) : (
					this.state.user ? (
						<div>
							<SideBar/>
							<div>Home page!!
								<div id="user-info">
									<div id="photo-container">
										<img id="photo" src={this.state.user.photoURL}
										     alt={this.state.user.displayName}/>
									</div>
									<div>{this.state.user.displayName}</div>
									<div>{this.state.user.email}</div>
								</div>
								<p>
									<button onClick={() => {firebase.auth().signOut()}}>Sign Out</button>
									<button onClick={this.deleteAccount}>Delete account</button>
								</p>
							</div>
						</div>
					) : (
						<div>
							<h4>You are signed out.</h4>
							<FirebaseUIAuth ui={ui} {...this.uiConfig} />
						</div>
					)
				)}
			</div>
		);
	}
}

const mapDispatchToProps = ( dispatch ) => {
	return {
		getPlayer( evt ) {
			console.log(evt)
			dispatch(currentPlayer(evt))
		}
	}
}

export default connect(state => state, mapDispatchToProps)(App)



