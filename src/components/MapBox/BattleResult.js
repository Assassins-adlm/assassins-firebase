import React from 'react'
import {connect} from 'react-redux'
// import {filterPlayer} from './HelperFunc'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'
const NotificationSystem = require('react-notification-system')

class BattleResult extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const notificationSystem = this.refs.battleResultNotification
		const {currPlayer} = this.props
		this._addNotification(notificationSystem, currPlayer.status)
		// dispatch setstatus to alive
		// if (status === 'kill') {
		// 	setStatus(player, 'player', 'alive')
		// }
	}

	_addNotification(_notificationSystem, status) {
		// const {player, target} = this.props
		if (status === 'kill') {
			_notificationSystem.addNotification({
				message: 'Woohoo! Successfully eliminate your target!',
				level: 'success',
				autoDismiss: 0
			})
		} else if (status === 'dead') {
			_notificationSystem.addNotification({
				message: 'Oops! You did not reveal the assassin on time, wait for respawning!',
				level: 'error',
				autoDismiss: 0
			})
		} else if (status === 'reveal') {
			_notificationSystem.addNotification({
				message: 'Good job! You successfully reveal the assassin!',
				level: 'success',
				autoDismiss: 0
			})
		} else if (status === 'fail') {
			_notificationSystem.addNotification({
				message: 'Failed the mission! Wait for respawning!',
				level: 'error',
				autoDismiss: 0
			})
		}
	}

	render() {
		const style = {
			NotificationItem: {
				DefaultStyle: {
					margin: '10px 5px 2px 1px',
					fontSize: '30px',
					top: '50px'
				}
			}
		}
		return (
			<div>
				<NotificationSystem ref="battleResultNotification" style={style}/>
			</div>
		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}
])(BattleResult)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
}))(fbWrapped)
