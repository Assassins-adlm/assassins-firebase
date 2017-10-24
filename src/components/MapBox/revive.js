import React from 'react'
import {connect} from 'react-redux'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'

class Revive extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			timer: null,
			counter: 60
		}
		this.tick = this.tick.bind(this)
	}

	componentDidMount() {
		let timer = setInterval(this.tick, 1000)
		this.setState({timer})
	}

	componentWillUnmount () {
		clearInterval(this.state.timer)
	}

	tick() {
		if (this.refs.reviveTimer) {
			this.setState({
				counter: this.state.counter - 1
			})
		}
		if (this.state.counter === 0) {
			isLoaded(this.props.firebase) && isLoaded(this.props.profile) && this.props.firebase.set(`players/${this.props.profile.uid}/status`, 'alive')
		}
	}

	render() {
		return (
			<div ref="reviveTimer"><h1>Wait 60 seconds to respawn: {this.state.counter}</h1></div>
		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}
])(Revive)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
}))(fbWrapped)
