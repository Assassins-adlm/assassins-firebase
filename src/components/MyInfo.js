import React from 'react'

const MyInfo = (props) => {
	// console.log('my info-->', props)
	let {name} = props
	return (
		<div>
			<h1>I am: {name}</h1>
		</div>
	)
}

export default MyInfo
