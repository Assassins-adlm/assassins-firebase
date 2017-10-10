import React from 'react'
//Redux
import {connect} from 'react-redux'
import {compose} from 'redux'
import {currentTargets} from '../../store/index'
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
import AppDownload from 'material-ui/svg-icons/action/get-app'
import './style.css'
import {
	Stepper,
	Step,
	StepLabel,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton';
import DeleteSweep from 'material-ui/svg-icons/navigation/cancel'
import CircularProgress from 'material-ui/CircularProgress';



//Config File Downloader
import fileDownload from 'react-file-download' //get new dl library non depc

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
			done: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handlePrev = this.handlePrev.bind(this)
		this.getStepContent = this.getStepContent.bind(this)
		this.close = this.close.bind(this)
	}

	handleChange(evt) {
		evt.preventDefault()
		evt.target.name === 'charName' ? this.setState({charName: evt.target.value.split(' ').join('').trim()}) : evt.target.name === 'charAvatarUrl' ? this.setState({charAvatarUrl: evt.target.value}) : evt.target.name === 'os' ? this.setState({os: evt.target.value}) : evt.target.name === 'email' ? this.setState({email: evt.target.value}) : this.setState({password: evt.target.value})

	}

	handleNext = () => {
		const {stepIndex} = this.state
		const {set} = this.props.firebase
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex === 4,
		})
	 this.state.stepIndex === 1 && isLoaded(this.props.firebase) ? this.props.firebase.createUser({
			email: this.state.email,
			password: this.state.password,
		}).then(() => {
			this.setState({uid: this.props.auth.uid})
			return set(`/players/${this.props.auth.uid}`, {
			name: this.state.charName,
			uid: isLoaded(this.props.auth.uid) ? this.props.auth.uid : '...',
			image: this.state.charAvatarUrl,
			score: `$${500}`,
				Locations: {lat: 40, lon: 74},
		})}).catch(alert) : console.log('wait')

		stepIndex === 2 ? this.setState({uid: this.props.auth.uid}) : console.log('...')
		stepIndex === 4 ? this.setState({done:true, finished: true}) : console.log('...')
	}
	handlePrev = () => {
		const {stepIndex} = this.state
		if (stepIndex > 0) {
			this.setState({stepIndex: stepIndex - 1})
		}
	}
	close = () => {
		this.props.firebase.set(`step`, 4)
		this.setState({done: true, finished: true})
	}


	getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<div key={23214}>
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
					<div key={2322251} className="signMarg">
						<TextField
							floatingLabelText="Enter Player Name"
							onChange={this.handleChange.bind(this)}
							fullWidth={true}
							name='charName'
							key={8}
						/>

						<TextField key={9}
						           floatingLabelText="Enter URL of Avatar"
						           onChange={this.handleChange.bind(this)}
						           fullWidth={true}
						           name='charAvatarUrl'
						/>
					</div>
				)
			case 2:
				return (<div key={23252341} >
						<RadioButtonGroup name="os" defaultSelected="ios"
						                  onChange={this.handleChange.bind(this)}>
							<RadioButton
								value="ios"
								label="Apple iOS"
							/>
							<RadioButton
								value="android"
								label="Android"
							/>
						</RadioButtonGroup>
						<Divider/>

						<RaisedButton
							key={9328}
							backgroundColor={this.state.os === 'android' ? 'lightgreen' : 'lightblue'}
							icon={<AppDownload color={this.state.os === 'android' ? 'white' : 'blue'}/>}
							label={this.state.os === 'android' ? 'Download OwnTracks from Google Play Free' : 'Download OwnTracks from App Store Free'}
							style={{margin: 30}}
							href={this.state.os === 'android' ? 'https://play.google.com/store/apps/details?id=org.owntracks.android' : 'https://itunes.apple.com/us/app/owntracks/id692424691?mt=8'}
						/>
						<Divider/>

					</div>
				)
			case 3:
			return	<div>{this.state.os === 'android' ? fileDownload(`{"_type":"configuration","waypoints":[],"autostartOnBoot":true,"beaconBackgroundScanPeriod":30,"beaconForegroundScanPeriod":0,"beaconLayout":"m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24","beaconMode":0,"cleanSession":false,"httpSchedulerConsiderStrategyDirect":true,"ignoreInaccurateLocations":0,"ignoreStaleLocations":0,"locatorAccuracyBackground":1,"locatorAccuracyForeground":0,"locatorDisplacement":1,"locatorInterval":10,"mode":3,"notification":true,"ranging":false,"url":"https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json"}`, `config.otrc`) : fileDownload(`{ "ranging" : false, "positions" : 50, "sub" : true, "locked" : false, "url" : "https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json", "deviceId" : "", "monitoring" : 2, "cmd" : false, "tid" : "as", "allowRemoteLocation" : true, "_type" : "configuration", "ignoreStaleLocations" : 0, "updateAddressBook" : true, "allowinvalidcerts" : false, "locatorInterval" : 120, "extendedData" : true, "ignoreInaccurateLocations" : 0, "locatorDisplacement" : 1, "mode" : 3, "cp" : true }`, 'config.otrc')}  </div>

			case 4:
				this.props.firebase.set(`step`, this.state.stepIndex)
				this.setState({done: true, finished: true})
				return <h1>finito</h1>
		}
	}

	render() {
		const {finished, stepIndex} = this.state
		const contentStyle = {margin: '0 16px'}
		const paperStyle = {
			display: 'inline-block',
			margin: '5px 5px 5px 5px',
			textAlign: 'center',
			marginRight: '5%',
			fontcolor: 'white',
			orientation: 'vertical',
		}
		return (
			 <Paper style={paperStyle} zDepth={5} >
				<div>
					<IconButton tooltip="Close" touch={true}  onClick={this.close.bind(this)} className='closeButton'>
						<DeleteSweep style='background-color: red' />
					</IconButton>
					<CircularProgress size={30} thickness={7} className='progCirc' color='lightblue'/>
					<Stepper activeStep={stepIndex}  orientation='vertical'>
						<Step>
							<StepLabel  style={{color: 'white'}}>Sign Up</StepLabel>
						</Step>
						<Step>
							<StepLabel  style={{color: 'white'}}>Select Name</StepLabel>
						</Step>
						<Step>
							<StepLabel  style={{color: 'white'}}> Config</StepLabel>
						</Step>
					</Stepper>
					<div style={paperStyle}>
						{finished ? (
							<p>
								<a
									href="#"
									onClick={(event) => {
										event.preventDefault()
										this.props.firebase.set('/step', {done: true})
										this.setState({stepIndex: 0, finished: true})
									}}
								>
								</a>
							</p>
						) : (
							<div >
								<p>{this.getStepContent(stepIndex)}</p>
								<div style={{marginTop: 12}}>
									<FlatButton
										label="Back"
										disabled={stepIndex === 0 }
										onClick={this.handlePrev}
										style={{marginRight: 12}}
									/>
									<RaisedButton
										label={stepIndex === 3 ? 'Download Config' : stepIndex === 3 ? 'Complete Signup!' : 'Next'}
										primary={true}
										onClick={this.handleNext}
									/>
								</div>

							</div>
						)}
					</div>

				</div>
			</Paper>
		)
	}
}

const
	abWrap = firebaseConnect([{path: 'players'}, {path: 'profile'},{path: 'step'}
	])(CharCreate)

export default connect(
	({
		 firebase,
	 }) =>
		({
			players: dataToJS(firebase, 'players'),
			profile: pathToJS(firebase, 'profile'), // pass profile data as this.props.profile
			step: dataToJS(firebase, '/step'),
			auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
		}),
)
(abWrap)

