import React, {Component, PropTypes} from 'react'

import TestUtils from 'react-addons-test-utils'

import expect from 'expect'
import mockery from 'mockery'
import rndoam from 'rndoam/lib/withImmutable'


class RowItem extends Component {
    render() {
        return <div />
    }
}


describe(`react-ingrid`, () => {

    describe(`Grid`, () => {
        let Grid, GridWithContext

        before(() => {
            mockery.enable({
                warnOnUnregistered: false
            })

            mockery.registerMock(`./Row`, RowItem);
            ({default: Grid} = require(`../src/Grid`))

        })

        after(() => {
            mockery.disable()
            mockery.deregisterAll()
        })

        it(`should set height for scroll helper tag`, () => {
            const props = {
                offset: 100
            }

            const grid = TestUtils
                .renderIntoDocument(
                    <Grid {...props} />
                )

            const divs = TestUtils.scryRenderedDOMComponentsWithTag(grid, `div`)

            expect(divs[1].style.height).toEqual(`${props.offset}px`)
        })


        it(`should set height of the content area`, () => {
            const props = {
                height: 100
            }

            const grid = TestUtils
                .renderIntoDocument(
                    <Grid {...props} />
                )

            const divs = TestUtils.scryRenderedDOMComponentsWithTag(grid, `div`)

            expect(divs[0].style.height).toEqual(`${props.height}px`)
        })
    })
})