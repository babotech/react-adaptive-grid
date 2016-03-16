import React, {Component} from 'react'

import Grid from './Grid'
import debounce from './throttle'
import gridStateFactory from './gridStateFactory'


const resizeDelay = 500
const displayStyle = {
    height: `100%`,
    overflowX: `hidden`,
    overflowY: `scroll`,
    position: `relative`,
    width: `100%`
}

const getDisplaySize = (inst) => {
    const {top: displayTop, width, height} = inst.getDisplayBoundingClientRect()
    const {top: contentTop} = inst.getContentBoundingClientRect()
    const scrollTop = displayTop - contentTop

    return {
        scrollTop,
        width,
        height
    }
}

const createScrollListener = inst =>
    () => {
        const {scrollTop} = getDisplaySize(inst)
        inst.gridState.updateOffset(scrollTop)

        inst.setState(inst.gridState.getState())
    }

const createWindowResizeListener = inst => {
    inst.windowResizeListener = debounce(() => {
        const {scrollTop, width, height} = getDisplaySize(inst)
        const {items, more} = inst.props
        inst.gridState.updateGrid(items, width, height, scrollTop, more)
        inst.setState(inst.gridState.getState())
    }, resizeDelay)

    return inst.windowResizeListener
}


class Display extends Component {

    constructor(props) {
        super()
        const {additionalHeight, buffer, minWidth, offsetLeft, padding, more} = props
        this.gridState = gridStateFactory({additionalHeight, buffer, minWidth, offsetLeft, padding, more})

        this.state = this.gridState.getState()
    }

    componentDidMount() {
        const {items, more} = this.props
        const {scrollTop, width, height} = getDisplaySize(this)
        this.gridState.updateGrid(items, width, height, scrollTop, more)

        this.setState(this.gridState.getState())
        this.display.addEventListener(`scroll`, createScrollListener(this))
        window.addEventListener(`resize`, createWindowResizeListener(this))
    }

    componentWillUnmount() {
        window.removeEventListener(`resize`, this.windowResizeListener)
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.items.size !== this.props.items.size) {

            const sizeDiff = nextProps.items.size - this.props.items.size

            this.gridState.insertItems(nextProps.items.takeLast(sizeDiff), nextProps.more)
            this.setState(
                this.gridState.getState()
            )
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {load, loading, more} = nextProps
        const {loadMoreAllowed} = nextState

        if (more && !loading && loadMoreAllowed) {
            load()
        }
    }

    getDisplayBoundingClientRect() {
        return this.display.getBoundingClientRect()
    }

    getContentBoundingClientRect() {
        return this.content.getBoundingClientRect()
    }

    render() {

        const {offsetLeft} = this.props

        return (
            <div ref={display => {
                this.display = display
            }}
                 style={displayStyle}
            >
                <div ref={content => {
                    this.content = content
                }}
                >
                    <Grid {...this.state} offsetLeft={offsetLeft}/>
                </div>
            </div>
        )
    }
}


export default Display