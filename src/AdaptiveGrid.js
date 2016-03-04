import React, {Component, PropTypes} from 'react'
import Display from './Display'

class AdaptiveGrid extends Component {

    getChildContext() {
        const {ItemComponent} = this.props

        return {
            ItemComponent
    }
    }

    render() {
        const {items, minWidth, padding, offsetLeft, more} = this.props

        return (
            <Display
                items={items}
                minWidth={minWidth}
                padding={padding}
                offsetLeft={offsetLeft}
                more={more}
            />
        )
    }
}

AdaptiveGrid.childContextTypes = {
    ItemComponent: PropTypes.func,
}

AdaptiveGrid.propTypes = {
    ItemComponent: PropTypes.func.isRequired,
    minWidth: PropTypes.number,
    items: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    padding: PropTypes.number,
    offsetLeft: PropTypes.number
}

export default AdaptiveGrid