import React, {PureComponent} from "react"
import ReactTestRenderer from "react-test-renderer"
import VisualWindow from ".."

describe("VisualWindow", () => {
    let itemRenderer, defaultProps

    // Use PureComponent to test memoization.
    // Pass through to itemRenderer mock for easier test assertions.
    class PureItemRenderer extends PureComponent {
        render() {
            return itemRenderer(this.props)
        }
    }

    beforeEach(() => {
        jest.useFakeTimers()

        // JSdom does not do actual layout and so doesn't return meaningful values here.
        // For the purposes of our tests though, we can mock out semi-meaningful values.
        // This mock is required for e.g. "onScroll" tests to work properly.
        Object.defineProperties(HTMLElement.prototype, {
            clientWidth: {
                configurable: true,
                get: function () {
                    return parseInt(this.style.width, 10) || 0
                },
            },
            clientHeight: {
                configurable: true,
                get: function () {
                    return parseInt(this.style.height, 10) || 0
                },
            },
            scrollHeight: {
                configurable: true,
                get: () => Number.MAX_SAFE_INTEGER,
            },
            scrollWidth: {
                configurable: true,
                get: () => Number.MAX_SAFE_INTEGER,
            },
        })

        itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        defaultProps = {
            children: PureItemRenderer,
            itemData: new Array(100).fill().map((_, i) => ({index: i})),
            defaultItemHeight: 100,
        }
    })

    it("should render an empty list", () => {
        ReactTestRenderer.create(<VisualWindow {...defaultProps} itemData={[]} />)
        expect(itemRenderer).not.toHaveBeenCalled()
    })

    it("should render a list of rows", () => {
        ReactTestRenderer.create(<VisualWindow {...defaultProps} />)
        expect(itemRenderer).toHaveBeenCalledTimes(8)
    })

    it("should re-render items if defaultItemHeight changes", () => {
        const rendered = ReactTestRenderer.create(<VisualWindow {...defaultProps} defaultItemHeight={100} />)
        expect(itemRenderer).toHaveBeenCalledTimes(8)
        itemRenderer.mockClear()

        // Re-rendering should not affect pure sCU children:
        rendered.update(<VisualWindow {...defaultProps} defaultItemHeight={50} />)
        expect(itemRenderer).toHaveBeenCalledTimes(16)
        itemRenderer.mockClear()

        // Re-rendering with new layout should re-render children:
        rendered.update(<VisualWindow {...defaultProps} defaultItemHeight={100} />)
        expect(itemRenderer).toHaveBeenCalledTimes(8)
    })
})
