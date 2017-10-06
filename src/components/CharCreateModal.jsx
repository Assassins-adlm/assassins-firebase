import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CharCreate from './CharCreate'

export default class DialogExampleModal extends React.Component {
	state = {
		open: true,
	};

	handleOpen = () => {
		this.setState({open: true});
	};

	handleClose = () => {
		this.setState({open: false});
	};

	render() {
		const actions = [
			<CharCreate/>,
			<FlatButton
				label="Submit"
				primary={true}
				onClick={this.handleClose}
			/>
		];

		return (
			<div>
				<RaisedButton label="Signup" onClick={this.handleOpen} />
				<Dialog
					title="Signup"
					actions={actions}
					modal={true}
					open={this.state.open}
				>

				</Dialog>
			</div>
		);
	}
}