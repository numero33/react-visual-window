import React, {useRef} from 'react'
import VisualWindow, {VisualWindowChildProps} from 'react-visual-window'

interface IData {
    odd: boolean
    height: number
}

const data = new Array(10000).fill(true).map(
    (_, x) =>
        ({
            odd: x % 2 !== 0,
            // height: (((x + 0) % 10) + 2) * 10,
            height: 40,
        } as IData),
)

const Row = React.forwardRef<HTMLDivElement, VisualWindowChildProps>((props, ref) => {
    const {data, index, style} = props
    const item = (data as IData[])[index]
    return (
        <div ref={ref} style={{...style}} className={item.odd ? 'odd' : 'even'}>
            <div>
                Row {index} - odd: {item.odd ? `true` : `false`} - height: {item.height}
            </div>
        </div>
    )
})

const ContainerScroll = () => {
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div>
            <div ref={ref} style={{height: '200px', overflow: 'scroll'}}>
                <VisualWindow defaultItemHeight={40} itemData={data} className="tableClass" container={ref}>
                    {Row}
                </VisualWindow>
            </div>
        </div>
    )
}
export default ContainerScroll
