import React from 'react'
const NotificationSystem = require('react-notification-system')

class LockTarget extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const notificationSystem = this.refs.confirmNotification
		this._addNotification(notificationSystem)
	}

	_addNotification(_notificationSystem) {
		_notificationSystem.addNotification({
			message: 'You target is trying to find you! Keep yourself stealth!',
			level: 'info',
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
				<NotificationSystem ref="confirmNotification" style={style}/>
			</div>
		)
	}
}

export default LockTarget
