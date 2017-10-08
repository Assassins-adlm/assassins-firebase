import React from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {currentPlayer, currentLocation, currentTargets} from '../store'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import {orange500, blue500, cyan500, deepPurple500} from 'material-ui/styles/colors';
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS
} from 'react-redux-firebase'
import PropTypes from 'prop-types'

import fileDownload from 'react-file-download' //get new dl library non depc

import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


class CharCreate extends React.Component {
	static propTypes = {
		firebase: PropTypes.shape({
			push: PropTypes.func.isRequired,
			set:  PropTypes.func.isRequired,
		})
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
		};


		this.handleChange = this.handleChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handlePrev = this.handlePrev.bind(this)
		this.getStepContent = this.getStepContent.bind(this)
	}

	handleChange(evt) {
		evt.preventDefault()
		evt.target.name === 'charName' ? this.setState({charName: evt.target.value}) :
			evt.target.name === 'charAvatarUrl' ? this.setState({charAvatarUrl: evt.target.value}) :
				this.setState({os: evt.target.value})
		console.log(this.state)
	}

	handleNext = () => {
		const {stepIndex} = this.state;
		console.log(this.props.auth.uid,"!!!!!!!!")
		const {set} = this.props.firebase
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex >= 3,
		});
		isLoaded(this.props.auth.uid) ? this.setState({uid: this.props.auth.uid}) : console.log('loading,..')
		stepIndex === 3 ? set(`/players/${this.state.uid}`, {name: this.state.charName , id: this.state.uid, image: this.state.charAvatarUrl, location: [40.703, -74.009], target: "", token: ""}) : console.log('unable to send')
	};

	handlePrev = () => {
		const {stepIndex} = this.state;
		if (stepIndex > 0) {
			this.setState({stepIndex: stepIndex - 1});
		}
	};

	getStepContent(stepIndex) {

		switch (stepIndex) {
			case 0:
				return (
					<TextField
						floatingLabelText="Enter Player Name"
						onChange={this.handleChange.bind(this)}
						fullWidth={true}
						name='charName'
						key={8}
					/>
				)
			case 1:
				return (
					<TextField key={9}
						floatingLabelText="Enter URL of Avatar"
						onChange={this.handleChange.bind(this)}
						fullWidth={true}
						name='charAvatarUrl'
					/>
				)
			case 2:
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
			case 3:

				return (
					<div>{this.state.os === 'android' ?  fileDownload(`{"_type":"configuration","waypoints":[],"autostartOnBoot":true,"beaconBackgroundScanPeriod":30,"beaconForegroundScanPeriod":0,"beaconLayout":"m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24","beaconMode":0,"cleanSession":false,"httpSchedulerConsiderStrategyDirect":true,"ignoreInaccurateLocations":0,"ignoreStaleLocations":0,"locatorAccuracyBackground":1,"locatorAccuracyForeground":0,"locatorDisplacement":1,"locatorInterval":10,"mode":3,"notification":true,"ranging":false,"url":"https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json"}`, `config.otrc`) : fileDownload(`{ "ranging" : false, "positions" : 50, "sub" : true, "locked" : false, "url" : "https://assassins-aldm.firebaseio.com/players/${this.state.uid}/Locations.json", "deviceId" : "", "monitoring" : 2, "cmd" : false, "tid" : "as", "allowRemoteLocation" : true, "_type" : "configuration", "ignoreStaleLocations" : 0, "updateAddressBook" : true, "allowinvalidcerts" : false, "locatorInterval" : 120, "extendedData" : true, "ignoreInaccurateLocations" : 0, "locatorDisplacement" : 1, "mode" : 3, "cp" : true }`, 'config.otrc') } </div>
				)


			default:
				return 'Download App and Config file';
		}
	}

	render() {
		const {set} = this.props.firebase
		const {finished, stepIndex} = this.state;
		const contentStyle = {margin: '0 16px'};
		const styles = {
			errorStyle: {
				color: orange500,
			},
			underlineStyle: {
				borderColor: deepPurple500,
			},
			floatingLabelStyle: {
				color: orange500,
			},
			floatingLabelFocusStyle: {
				color: blue500,
			},
		};
		return (
			<div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
				<Stepper activeStep={stepIndex}>
					<Step>
						<StepLabel>Signup</StepLabel>

					</Step>
					<Step>
						<StepLabel>Select Player</StepLabel>
					</Step>
					<Step>
						<StepLabel> Select OS </StepLabel>
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
									event.preventDefault();
									this.setState({stepIndex: 0, finished: false});
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
									label={stepIndex === 2 ? 'Download Config' : 'Next'}
									primary={true}
									onClick={this.handleNext}

								/>
							</div>

						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'auth'}]), connect(mapStateToProps))(CharCreate)
