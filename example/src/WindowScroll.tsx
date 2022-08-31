import React from 'react'
import VisualWindow, {VisualWindowChildProps} from 'react-visual-window'

interface IData {
    odd: boolean
    height: number
}

const data = new Array(10000).fill(true).map(
    (_, x) =>
        ({
            odd: x % 2 !== 0,
            height: (((x + 0) % 10) + 2) * 10,
        } as IData),
)

const Row = React.forwardRef<HTMLDivElement, VisualWindowChildProps>((props, ref) => {
    const {data, index, style} = props
    const [first, setfirst] = React.useState(index === 0)
    const item = (data as IData[])[index]
    return (
        <div ref={ref} style={{...style}} className={item.odd ? 'odd' : 'even'}>
            <div style={{height: item.height}}>
                Row {index} - odd: {item.odd ? `true` : `false`} - height: {item.height} <button onClick={() => setfirst(x => !x)}>click</button>
                {first && <div className="new">xxxx</div>}
            </div>
        </div>
    )
})

const WindowScroll = () => {
    return (
        <div>
            <VisualWindow defaultItemHeight={20} itemData={data} detectHeight={true} className="tableClass">
                {Row}
            </VisualWindow>
        </div>
    )
}
export default WindowScroll
