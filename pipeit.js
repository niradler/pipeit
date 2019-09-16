const isFunc = func => typeof func === "function";

const validate = obj => {
  if (Array.isArray(obj)) {
    const validationError = obj.some(i => !isFunc(i));
    if (validationError) throw new Error("array element most be function!");
    obj = obj.reduce((obj, i) => (obj = { ...obj, [i.name]: i }), {});
  } else if (typeof obj === "object" && obj != null) {
    const validationError = Object.values(obj).some(i => !isFunc(i));
    if (validationError) throw new Error("object value most be function!");
  } else {
    throw new Error("must be object!");
  }
};

const pipeit = (obj, initialState, options = { debug: false }) => {
  validate(obj);
  let state = initialState;
  const proxy = new Proxy(obj, {
    get(target, propKey) {
      if (propKey === "value") {
        if (options.debug) console.log({ value: state });
        return state;
      }

      if (options.debug) console.log({ key: propKey });
      if (options.debug) console.log({ before: state });

      if (target[propKey] && isFunc(target[propKey])) {
        state = target[propKey](state);
      } else {
        throw new Error("propKey not found!");
      }

      if (options.debug) console.log({ after: state });

      return proxy;
    }
  });

  return proxy;
};

module.exports = pipeit;
