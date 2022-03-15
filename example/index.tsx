import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import VisualWindow, {VisualWindowChildProps} from "../"

import "./style.css"

const random = (min = 0, max = 50) => {
    let num = Math.random() * (max - min) + min

    return Math.floor(num)
}

interface IData {
    odd: boolean
    height: number
}

const data = new Array(100).fill(true).map(
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
        <div ref={ref} style={{...style}} className={item.odd ? "odd" : "even"}>
            <div>
                Row {index} - odd: {item.odd ? `true` : `false`} - height: {item.height} <button onClick={() => setfirst(x => !x)}>click</button>
                {first && <div className="new">xxxx</div>}
            </div>
        </div>
    )
})

const App = () => {
    return (
        <div>
            <VisualWindow defaultItemHeight={21} itemData={data} className="tableClass">
                {Row}
            </VisualWindow>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
