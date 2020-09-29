# @qubit/utils
Utilities for clientside code injection


### @qubit/utils/dom

## Usage
```js
const {
  replace,
  insertBefore,
  insertAfter,
  onEvent,
  onEnterViewport,
  restoreAll
} = require('@qubit/utils/dom')()
````

## replace(target, el)
Replaces `target` with `el`, returns a function that swaps the elements back round

e.g.
```js
const restore = replace(target, el)
```

## insertBefore(target, el)
Inserts `el` before `target`, returns a function that removes `el`

e.g.
```js
const restore = insertBefore(target, el)
```

## insertAfter(target, el)
Inserts `el` after `target`, returns a function that removes `el`

e.g.
```js
const restore = insertAfter(target, el)
```

## onEvent(el, type, fn)
Adds an event listener of `type` to `el`, returning a function that removes it

e.g.
```js
const restore = onEvent(el, 'click', function () {
  window.alert('clicked!')
})
```

## onEnterViewport(el, type, fn)
Calls callback when the item enters the viewport, returns a function that cancels and removes any event listeners

e.g.
```js
const restore = onEnterViewport(el, function () {
  window.alert('Hello from within the viewport!')
})
```

## restoreAll
Keeps track of any dispose functions that get generated and calls them all for you
e.g.
```js
replace(target, el)
onEvent(el, 'click', handler)

restoreAll()

// Equivalent to:
const restore1 = replace(target, el)
const restore2 = onEvent(el, 'click', handler)

restore1()
restore2()
```
