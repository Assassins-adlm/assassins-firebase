import React from 'react'
import SideBar from './SideBar'
import MapBox from './MapBox'


export default class Home extends React.Component {

	constructor(props){
		super(props)
	}

	render() {

		console.log(this.props.props, 'PROPS')
		let user = this.props.props

		return (
			<div>
				<SideBar />

				<div>

				</div>
			</div>
		)
	}
}
