import React from 'react'
const NotificationSystem = require('react-notification-system')

class BattleResult extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const {status, setStatus, player} = this.props
		const notificationSystem = this.refs.battleResultNotification
		this._addNotification(notificationSystem, status)
		// dispatch setstatus to alive
		// if (status === 'kill') {
		// 	setStatus(player, 'player', 'alive')
		// }
	}

	_addNotification(_notificationSystem, option) {
		// const {player, target} = this.props
		if (option === 'kill') {
			_notificationSystem.addNotification({
				message: 'You won!',
				level: 'success',
				autoDismiss: 0
			})
		}
		if (option === 'dead') {
			_notificationSystem.addNotification({
				message: 'You lose, wait for resurrecting!',
				level: 'error',
				autoDismiss: 0
			})
		}
	}

	render() {
		return (
			<div>
				<NotificationSystem ref="battleResultNotification" />
			</div>
		)
	}
}

export default BattleResult
