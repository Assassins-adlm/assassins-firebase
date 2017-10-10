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
		const {setStatus, player, assassin} = this.props
		const name = evt.target.name.value
		if (assassin.name === name) {
			setStatus(assassin, 'dead')
			setStatus(player, 'kill')
		} else {
			setStatus(assassin, 'kill')
			setStatus(player, 'dead')
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
          Guess Who is that:
						<input type="text" name="name" />
					</label>
					<input type="submit" value="Submit" />
				</form>
			</div>
		)
	}
}

export default GuessPrompt
