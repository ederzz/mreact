export const isEventProp = k => k.startsWith('on')

export const isProperty = k => k !== 'children' && !isEventProp(k)

export const isNewProp = (prev, next) => key => prev[key] !== next[key]

export const isGoneProp = (prev, next) => key => !(key in next)