import React from 'react'

//material ui
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import Cash from 'material-ui/svg-icons/places/casino'
import Other from 'material-ui/svg-icons/action/shop'
import Acc from 'material-ui/svg-icons/action/account-balance-wallet'
import Acc1 from 'material-ui/svg-icons/action/account-balance'
import Acc2 from 'material-ui/svg-icons/action/account-box'
import Acc3 from 'material-ui/svg-icons/action/account-circle'
import Acc4 from 'material-ui/svg-icons/action/payment'

// redux firebase
import {connect} from 'react-redux'
import {currentTargets} from '../../store/index'
import {
    firebaseConnect,
    isLoaded,
    isEmpty,
    dataToJS,
    pathToJS,
} from 'react-redux-firebase'


// dumb component
const BadgeExampleSimple = (props) => {
  return  (  <div>
      <Badge
          badgeContent={props.profile.score}
          primary={true}
          style={{color:'white', fontSize: 'small'}}
          badgeStyle={{color:'white', fontSize: '12'}}
      >
          <Acc4 />
      </Badge>

  </div>)
}



const
    abWrap = firebaseConnect([{path: 'players'}, {path: 'profile'}, {path: 'step'}
    ])(BadgeExampleSimple)

export default connect(
    ({
         firebase,
     }) =>
        ({
            players: dataToJS(firebase, 'players'),
            profile: pathToJS(firebase, 'profile'), // pass profile data as this.props.profile
            step: dataToJS(firebase, '/step'),
            auth: pathToJS(firebase, 'auth') // pass auth data as this.props.auth
        }),
)
(abWrap)

