import {Iterable, fromJS} from 'immutable'
import React, {Component, PropTypes} from 'react'

import Display from './Display'

class AdaptiveGrid extends Component {

    getChildContext() {
        const {ItemComponent, offsetLeft} = this.props

        return {
            ItemComponent,
            offsetLeft
        }
    }

    render() {
        const {minWidth, padding, offsetLeft, load, loading, more} = this.props

        const items = Iterable.isIterable(this.props.items) ? this.props.items : fromJS(this.props.items)

        return (
            <Display
                items={items}
                minWidth={minWidth}
                padding={padding}
                offsetLeft={offsetLeft}
                load={load}
                loading={loading}
                more={more}
            />
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
    offsetLeft: PropTypes.number
}

AdaptiveGrid.propTypes = {
    ItemComponent: PropTypes.func.isRequired,
    minWidth: PropTypes.number.isRequired,
    items: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
    padding: PropTypes.number,
    offsetLeft: PropTypes.number,
    load: PropTypes.func
}

export default AdaptiveGrid