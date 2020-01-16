import { render } from '../src/reconciler'
import createElement from '../src/createElement'

/** @jsx createElement */

function App() {
    return (
        <div>
            <h1 title="foo">Hello World!</h1>
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