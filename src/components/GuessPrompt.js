import React from 'react'

class GuessPrompt extends React.Component {

	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		// const {player} = this.props
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
          Guess Who is trying to finish you:
						<input type="text" name="name" />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		)
	}
}

export default GuessPrompt
