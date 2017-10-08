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
		const {player, target} = this.props
		const notificationSystem = this.refs.notificationSystem
		// console.log('player-->', player, 'target-->', target)
		const myLocation = parseLocation(player.Locations)
		const targetLocation = parseLocation(target.Locations)
		const distance = Geofire.distance(myLocation, targetLocation)
		console.log('distance-->', distance)
		if (distance < 0.1) {
			this._addNotification(notificationSystem)
		}
	}

	_addNotification(_notificationSystem) {
		const {player} = this.props
		_notificationSystem.addNotification({
			message: 'Target nearby, kill him before too late!',
			level: 'success',
			autoDismiss: 0,
			action: {
				label: 'Finish!',
				callback: function() {
					this.props.battle(player.id)
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
