function isPrimitive(val) {
  if (val === null) return true
  return (
    ['boolean', 'string', 'number', 'symbol', 'undefined'].indexOf(
      typeof val
    ) >= 0
  )
}

function obj2String(obj) {
  return Object.prototype.toString.call(obj)
}

function isArray(val) {
  return Array.isArray
    ? Array.isArray(val)
    : obj2String(val) === '[object Array]'
}

function isRegExp(val) {
  return obj2String(val) === '[object RegExp]'
}

function isDate(val) {
  return obj2String(val) === '[object Date]'
}

function isError(val) {
  return obj2String(val) === '[object Error]' || val instanceof Error
}

function getType(val) {
  if (isPrimitive(val)) {
    return val === null ? 'null' : typeof val
  }
  if (typeof val === 'object') {
    return isArray(val)
      ? 'array'
      : isRegExp(val)
      ? 'regexp'
      : isDate(val)
      ? 'date'
      : isError(val)
      ? 'error'
      : 'object'
  }

  if (typeof val === 'function') {
    return 'function'
  }

  return 'unknown'
}

function traverse(obj, parentKey = null, desc, result) {
  if (isArray(obj) && obj.length > 0) {
    if (!parentKey) {
      result.push({
        name: 'root',
        desc: 'Root',
        type: 'array'
      })
    }
    const parent = parentKey ? parentKey : 'root'
    let objOfArray = obj[0]
    traverse(objOfArray, parent, desc, result)
  } else {
    for (let key in obj) {
      const parent = parentKey ? parentKey + '.' : ''
      const parentDesc = (parentKey || '')
        .split('.')
        .map(v => desc[v] || v).join('.')
      const curDesc = desc[key] || key
      result.push({
        name: parent + key,
        desc: parentDesc ? `${parentDesc}.${curDesc}` : curDesc,
        type: getType(obj[key])
      })
      if (obj[key] !== null && typeof obj[key] === 'object') {
        traverse(obj[key], parent + key, desc, result)
      }
    }
  }
}

function extractKeyNameAndType(obj, desc, result) {
  traverse(obj, null, desc, result)
}

function formatedDesc(val) {
  let ret = {}
  for (let i in val) {
    let kv = val[i]
    ret[kv[0]] = kv[1]
  }
  return ret
}

module.exports = {
  extractKeyNameAndType,
  formatedDesc
}
