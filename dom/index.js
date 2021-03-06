const _ = require('slapdash')
const once = require('../lib/once')
const withRestoreAll = require('../lib/withRestoreAll')
const promised = require('../lib/promised')

function onEvent (el, type, fn) {
  el.addEventListener(type, fn)
  return once(() => el.removeEventListener(type, fn))
}

function onEnterViewport (el, fn) {
  if (el.getBoundingClientRect().top <= window.innerHeight) {
    fn()
    return () => {}
  }

  const handleScroll = _.debounce(() => {
    if (el.getBoundingClientRect().top <= window.innerHeight) {
      document.removeEventListener('scroll', handleScroll)
      fn()
    }
  }, 50)
  document.addEventListener('scroll', handleScroll)
  return once(() => document.removeEventListener('scroll', handleScroll))
}

function replace (target, el) {
  const parent = target.parentElement
  parent.insertBefore(el, target.nextSibling)
  parent.removeChild(target)
  return once(() => replace(el, target))
}

function insertAfter (target, el) {
  const parent = target.parentElement
  parent.insertBefore(el, target.nextSibling)
  return once(() => parent.removeChild(el))
}

function insertBefore (target, el) {
  const parent = target.parentElement
  parent.insertBefore(el, target)
  return once(() => parent.removeChild(el))
}

module.exports = () => {
  const utils = withRestoreAll({
    onEvent,
    onEnterViewport,
    replace,
    insertAfter,
    insertBefore
  })

  _.each(_.keys(utils), key => {
    if (key.indexOf('on') === 0) utils[key] = promised(utils[key])
  })

  return utils
}
