import React, {Component} from 'react'

import AdaptiveGrid from '../../lib'
import ReactDOM from 'react-dom'
import {fromJS} from 'immutable'
import rndoam from 'rndoam'

let i = 0
const colors = [ `039BE5`, `FF5722`, `673AB7`, `FFF176`, `FF3D00` ]
const chunkSize = 100
const max = 500
const generateItems = () =>
    fromJS(rndoam.collection({
        id: () => i++,
        color: () => colors[ rndoam.number(0, 4) ],
        width: () => rndoam.number(100, 400),
        height: () => rndoam.number(100, 400)
    }, chunkSize))

const items = generateItems()

const ItemComponent = ({data, width, height}) => {

    const backDropStyle = {
        display: `flex`,
        width,
        height,
        backgroundColor: `#${data.get(`color`)}`
    }
    const originalSquare = {
        display: `flex`,
        width: data.get(`width`),
        height: data.get(`height`),
        maxWidth: `100%`,
        maxHeight: `100%`,
        backgroundColor: `#FFFFFF`,
        margin: `auto`,
        opacity: .2,
        fontFamily: `Arial`,
        fontSize: `1em`,
        color: `#000000`,
        alignItems: `center`,
        justifyContent: `center`
    }

    return (
        <div style={backDropStyle}>
            <div style={originalSquare}>
                {`${data.get(`width`)}x${data.get(`height`)}`}
            </div>
        </div>
    )
}

const defaultProps = {
    ItemComponent,
    minWidth: 200,
    padding: 100
}

class Container extends Component {

    constructor() {
        super()
        this.state = {
            loading: false,
            more: true,
            items
        }
    }

    render() {
        const load = () => {
            this.setState({
                loading: true
            })

            setTimeout(() => {
                const moreItems = this
                    .state
                    .items
                    .concat(generateItems())
                this.setState({
                    loading: false,
                    items: moreItems,
                    more: moreItems.length < max
                })
            }, 1000)
        }
        const props = {
            ...defaultProps,
            ...this.state,
            load
        }


        return <AdaptiveGrid {...props} />
    }
}

const wrapperStyle = {
    height: `100vh`,
    width: `100vw`
}

document.addEventListener(`DOMContentLoaded`, () => {
    ReactDOM.render(
        <div style={wrapperStyle}>
            <Container />
        </div>,
        document.getElementById(`app`)
    )
})