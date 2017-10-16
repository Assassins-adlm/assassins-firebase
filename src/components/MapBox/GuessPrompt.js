import React from 'react'
import {connect} from 'react-redux'
import Geofire from 'geofire'
import {filterPlayer} from './HelperFunc'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'

class GuessPrompt extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			timer: null,
			counter: 60
		}
		this.tick = this.tick.bind(this)
		this.reveal = this.reveal.bind(this)
		this.timeOut = this.timeOut.bind(this)
	}

	componentDidMount() {
		let timer = setInterval(this.tick, 1000)
		this.setState({timer})
	}

	componentWillUnmount () {
		clearInterval(this.state.timer)
	}

	tick() {
		// const {currPlayer} = this.props
		if (this.refs.guessTimer) {
			this.setState({
				counter: this.state.counter - 1
			})
		}
		const assassin = isLoaded(this.props.profile) ? this.props.profile.assassins[1] : null
		const assassinLocation = [assassin.lat, assassin.lon]
		const currPlayer = isLoaded(this.props.profile) ? Object.values(this.props.profile.Locations).sort((a, b) => b.tst-a.tst)[0] : null
		const currPlayerLocation = [currPlayer.lat, currPlayer.lon]
		const distance = Geofire.distance(currPlayerLocation, assassinLocation)
		console.log('distance==>', distance)
		// isLoaded(this.props.profile) && console.log('curr player==>', this.props.profile)
		// console.log('counter-->', this.state.counter)
		if (distance < 0.01) {
			isLoaded(this.props.firebase) && isLoaded(this.props.profile) &&
			this.reveal(this.props.firebase, this.props.profile)
		}
		if (this.state.counter === 0) {
			isLoaded(this.props.firebase) && isLoaded(this.props.profile) &&
			this.timeOut(this.props.firebase, this.props.profile)
		}
	}

	reveal(firebase, currPlayer) {
		// console.log('curr player', currPlayer)
		firebase.set(`players/${currPlayer.uid}/status`, 'reveal')
			.then(() => {
				firebase.set(`players/${currPlayer.assassins[0]}/status`, 'fail')
			})
			.then(() => {
				firebase.set(`players/${currPlayer.uid}/assassins`, null)
			})
			.then(() => {
				firebase.set(`players/${currPlayer.assassins[0]}/targets`, null)
			})
	}

	timeOut(firebase, currPlayer) {
		// console.log('curr player', currPlayer)
		firebase.set(`players/${currPlayer.uid}/status`, 'dead')
			.then(() => {
				firebase.set(`players/${currPlayer.assassins[0]}/status`, 'kill')
			})
			.then(() => {
				firebase.set(`players/${currPlayer.uid}/assassins`, null)
			})
			.then(() => {
				firebase.set(`players/${currPlayer.assassins[0]}/targets`, null)
			})
	}

	render() {
		return (
			<div>
          An Assassin is hiding somewhere and trying to assassinate you! Reveal the assassin! You have 60 seconds:
				<h1 ref="guessTimer">{this.state.counter}</h1>
			</div>
		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}
])(GuessPrompt)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
}))(fbWrapped)
