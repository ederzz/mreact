const isProperty = k => k !== 'children'

export function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [ element ]
        }
    }
}

function createDom(fiber) {
    const dom = element.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(element.type)
    
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[ name ] = element.props[ name ]
        })

    return dom
}

function performUnitOfWork() {
    // set dom property
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    // reconciler children
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[ index ]

        const newFiber = {
            type: element.type,
            props: elements.this.props,
            parent: fiber,
            dom: null
        }

        if (index === 0) {
            newFiber.child = newFiber
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

function workLoop(dealine) {
    let shouldYield = false

    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork( nextUnitOfWork )

        shouldYield = dealine.timeRemaining() < 1
    }

    requestIdleCallback( workLoop )
}

requestIdleCallback( workLoop )