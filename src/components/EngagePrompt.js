import React from 'react'
import {parseLocation} from './HelperFunc'
import Geofire from 'geofire'
const NotificationSystem = require('react-notification-system')

class EngagePrompt extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const {player, target, battle} = this.props
		const notificationSystem = this.refs.notificationSystem
		// console.log('player-->', player, 'target-->', target)
		const myLocation = parseLocation(player.Locations)
		const targetLocation = parseLocation(target.Locations)
		const distance = Geofire.distance(myLocation, targetLocation)
		console.log('distance-->', distance)
		if (distance < 0.1) {
			this._addNotification(notificationSystem, battle)
		}
	}

	_addNotification(_notificationSystem, battle) {
		const {player, target} = this.props
		_notificationSystem.addNotification({
			message: 'Target nearby, finish him before too late!',
			level: 'info',
			autoDismiss: 0,
			action: {
				label: 'Finish!',
				callback: function() {
					battle(player, target)
				}
			}
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
