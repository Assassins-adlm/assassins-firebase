import React from 'react'
//Redux
import {connect} from 'react-redux'
import {compose} from 'redux'
import { currentTargets} from '../../store/index'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'
import PropTypes from 'prop-types'

//Material UI
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import './style.css'


//Config File Downloader
import fileDownload from 'react-file-download' //get new dl library non depc

import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

class CharCreate extends React.Component {
	static propTypes = {
		firebase: PropTypes.shape({
			push: PropTypes.func.isRequired,
			set: PropTypes.func.isRequired,
		}),
	}

	constructor(props) {
		super(props)
		this.state = {
			finished: false,
			stepIndex: 0,
			charName: '',
			charAvatarUrl: '',
			os: '',
			uid: '',
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handlePrev = this.handlePrev.bind(this)
		this.getStepContent = this.getStepContent.bind(this)
	}

	handleChange(evt) {
		evt.preventDefault()
		evt.target.name === 'charName' ? this.setState({charName: evt.target.value}) :
			evt.target.name === 'charAvatarUrl' ? this.setState({charAvatarUrl: evt.target.value}) : evt.target.name === 'os' ? this.setState({os: evt.target.value}) : evt.target.name === 'email' ? this.setState({email: evt.target.value}) : this.setState({password: evt.target.value})
		console.log(this.state)
	}

	handleNext = () => {
		const {stepIndex} = this.state
		const {set} = this.props.firebase
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex >= 4,
		})


		stepIndex === 4 && isLoaded(this.props.firebase) ? this.props.firebase.createUser({
			email: this.state.email,
			password: this.state.password,
		}).then(e => this.setState({uid: this.props.auth.uid})).catch(alert) : console.log('waiting...')

		stepIndex === 4 ? set(`/players/${this.state.uid}`, {
			name: this.state.charName,
			id: this.state.uid,
			image: this.state.charAvatarUrl,
			location: [40.703, -74.009],
			target: "",
		}) : console.log('unable to send')

	}

	handlePrev = () => {
		const {stepIndex} = this.state
		if (stepIndex > 0) {
			this.setState({stepIndex: stepIndex - 1})
		}
	}

	getStepContent(stepIndex) {

		switch (stepIndex) {
			case 0:
				return (
					<div>
						<TextField
							floatingLabelText="Enter your email: "
							onChange={this.handleChange.bind(this)}
							fullWidth={true}
							name='email'
							key={152}
						/>
						<TextField
							floatingLabelText="password 6 chars minimum"
							onChange={this.handleChange.bind(this)}
							fullWidth={true}
							name='password'
							key={1248}
							type="password"
						/>
					</div>
				)
			case 1:
				return (
					<TextField
						floatingLabelText="Enter Player Name"
						onChange={this.handleChange.bind(this)}
						fullWidth={true}
						name='charName'
						key={8}
					/>
				)
			case 2:
				return (
					<TextField key={9}
					           floatingLabelText="Enter URL of Avatar"
					           onChange={this.handleChange.bind(this)}
					           fullWidth={true}
					           name='charAvatarUrl'
					/>
				)
			case 3:
				return (
					<RadioButtonGroup name="Mobile OS" defaultSelected="ios" onChange={this.handleChange.bind(this)}>
						<RadioButton
							value="ios"
							label="Apple iOS"
							name="os"
							key={1}
						/>
						<RadioButton
							value="android"
							label="Android"
							name="Android"
							key={2}
						/>

					</RadioButtonGroup>
				)
			case 4:

				return (
					<div>{this.state.os === 'android' ? fileDownload(`{"_type":"configuration","waypoints":[],"autostartOnBoot":true,"beaconBackgroundScanPeriod":30,"beaconForegroundScanPeriod":0,"beaconLayout":"m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24","beaconMode":0,"cleanSession":false,"httpSchedulerConsiderStrategyDirect":true,"ignoreInaccurateLocations":0,"ignoreStaleLocations":0,"locatorAccuracyBackground":1,"locatorAccuracyForeground":0,"locatorDisplacement":1,"locatorInterval":10,"mode":3,"notification":true,"ranging":false,"url":"https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json"}`, `config.otrc`) : fileDownload(`{ "ranging" : false, "positions" : 50, "sub" : true, "locked" : false, "url" : "https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json", "deviceId" : "", "monitoring" : 2, "cmd" : false, "tid" : "as", "allowRemoteLocation" : true, "_type" : "configuration", "ignoreStaleLocations" : 0, "updateAddressBook" : true, "allowinvalidcerts" : false, "locatorInterval" : 120, "extendedData" : true, "ignoreInaccurateLocations" : 0, "locatorDisplacement" : 1, "mode" : 3, "cp" : true }`, 'config.otrc')} </div>
				)

			default:
				return 'Download App and Config file'
		}
	}

	render() {
		const {finished, stepIndex} = this.state
		const contentStyle = {margin: '0 16px'}
		const paperStyle = {
			display: 'inline-block',
			margin: '16px 32px 16px 20px',
			textAlign: 'center',
		}
		let {auth} = this.props
		return (isLoaded(this.props.auth) &&  isEmpty(this.props.auth) ?
				<Paper style={paperStyle} zDepth={5} className='signupComp'>
			<div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<Stepper activeStep={stepIndex}>
					<Step>
						<StepLabel>Sign Up</StepLabel>
					</Step>
					<Step>
						<StepLabel>Select Player Name</StepLabel>
					</Step>
					<Step>
						<StepLabel> Avatar Image URL </StepLabel>
					</Step>
					<Step>
						<StepLabel> Install OwnTrack Config</StepLabel>
					</Step>
				</Stepper>
				<div style={contentStyle}>
					{finished ? (
						<p>
							<a
								href="#"
								onClick={(event) => {
									event.preventDefault()
									this.setState({stepIndex: 0, finished: true})
								}}
							>
							</a>
						</p>
					) : (
						<div>
							<p>{this.getStepContent(stepIndex)}</p>
							<div style={{marginTop: 12}}>
								<FlatButton
									label="Back"
									disabled={stepIndex === 0}
									onClick={this.handlePrev}
									style={{marginRight: 12}}
								/>
								<RaisedButton
									label={stepIndex === 3 ? 'Download Config' : stepIndex === 4  ? 'Complete Signup!' : 'Next'}
									primary={true}
									onClick={this.handleNext}

								/>
							</div>

						</div>
					)}
				</div>
			</div>
			</Paper> : <h5> Welcome </h5>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'auth'}]), connect(mapStateToProps))(CharCreate)


