import React from 'react'

class GuessPrompt extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			timer: null,
			counter: 60
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.tick = this.tick.bind(this)
	}

	componentDidMount() {
		// const {player} = this.props
		let timer = setInterval(this.tick, 1000)
		this.setState({timer})
	}

	componentWillUnmount () {
		clearInterval(this.state.timer)
	}

	tick() {
		const {player, setStatus} = this.props
		if (this.refs.guessTimer) {
			this.setState({
				counter: this.state.counter - 1
			})
		}
		// console.log('counter-->', this.state.counter)
		if (this.state.counter === 0) {
			// set player to dead
			setStatus(player, 'player', 'dead')
		}
	}

	handleSubmit(evt) {
		evt.preventDefault()
		const {setStatus, player, assassin} = this.props
		const name = evt.target.name.value
		if (assassin.name === name) {
			setStatus(assassin, 'assassin', 'dead')
			setStatus(player, 'player', 'kill')
		} else {
			setStatus(assassin, 'assassin', 'kill')
			setStatus(player, 'player', 'dead')
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
          Guess Who is trying to finish you, you have 60 seconds:
						<div ref="guessTimer">{this.state.counter}</div>
						<input type="text" name="name" />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		)
	}
}

export default GuessPrompt
