import test from 'ava'
const extractKeyNameAndType = require('../src/util')

const rawResponse = {
  name: 'foo',
  val: 'bar'
}

test('foo', t => {
  let result = []
  extractKeyNameAndType(rawResponse, result)
  t.is(result.length, 2)
})