import React, {Component} from 'react'
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {connect} from 'react-redux'
import {
    firebaseConnect,
    isLoaded,
    isEmpty,
    dataToJS,
    pathToJS,
} from 'react-redux-firebase'

const colors = [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Black',
    'White',
];

/**
 * `AutoComplete` search text can be implemented as a controlled value,
 * where `searchText` is handled by state in the parent component.
 * This value is reset with the `onNewRequest` callback.
 */
class TargetPicker extends Component {
    state = {
        searchText: '',
    };

    handleUpdateInput = (searchText) => {
        this.setState({
            searchText: searchText,
        });

    };

    handleNewRequest = () => {
        this.setState({
            searchText: this.state.searchText,
        });

    };
    handleClick = () => {
        let values = isLoaded(this.props.players) ? Object.values(this.props.players).map((v, idx) => [v.name, v.uid]) : null
        isLoaded(this.props.firebase) && values && isLoaded(this.props.players) ? this.props.firebase.set(`players/${this.props.profile.uid}/targets`, values.filter(v => v[0] === this.state.searchText)).then(() => {
          this.props.firebase.set(`players/${this.props.profile.targets[0][1]}/beingTargeted`, true)
        }) : null
    }

    render() {
        const style = {
            marginRight: 20,
            marginLeft: 20,
            backgroundColor: 'blue',
        };
        return (
            <div>
                <AutoComplete
                    hintText="Select Target start typing"
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.handleNewRequest}
                    dataSource={isLoaded(this.props.players) ? Object.values(this.props.players).filter(v => v.uid !== this.props.profile.uid).map((v, i) => v.name) : null}
                    filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                    openOnFocus={true}
                    style={{marginLeft :'10%'}}
                />
                <FloatingActionButton mini={true} secondary={true} style={style} onClick={this.handleClick.bind(this)}

                >
                    <ContentAdd

                    />
                </FloatingActionButton>
            </div>
        );
    }
}


const fbWrapped = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'auth'}, {path: 'step'}
])(TargetPicker)

export default connect(({firebase}) => ({
    profile: pathToJS(firebase, 'profile'),
    players: dataToJS(firebase, 'players'),
    step: dataToJS(firebase, '/step'),
    auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
}))(fbWrapped)
