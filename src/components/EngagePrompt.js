import React from 'react'
import {parseLocation} from './HelperFunc'
import Geofire from 'geofire'
const NotificationSystem = require('react-notification-system')

class EngagePrompt extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentWillReceiveProps() {
		const {player, target} = this.props
		const notificationSystem = this.refs.notificationSystem
		// console.log('player-->', player, 'target-->', target)
		const myLocation = parseLocation(player.Locations)
		const targetLocation = parseLocation(target.Locations)
		const distance = Geofire.distance(myLocation, targetLocation)
		console.log('distance-->', distance)
		if (distance < 2) {
			this._addNotification(notificationSystem)
		}
	}

	_addNotification(_notificationSystem) {
		_notificationSystem.addNotification({
			message: 'Target nearby, kill him before too late!',
			level: 'success'
		})
	}

	render() {
		return (
			<div>
				<NotificationSystem ref="notificationSystem" />
			</div>
		)
	}
}

export default EngagePrompt
