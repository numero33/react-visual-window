import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './style.css'
import WindowScroll from './src/WindowScroll'
import ContainerScroll from './src/ContainerScroll'

const App = () => {
    return (
        <div>
            <WindowScroll />
            {/* <ContainerScroll /> */}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
