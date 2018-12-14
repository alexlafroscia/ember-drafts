function getIdentity(object, resolver) {
  let identity;

  if (typeof resolver === 'function') {
    identity = resolver(object);
  } else if (resolver) {
    identity = resolver;
  } else {
    identity = object;
  }

  return identity;
}

function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol'
  );
}

/**
 * A Map-Like object that uses an optional resolver when looking up
 * objects within it
 *
 * Non-Primitive keys are kept in a `WeakMap` so their values can be
 * garbage collected, if appropriate.
 *
 * Primitive keys are kept in a regular `Map` so that their values do
 * not expire.
 */
export default class MapWithResolver {
  constructor() {
    this._weakMap = new WeakMap();
    this._map = new Map();
  }

  _retrieveMap(identity) {
    return isPrimitive(identity) ? this._map : this._weakMap;
  }

  get(object, resolver) {
    const identity = getIdentity(object, resolver);

    return this._retrieveMap(identity).get(identity);
  }

  has(object, resolver) {
    const identity = getIdentity(object, resolver);

    return this._retrieveMap(identity).has(identity);
  }

  set(object, resolver, newValue) {
    const identity = getIdentity(object, resolver);

    return this._retrieveMap(identity).set(identity, newValue);
  }
}
