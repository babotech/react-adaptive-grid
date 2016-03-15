import {Iterable, fromJS} from 'immutable'
import React, {Component, PropTypes} from 'react'

import Display from './Display'

class AdaptiveGrid extends Component {

    getChildContext() {
        const {ItemComponent, additionalHeight, offsetLeft} = this.props

        return {
            ItemComponent,
            additionalHeight,
            offsetLeft
        }
    }

    render() {
        const {additionalHeight, minWidth, padding, offsetLeft, load, loading, more} = this.props

        const items = Iterable.isIterable(this.props.items) ? this.props.items : fromJS(this.props.items)

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
    offsetLeft: PropTypes.number
}

AdaptiveGrid.propTypes = {
    ItemComponent: PropTypes.func.isRequired,
    additionalHeight: PropTypes.number,
    minWidth: PropTypes.number.isRequired,
    items: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
    padding: PropTypes.number,
    offsetLeft: PropTypes.number,
    load: PropTypes.func
}

export default AdaptiveGrid