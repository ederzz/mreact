import { render } from '../src/reconciler'
import createElement from '../src/createElement'

/** @jsx createElement */

const element = <h1 title="foo">Hello World!</h1>
const container = document.getElementById("root")

render(element, container)