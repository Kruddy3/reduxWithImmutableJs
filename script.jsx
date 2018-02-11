const counter = (state = {}, action) => {
  var immutableStore = Immutable.fromJS(state)
  switch (action.type) {
    case 'NEWNAME':
      return  immutableStore
            .set('name', action.value)
            .toJS() // returning usual JS object;
    default:
      return state;
  }
}

expect(
  counter({name: "kevin", }, { type: 'NEWNAME', value: "Johnny"})
).toEqual( {name: "Johnny", });
console.log('Test passed');
