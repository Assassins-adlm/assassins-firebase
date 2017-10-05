import React from 'react'

const MyInfo = (props) => {
	// console.log('my info-->', props)
	let {currPlayer} = props
	return (
		<div>
			<h1>I am: {currPlayer.name}</h1>
		</div>
	)
}

export default MyInfo
