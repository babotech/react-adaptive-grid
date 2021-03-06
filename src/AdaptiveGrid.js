import React, {Component, PropTypes} from 'react'
import Display from './Display'
import {List} from 'immutable'

class AdaptiveGrid extends Component {

    getChildContext() {
        const {ItemComponent, additionalHeight, items, offsetLeft} = this.props

        return {
            ItemComponent,
            additionalHeight,
            items,
            offsetLeft
        }
    }

    render() {
        const {additionalHeight, buffer, items, minWidth, padding, offsetLeft, load, loading, more} = this.props

        const displayProps = {
            additionalHeight,
            buffer,
            items,
            minWidth,
            padding,
            offsetLeft,
            load,
            loading,
            more
        }

        return (
            <Display {...displayProps} />
        )
    }
}

AdaptiveGrid.defaultProps = {
    buffer: 0,
    offsetLeft: 0,
    padding: 0,
    load: () => null,
    more: false,
    loading: false
}

AdaptiveGrid.childContextTypes = {
    ItemComponent: PropTypes.func,
    additionalHeight: PropTypes.number,
    items: PropTypes.instanceOf(List),
    offsetLeft: PropTypes.number
}

AdaptiveGrid.propTypes = {
    ItemComponent: PropTypes.func.isRequired,
    additionalHeight: PropTypes.number,
    buffer: PropTypes.number,
    minWidth: PropTypes.number.isRequired,
    items: PropTypes.instanceOf(List).isRequired,
    padding: PropTypes.number,
    offsetLeft: PropTypes.number,
    load: PropTypes.func
}

export default AdaptiveGrid