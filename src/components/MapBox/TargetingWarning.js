import React from 'react'
const NotificationSystem = require('react-notification-system')

class TargetingWarning extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const notificationSystem = this.refs.warningNotification
		this._addNotification(notificationSystem)
	}

	_addNotification(_notificationSystem) {
		_notificationSystem.addNotification({
			message: 'You are being targeted, Watch out!',
			level: 'warning',
			autoDismiss: 0
		})
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
				<NotificationSystem ref="warningNotification" style={style} />
			</div>
		)
	}
}

export default TargetingWarning
