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

import fileDownload from 'react-file-download'


import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


class CharCreate extends React.Component {

	state = {
		finished: false,
		stepIndex: 0,
		charName: '',
		charAvatarUrl: '',
		os: '',
	};

	handleChange(evt) {
		console.log(evt.target.value)
		evt.target.name === 'charName' ? this.setState({charName: evt.target.value}) :
			evt.target.name === 'charAvatarUrl' ? this.setState({charAvatarUrl: evt.target.value}) :
				this.setState({os: evt.target.value})
		console.log(this.state)
		console.log(evt.os)
	}

	handleNext = () => {
		const {stepIndex} = this.state;
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex >= 3,
		});
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
						key={1}
					/>
				)
			case 1:
				return (
					<TextField key={2}
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
						/>
						<RadioButton
							value="android"
							label="Android"
							name="Android"
						/>
					</RadioButtonGroup>
				)
			case 3:
				return (
					<div>
					<div>hold {fileDownload('', 'filename.otrc')}it</div>
					</div>
				)


			default:
				return 'Download App and Config file';
		}
	}

	render() {

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
									label={stepIndex === 2 ? 'Finish' : 'Next'}
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
	// console.log('state-->', state)
	return {
		auth: pathToJS(state.firebase, 'auth'),
		myProfile: dataToJS(state.firebase, 'players'),
	}
}

export default compose(firebaseConnect([{path: 'players'}, {path: 'auth'}]), connect(mapStateToProps))(CharCreate)
