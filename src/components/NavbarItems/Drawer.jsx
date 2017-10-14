import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import BadgeIcon from './Badge'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import {filterPlayers} from '../HelperFunc'
import {
    firebaseConnect,
    isLoaded,
    isEmpty,
    dataToJS,
    pathToJS,
} from 'react-redux-firebase'
import {connect} from 'react-redux'
// import {filterPlayers} from '../HelperFunc'
import './style.css'

class theDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.getAuth = this.getAuth.bind(this)
    }

    handleToggle = () => this.setState({open: !this.state.open});

    getAuth = () => {
        return isLoaded(this.props.auth) ? this.setState({uid: this.props.auth.uid}) : console.log('loading')
    }

    render() {
        const style = {
            marginRight: 20,
        }
        // const {players, profile} = this.props
        // const allTargets = filterPlayers(players).filter(player => player.uid !== profile.uid)
        return (
            <div>
                {this.getAuth}
                <RaisedButton
                    label="Menu"
                    backgroundColor={'white'}
                    onClick={this.handleToggle}
                    labelColor={'red'}
                />
                <Drawer width={300} openSecondary={true} open={this.state.open}>

                    <Divider/>
                    <h4 className='name'> Welcome, {this.props.profile.name} </h4>
                    <img className='imgProf' src={isLoaded(this.props.profile) ? `${this.props.profile.image}`: '' }/>
                    <Divider/>

                    <h4> Account Balance : </h4> <h4 className='cash'>{this.props.profile.score}</h4>
                    <BadgeIcon/>
                    <Divider/>

                    <FloatingActionButton secondary={true} style={style}>
                        <ContentAdd />
                    </FloatingActionButton>

                    <Divider/>
                    <h4> Targets </h4>
                    {
                        isLoaded(this.props.players) ? filterPlayers(this.props.players).filter(player => player.uid !== this.props.profile.uid).map(target => <p>{target.name}</p>) : null
                    }
                    <Divider/>
                    <h4> Settings </h4>
                </Drawer>
            </div>
        );
    }
}

const fbWrapped = firebaseConnect((props) => [{path: 'players'}, {path: 'profile'}, {path: 'auth'}, {path: 'step'}, {path: `profile/score`}
])(theDrawer)

export default connect((state) => ({
    profile: pathToJS(state.firebase, 'profile'),
    players: dataToJS(state.firebase, 'players'),
    // step: dataToJS(firebase, '/step'),
    auth: pathToJS(state.firebase, 'auth'),
    score: dataToJS(state.firebase, `profile/score`), // pass profile data as this.props.profile
    target: state.player.target
}))(fbWrapped)




