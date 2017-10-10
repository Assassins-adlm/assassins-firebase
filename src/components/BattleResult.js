import React from 'react'
const NotificationSystem = require('react-notification-system')

class BattleResult extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const {status} = this.props
		const notificationSystem = this.refs.battleResultNotification
		this._addNotification(notificationSystem, status)
	}

	_addNotification(_notificationSystem, option) {
		// const {player, target} = this.props
		if (option === 'kill') {
			_notificationSystem.addNotification({
				message: 'You Got it, keep on targeting!',
				level: 'success',
				autoDismiss: 0
			})
		}
		if (option === 'dead') {
			_notificationSystem.addNotification({
				message: 'You lose, wait for resurrecting!',
				level: 'danger',
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