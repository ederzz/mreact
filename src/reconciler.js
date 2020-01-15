const isProperty = k => k !== 'children'

export function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [ element ]
        }
    }
    nextUnitOfWork = wipRoot
}

function createDom(fiber) {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)
    
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[ name ] = fiber.props[ name ]
        })

    return dom
}

function performUnitOfWork(fiber) {
    // set dom property
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    // reconciler children
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[ index ]

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }

    // return next unit of work
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

let nextUnitOfWork = null // each unit of work is a fiber for a element.
let wipRoot = null

function workLoop(dealine) {
    let shouldYield = false

    while (nextUnitOfWork && !shouldYield) { // workloop could be yield.
        nextUnitOfWork = performUnitOfWork( nextUnitOfWork )

        shouldYield = dealine.timeRemaining() < 1
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }

    requestIdleCallback( workLoop )
}

// commit fiber tree to the dom.
function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) return
    const parentDom = fiber.parent.dom
    parentDom.appendChild( fiber.dom )
    commitWork( fiber.child )
    commitWork( fiber.sibling )
}

requestIdleCallback( workLoop )