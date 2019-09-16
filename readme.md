# pipeit

```
const addOne = x => x + 1;
const addTwo = x => x + 2;
const addThree = x => x + 3;

const res = pipeit({ addOne, addTwo }, 0, { debug: true }).addOne.addOne.addTwo.value;
const res2 = pipeit([ addOne, addTwo ], 0, { debug: true }).addOne.addOne.addTwo.value;
```