import {render} from '@testing-library/react'
import VisualWindow from '../src'

const itemData = new Array(100).fill(null).map((_, i) => ({odd: i % 2}))

describe('it', () => {
    it('should render an empty list', () => {
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

    it('should render a list of rows', () => {
        const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        const Row = (props: unknown) => itemRenderer(props)
        render(
            <VisualWindow itemData={itemData} defaultItemHeight={100}>
                {Row}
            </VisualWindow>,
        )
        expect(itemRenderer).toHaveBeenCalledTimes(9)
    })

    it('should render a list of rows disable detectHeight', () => {
        const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
        const Row = (props: unknown) => itemRenderer(props)
        render(
            <VisualWindow itemData={itemData} defaultItemHeight={100} detectHeight={false}>
                {Row}
            </VisualWindow>,
        )
        expect(itemRenderer).toHaveBeenCalledTimes(18)
    })

    // it('should render a list of rows and scroll to 100', async () => {
    //     const itemRenderer = jest.fn(({style, ...rest}) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>)
    //     const Row = (props: unknown) => itemRenderer(props)
    //     render(
    //         <div>
    //             <VisualWindow itemData={itemData} defaultItemHeight={100}>
    //                 {Row}
    //             </VisualWindow>
    //         </div>,
    //     )
    //     expect(itemRenderer).toHaveBeenCalledTimes(9)

    //     // const scroll = userEvent.setup()
    //     console.log(window.scrollY)
    //     // global.scrollTo = jest.fn()
    //     await fireEvent.scroll(window, {target: {scrollY: 1000}})
    //     // global.scrollTo({top: 100})
    //     // simulateScroll(container, 100)
    //     console.log(window.scrollY)

    //     expect(itemRenderer).toHaveBeenCalledTimes(9)
    // })
})
