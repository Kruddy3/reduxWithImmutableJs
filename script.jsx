const counter = (state = {}, action) => {
  var immutableStore = Immutable.fromJS(state)
  switch (action.type) {
    case 'NEWNAME':
      return immutableStore
            .setIn([action.location,'name'], action.value)
            .toJS() // returning usual JS object;
    case 'ADDPERSON':
        return immutableStore
            .push(Immutable.fromJS({name:action.value}))
            .toJS() // returning usual JS object;
    default:
      return state;
  }
}

expect(
  counter([{name: "kevin", }], { type: 'NEWNAME', value: "Johnny", location: 0})
).toEqual([{name: "Johnny", }]);

expect(
  counter([{name: "kevin", }], { type: 'ADDPERSON', value: "Johnny"})
).toEqual( [{name: "kevin", }, {name: "Johnny" }]);

console.log('Test passed');
