import React from 'react'
var Shake = require('shake.js')

export default class FightScene extends React.Component {
	constructor(){
		super()
		this.state = {

		}
	}

	render(){
		console.log('fight scene')
		return(
			<div>
				<div className = "space">
					<h1> FIGHT SCENE </h1>
					<h3> Tap to Win </h3>
				</div>
			</div>

		)
	}

}
