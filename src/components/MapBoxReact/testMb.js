import React, {Component, PureComponent} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {connect} from 'react-redux'
import {
    firebaseConnect,
    isLoaded,
    isEmpty,
    dataToJS,
    pathToJS,
} from 'react-redux-firebase'
const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const pinStyle = {
    cursor: 'pointer',
    fill: '#d00',
    stroke: 'none',
    fillOpacity: '0.1'
}

const friendPinStyle = {
    cursor: 'pointer',
    fill: '#0000FF',
    stroke: 'none',
    fillOpacity: '0.1'
}

class CityPin extends PureComponent {

    render() {
        const {size = 5} = this.props

        return (
            <svg height={size} viewBox='0 0 24 24'
                 style={{...pinStyle, transform: `translate(${-size/2}px,${-size}px)`, fillOpacity: '0.1'}}
            >

                <path d={ICON}/>
            </svg>
        )
    }
}
class FriendPin extends PureComponent {

    render() {
        const {size = 5} = this.props

        return (
            <svg height={size} viewBox='0 0 24 24'
                 style={{...friendPinStyle, transform: `translate(${-size/2}px,${-size}px)`, fillOpacity: '0.1'}}
            >

                <path d={ICON}/>
            </svg>
        )
    }
}


class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewport: {
                latitude: 40.705011,
                longitude: -74.0088847,
                zoom: 9.5,
                bearing: 180,
                pitch: 45,
                width: 500,
                height: 500,
            },
            popupInfo: null
        }
    }



    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => {
        this.setState({
            viewport: {
                ...this.state.viewport,
                width: this.props.width || window.innerWidth,
                height: this.props.height || window.innerHeight
            }
        });
    };

    _updateViewport = (viewport) => {
        this.setState({viewport});
    }
    _renderCityMarker = (city, index) => {
        return (
            <Marker key={`marker-${index}`}
                    longitude={city.lon}
                    latitude={city.lat}>
                <CityPin size={20} />
            </Marker>
        );
    }
    _renderFriendMarker = (city, index) => {
        return (
            <Marker key={`marker2-${index}`}
                    longitude={city.lon}
                    latitude={city.lat}>
                <FriendPin size={20} />
            </Marker>
        );
    }

    render() {
        console.log(this.props, this.state)
        return (
            <div>

            </div>

        )
    }
}


const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'} , {path: 'step'
}
])(Test)

export default connect(({firebase}) => ({
    profile: pathToJS(firebase, 'profile'),
    players: dataToJS(firebase, 'players'),
    step: dataToJS(firebase, '/step'),
    auth: pathToJS(firebase, 'auth'),
}))(fbWrapped)


// queryParams: ['limitToFirst=5']

