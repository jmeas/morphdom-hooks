const test = require('tape')
const hooks = require('./')

test('wrapping morphdom', function (t) {
  t.plan(6)
  hooks(lib)('foo', 'bar', {
    onBeforeElUpdated: pass,
    onNodeAdded: pass,
    onElUpdated: pass,
    onNodeDiscarded: pass
  })

  function lib (fr, to, opts) {
    t.equal(fr, 'foo')
    t.equal(to, 'bar')
    opts.onBeforeElUpdated({}, {})
    opts.onNodeAdded({})
    opts.onElUpdated({})
    opts.onNodeDiscarded({})
  }

  function pass () {
    t.pass('should call function')
  }
})

test('events', function (t) {
  t.plan(3)
  const foo = {}
  const handleEvent = function (foo) {
    t.ok(foo, 'should call function')
  }
  foo.onadd = handleEvent
  foo.onupdate = handleEvent
  foo.ondiscard = handleEvent
  hooks(lib)()

  function lib (fr, to, opts) {
    opts.onNodeAdded(foo)
    opts.onElUpdated(foo)
    opts.onNodeDiscarded(foo)
  }
})

test('copying events', function (t) {
  t.plan(6)
  const foo = {}
  const bar = {}
  bar.onadd = noop
  bar.onupdate = noop
  bar.ondiscard = noop
  const baz = {}

  const morphdom = hooks(lib)
  morphdom(foo, bar)
  t.equal(typeof foo.onadd, 'function')
  t.equal(typeof foo.onupdate, 'function')
  t.equal(typeof foo.ondiscard, 'function')
  morphdom(foo, baz)
  t.equal(typeof foo.onadd, 'undefined')
  t.equal(typeof foo.onupdate, 'undefined')
  t.equal(typeof foo.ondiscard, 'undefined')

  function lib (fr, to, opts) {
    opts.onBeforeElUpdated(fr, to)
  }

  function noop () {}
})
