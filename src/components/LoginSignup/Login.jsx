import React, {Component} from 'react'
import MapBox from '../MapBox'
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import {connect} from 'react-redux'
import {compose} from 'redux'
import Paper from 'material-ui/Paper'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'
import './style.css'


class Login extends Component {

	constructor() {
		super()
		this.state = {
			loading: true,
			user: null,
			newPlayer: true,
		}
		this.handleLogin = this.handleLogin.bind(this)
		this.handleSignIn = this.handleSignIn.bind(this)

	}

	componentDidMount() {

	}

	handleLogin = (evt) => {
		evt.target.name === 'email' ? this.setState({email: evt.target.value}) : this.setState({password: evt.target.value})
		console.log(this.state)
	}
	handleSignIn = () => {
		this.props.firebase.login({email: this.state.email, password: this.state.password}).catch(alert)
	}

	render() {
		const style = {
			display: 'inline-block',
			margin: '16px 16px 16px 20px',
			textAlign: 'center',
			width: '75%',
			float: 'left',
		}


		return (<Paper style={style} zDepth={5}>
				<div style={{width: '100%', maxWidth: 700}}>

					<h4> Login to Assassin Account </h4>
					<Divider/>

					<TextField
						onChange={this.handleLogin.bind(this)}
						name='email'
						hintText="Email Address"
					/>
					<Divider/>

					<TextField
						hintText="Password"
						onChange={this.handleLogin.bind(this)}
						name='password'
						type='password'
					/>
					<Divider/>

					<RaisedButton label="Sign in" backgroundColor='teal' fullWidth={true}
					              onClick={this.handleSignIn.bind(this)}/>
					<Divider/>

					<LinearProgress mode="indeterminate" color='lightblue'/>
					<Divider/>
				</div>
			</Paper>)

	}
}



const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
		profile: pathToJS(state.firebase, 'profile'), // pass profile data as this.props.profile

	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'auth'} ,{path: 'profile'}]), connect(mapStateToProps))(Login)





