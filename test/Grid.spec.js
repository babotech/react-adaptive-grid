import React, {Component} from 'react'

import TestUtils from 'react-addons-test-utils'

import expect from 'expect'
import mockery from 'mockery'

class RowItem extends Component {
    render() {
        return <div />
    }
}


describe(`react-adaptive-grid`, () => {

    describe(`Grid`, () => {
        let Grid

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

        it(`should set left padding of the content area`, () => {
            const props = {
                padding: 100
            }

            const grid = TestUtils
                .renderIntoDocument(
                    <Grid {...props} />
                )

            const divs = TestUtils.scryRenderedDOMComponentsWithTag(grid, `div`)

            const {paddingLeft, paddingRight} = divs[0].style

            expect(paddingLeft).toEqual(`${props.padding}px`)
            expect(paddingRight).toEqual(`${props.padding}px`)
        })
    })
})