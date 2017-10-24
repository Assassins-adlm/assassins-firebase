import React from 'react'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import {spy} from 'sinon'

import MapBox from '../src/components/MapBox/MapBox'
import EngagePrompt from '../src/components/MapBox/EngagePrompt'
import GuessPrompt from '../src/components/MapBox/GuessPrompt'
import BattleResult from '../src/components/MapBox/BattleResult'
import TargetingWarning from '../src/components/MapBox/TargetingWarning'
import LockTarget from '../src/components/MapBox/LockTarget'
import Revive from '../src/components/MapBox/revive'

describe('React Components', () => {

	describe('<MapBox /> component', () => {
		let mapbox

		beforeEach('Create component', () => {
			mapbox = shallow(< MapBox />)
		})

		it('uses <EngagePrompt />, <GuessPrompt />, <BattleResult />, <TargetingWarning />, <LockTarget />, and <Revive /> components', () => {
			expect(mapbox.find(EngagePrompt).length).to.be.equal(1)
			expect(mapbox.find(GuessPrompt).length).to.be.equal(1)
			expect(mapbox.find(BattleResult).length).to.be.equal(1)
			expect(mapbox.find(TargetingWarning).length).to.be.equal(1)
			expect(mapbox.find(LockTarget).length).to.be.equal(1)
			expect(mapbox.find(Revive).length).to.be.equal(1)
		})
	})

})
