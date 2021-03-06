/* globals describe it beforeEach afterEach */
const _ = require('slapdash')
const dom = require('../dom')
const sinon = require('sinon')
const { expect } = require('chai')

describe('dom', function () {
  let restoreAll, onEvent, replace, insertBefore, insertAfter
  let container, one, two, three

  beforeEach(() => {
    ;({ restoreAll, onEvent, replace, insertBefore, insertAfter } = dom())
    container = document.createElement('div')
    document.body.appendChild(container)
    container.innerHTML = `
      <div id='test-1'>test one</div>
      <div id='test-2'>test two</div>
      <div id='test-3'>test three</div>
    `
    ;[one, two, three] = _.map([1, 2, 3], i =>
      document.querySelector(`#test-${i}`)
    )
  })

  afterEach(() => {
    restoreAll()
    document.body.removeChild(container)
  })

  describe('onEvent', function () {
    it('should add a listener and return a restore function', function () {
      const stub = sinon.stub()
      const restore = onEvent(one, 'click', stub)
      one.click()
      expect(stub.calledOnce).to.eql(true)
      restore()
      one.click()
      expect(stub.calledOnce).to.eql(true)
    })

    describe('if no callback is passed', function () {
      it('should return a promise', function () {
        const stub = sinon.stub()
        onEvent(one, 'click').then(stub)
        one.click()
        expect(stub.calledOnce).to.eql(true)
      })

      it('should be restorable with restoreAll', function () {
        const stub = sinon.stub()
        onEvent(one, 'click').then(stub)
        restoreAll()
        one.click()
        expect(stub.called).to.eql(false)
      })
    })
  })

  describe('replace', function () {
    it('should replace an element and return a restore function', function () {
      const dummy = document.createElement('div')
      dummy.id = 'dummy'
      const restore = replace(two, dummy)
      expect(fromArray(container.children)).to.eql([one, dummy, three])
      restore()
      expect(fromArray(container.children)).to.eql([one, two, three])
    })
  })

  describe('insertBefore', function () {
    it('should insertBefore an element and return a restore function', function () {
      const dummy = document.createElement('div')
      dummy.id = 'dummy'
      const restore = insertBefore(two, dummy)
      expect(fromArray(container.children)).to.eql([one, dummy, two, three])
      restore()
      expect(fromArray(container.children)).to.eql([one, two, three])
    })
  })

  describe('insertAfter', function () {
    it('should insertAfter an element and return a restore function', function () {
      const dummy = document.createElement('div')
      dummy.id = 'dummy'
      const restore = insertAfter(two, dummy)
      expect(fromArray(container.children)).to.eql([one, two, dummy, three])
      restore()
      expect(fromArray(container.children)).to.eql([one, two, three])
    })
  })
})

function fromArray (arr) {
  return _.map(arr, i => i)
}
