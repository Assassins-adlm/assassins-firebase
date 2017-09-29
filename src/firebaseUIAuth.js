import React, { Component } from 'react';
import '../node_modules/firebaseui/dist/firebaseui.css';

class FirebaseUIAuth extends Component {
	componentDidMount() {
		const { ui, ...uiConfig } = this.props;
		this.ui = ui;
		this.ui.start(this.container, uiConfig);
	}

	componentWillUnmount() {
		this.ui.reset();
	}

	render() {
		return (<div ref={(el) => {this.container = el;}}></div>)
	}
}

export default FirebaseUIAuth;