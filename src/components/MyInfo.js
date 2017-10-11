import React from 'react'

const MyInfo = (props) => {
	// console.log('my info-->', props)
	let {name, kills} = props
	return (
		<div>
			<h1>I am: {name}</h1>
			<p>score: {kills || 0}</p>
		</div>
	)
}

export default MyInfo
