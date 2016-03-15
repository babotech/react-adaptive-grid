import {Iterable, List, fromJS} from 'immutable'
import React, {Component, PropTypes} from 'react'

import Display from './Display'

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
        const {additionalHeight, items, minWidth, padding, offsetLeft, load, loading, more} = this.props

        const displayProps = {
            additionalHeight,
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
    minWidth: PropTypes.number.isRequired,
    items: PropTypes.instanceOf(List).isRequired,
    padding: PropTypes.number,
    offsetLeft: PropTypes.number,
    load: PropTypes.func
}

export default AdaptiveGrid