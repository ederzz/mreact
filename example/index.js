import { render, useState } from '../src/reconciler'
import createElement from '../src/createElement'

/** @jsx createElement */

function App() {
    const [ count, setCount ] = useState(1)
    const handleClick = () => {
        console.log('click title.')
    }

    return (
        <div>
            <h1 onClick={ handleClick } title="foo">Hello World!</h1>
            <p>
                <div>counter：{ count }</div>
                <button onClick={ () => setCount(prev => prev + 1) }>+</button>
                <button onClick={ () => setCount(prev => prev - 1) }>-</button>
            </p>
            <div>
                <span>用户名：</span>
                <input placeholder="请输入" />
            </div>
        </div>
    )
}

const element = <h1 title="foo">Hello World!</h1>
const container = document.getElementById("root")

render(<App />, container)