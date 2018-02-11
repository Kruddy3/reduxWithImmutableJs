const counter = (state = 0, action) => {
  switch (action.type) {
    case 'NEWTODO':
      return state + 1;
    default:
      return state;
  }
}

expect(
  counter(0, { type: 'NEWTODO'})
).toEqual( 1);
console.log('Test passed');
