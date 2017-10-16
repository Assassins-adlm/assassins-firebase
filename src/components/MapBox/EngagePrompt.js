import React from 'react'
import {parseMostRecentLocation} from './HelperFunc'
import Geofire from 'geofire'
import {connect} from 'react-redux'
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	dataToJS,
	pathToJS,
} from 'react-redux-firebase'
const NotificationSystem = require('react-notification-system')

class EngagePrompt extends React.Component {

	constructor(props) {
		super(props)
		this._addNotification = this._addNotification.bind(this)
	}

	componentDidMount() {
		const {currPlayer, players} = this.props
		const notificationSystem = this.refs.notificationSystem
		// console.log('player==>', profile)
		const myLocation = [currPlayer.Locations.lat, currPlayer.Locations.lon]
		const targetLocation = parseMostRecentLocation(Object.values(players).filter(target => currPlayer.targets[0][1] === target.uid)[0].Locations)
		// console.log('my location=>', profile, 'target location==>', players)
		const distance = Geofire.distance(myLocation, targetLocation)
		console.log('target location==>', targetLocation)
		console.log('distance-->', distance)
		if (distance < 0.1) {
			isLoaded(this.props.firebase) &&
			this._addNotification(notificationSystem, this.props.firebase)
		}
	}

	_addNotification(_notificationSystem, firebase) {
		const {currPlayer} = this.props
		_notificationSystem.addNotification({
			message: 'Target nearby! Do you wanna assassinate your target right here?',
			level: 'info',
			autoDismiss: 0,
			action: {
				label: '殺!',
				callback: function() {
					firebase.set(`players/${currPlayer.targets[0][1]}/assassins`, [currPlayer.uid, currPlayer.Locations])
						.then(() => {
							firebase.set(`players/${currPlayer.targets[0][1]}/beingTargeted`, false)
						})
						.then(() => {
							firebase.set(`players/${currPlayer.uid}/status`, 'assassinate')
						})
				}
			}
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
				<NotificationSystem ref="notificationSystem" style={style}/>
			</div>
		)
	}
}

const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}
])(EngagePrompt)

export default connect(({firebase}) => ({
	profile: pathToJS(firebase, 'profile'),
	players: dataToJS(firebase, 'players'),
}))(fbWrapped)
