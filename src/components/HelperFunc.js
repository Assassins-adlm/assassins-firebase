export const generateFakeLocation = (location) => {
	let latOffset = Math.random()*0.005, lonOffset = Math.random()*0.005
	let fakeLocation = []
	if (Math.random() > 0.5) {
		fakeLocation[0] = location[0] + latOffset
	} else {
		fakeLocation[0] = location[0] - latOffset
	}
	if (Math.random() > 0.5) {
		fakeLocation[1] = location[1] + lonOffset
	} else {
		fakeLocation[1] = location[1] - lonOffset
	}
	return fakeLocation
}

export const getLocation = (currPlayer, firebase) => {
	let options
	function success(pos) {
		let crd = pos.coords
		let myId = currPlayer.id
		let myRef = firebase.database().ref(`/players/${myId}`)
		myRef.update({location: [crd.latitude, crd.longitude]})
	}
	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message)
	}
	options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	}
	navigator.geolocation.watchPosition(success, error, options)
}

export const parseLocation = (location) => {
	return [location.lat, location.lon]
}

export const parseTargetLocation = (locations) => {
	console.log('target locations-->', locations)
	let Locations = Object.values(locations)
	let length = Locations.length
	return [Locations[length-1].lat, Locations[length-1].lon]
}
