const addOne = x => x + 1;
const addTwo = x => x + 2;
const addThree = x => x + 3;

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

const pipeitAsync = (
  obj,
  initialState,
  options = { debug: false, sequently: false }
) => {
  validate(obj);
  let state = initialState;
  const promises = [];
  const proxy = new Proxy(obj, {
    get(target, propKey) {
      if (propKey === "promise") {
        if (options.sequently)
          return promises.reduce((accumulatorPromise, promise) => {
            return accumulatorPromise.then(r => {
              state = r;
              return promise;
            });
          }, Promise.resolve());
        else return Promise.all(promises);
      }

      if (target[propKey] && isFunc(target[propKey])) {
        promises.push(target[propKey](state).then(r => (state = r)));
      } else {
        throw new Error("propKey not found!");
      }

      return proxy;
    }
  });

  return proxy;
};
// const res = pipeit({ addOne, addTwo }, 0, { debug: true }).addOne.addOne.addTwo
//   .value;
const promisfy = func => x => Promise.resolve(func(x));
pipeitAsync({ addOne: promisfy(addOne), addTwo: promisfy(addTwo) }, 0, {
  debug: true,
  sequently: true
}).addOne.addOne.addTwo.promise.then(r => console.log("async", r));
