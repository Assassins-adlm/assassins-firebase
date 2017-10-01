import React from 'react'
import {connect} from 'react-redux'
import firebase from '../fire'

class Setting extends React.Component {

	render() {
		return (
			<form>

			</form>
		)
	}
}

const mapState = (state) => {
	return {
		currentPlayer: state.player
	}
}

export default connect(mapState)(Setting)
