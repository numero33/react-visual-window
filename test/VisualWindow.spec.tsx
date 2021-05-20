import * as React from "react"
import {render} from "@testing-library/react"
import VisualWindow from "../src"

const itemData = new Array(100).fill(null).map((_, i) => ({odd: i % 2}))

describe("it", () => {
    it("should render an empty list", () => {
        const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        const Row = (props: unknown) => itemRenderer(props)
        const props = {
            children: Row,
            itemData,
            defaultItemHeight: 100,
        }
        render(<VisualWindow {...props} itemData={[]} />)
        expect(itemRenderer).not.toHaveBeenCalled()
    })

    it("should render a list of rows", () => {
        const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        const Row = (props: unknown) => itemRenderer(props)
        render(
            <VisualWindow itemData={itemData} defaultItemHeight={100}>
                {Row}
            </VisualWindow>,
        )
        expect(itemRenderer).toHaveBeenCalledTimes(8)
    })

    it("should render a list of rows disable detectHeight", () => {
        const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        const Row = (props: unknown) => itemRenderer(props)
        render(
            <VisualWindow itemData={itemData} defaultItemHeight={100} detectHeight={false}>
                {Row}
            </VisualWindow>,
        )
        expect(itemRenderer).toHaveBeenCalledTimes(8)
    })

    // it("should render a list of rows and scroll to 100", () => {
    //     Object.defineProperty(window, "scrollY", {value: 1000, writable: true})

    //     const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
    //     const Row = (props: unknown) => itemRenderer(props)
    //     const {container} = render(
    //         <div>
    //             <VisualWindow itemData={itemData} defaultItemHeight={100}>
    //                 {Row}
    //             </VisualWindow>
    //         </div>,
    //     )
    //     expect(itemRenderer).toHaveBeenCalledTimes(8)

    //     // global.scrollTo = jest.fn()
    //     // fireEvent.scroll(window, {scrollY: 500})
    //     // global.scrollTo({top: 100})
    //     simulateScroll(container, 100)

    //     expect(itemRenderer).toHaveBeenCalledTimes(8)
    // })
})
