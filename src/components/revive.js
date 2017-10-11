import React from 'react'

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
		const {player, revivePlayer} = this.props
		if (this.refs.reviveTimer) {
			this.setState({
				counter: this.state.counter - 1
			})
		}
		// console.log('counter-->', this.state.counter)
		if (this.state.counter === 0) {
			revivePlayer(player)
		}
	}

	render() {
		return (
			<div ref="reviveTimer">Wait 60 seconds to respawn: {this.state.counter}</div>
		)
	}
}

export default Revive
