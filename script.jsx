const todoListManager = (state ={currentViewing:'', toDoLists:{todoname:[],todoname2:[{"todo":"brush Teeth","completed":false},{"todo":"brush Teeths","completed":false},{"todo":"brush Teethss","completed":false}]}}, action) => {
  var immutableStore = Immutable.fromJS(state)
  switch (action.type) {
    // add TodoList
    case 'NEWTODOLIST':
      return immutableStore
          .setIn(['toDoLists', action.name] , [])
          .toJS()
    // remove todoList
    case 'REMTODOLIST':
      // resets the viewing
      immutableStore = immutableStore.set('currentViewing' , "")
      // need the name of the todolist to be removed
      return immutableStore
          .deleteIn(['toDoLists', action.name])
          .toJS()
    // add todoItem
    case 'ADDTODOITEM':
      return immutableStore
          .updateIn(['toDoLists', action.todoListName], arr => arr.push({todo: action.todoItem, completed:false}))
          .toJS()
      // complete todo Item
      case 'TOGGLECOMPLETION':
        // get the value
        var x = immutableStore.getIn(['toDoLists', action.todoListName, action.arrayPosition, 'completed'])
        return immutableStore
            .setIn(['toDoLists', action.todoListName, action.arrayPosition, 'completed'], !x)
            .toJS()
    // remove todoItem
    case 'REMTODO':
      return immutableStore
          .deleteIn(['toDoLists', action.todoListName, action.arrayPosition])
          .toJS()

    // currently VIEWING
    case 'UPDATECURRENTLYVIEWING':
      return immutableStore
          .set('currentViewing' , action.whatViewing)
          .toJS()
    default:
      return state;
  }
}

// list navbar
var todoListNameHolder = "";
var todoItemHolder;
class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listName: "value",
    };

    this.handleClick = this.handleClick.bind(this);
    this.currentlyViewingChanger = this.currentlyViewingChanger.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.addList = this.addList.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleClick(e) {
    this.currentlyViewingChanger(e.currentTarget.dataset.id)
  }
  addList(e) {
    if (this.state.listName != "") {
      store.dispatch({
        type: 'NEWTODOLIST', name: this.state.listName
      })
    }
    this.setState({listName: ""});
  }
  handleChange(e) {
    this.setState({listName: e.target.value});
  }
  currentlyViewingChanger(e){
    store.dispatch({
        type: 'UPDATECURRENTLYVIEWING', whatViewing: e
    })
  }
  deleteThis(e){
    store.dispatch({
        type: 'REMTODOLIST', name: e.currentTarget.dataset.id
    })
  }
  render() {
    todoListNameHolder = "";
    todoListNameHolder = this.props.value.map((z) => {
      if (true) {
        return (<span>
          <button className = "deleteButton" data-id={z}  onClick={this.deleteThis.bind(this)}>X</button>
            <h1 data-id={z} onClick={this.handleClick.bind(this)}>
              {z}
            </h1>
          </span>
          )
      }
    }

    );
    return <ul Class = "NAVBAR"> <button onClick={this.addList.bind(this)} className = "addButton">ADD LIST</button><input onChange={this.handleChange.bind(this)} className = "todoListText"type="text" name="name" value={this.state.listName}/> {todoListNameHolder}</ul>;
  }
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
class TodoListItems extends React.Component {
  constructor(props) {
    super(props);
    this.listItemsInViewedList = this.listItemsInViewedList.bind(this);
    this.toggleCompletion = this.toggleCompletion.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.addTodoItem = this.addTodoItem.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      listName: "value",
    };
  }
  addTodoItem(e) {
    if (this.state.listName != "") {
      store.dispatch({
         type: 'ADDTODOITEM', todoListName: store.getState().currentViewing, todoItem: this.state.listName
      })
    }
    this.setState({listName: ""});
  }
  handleChange(e) {
    this.setState({listName: e.target.value});
  }

  listItemsInViewedList(e){
    var selectedPlaceholder = this.props.value
    var itemsWithinList = store.getState().toDoLists[selectedPlaceholder];
    if (itemsWithinList != null) {
      return [(itemsWithinList.map(a => a.todo)),(itemsWithinList.map(a => a.completed))];
    }
  }
  deleteThis(e){
    store.dispatch({
        type: 'REMTODO', todoListName: store.getState().currentViewing, arrayPosition: e.currentTarget.dataset.id
    })
  }
  handleClick(e) {
    this.toggleCompletion(e.currentTarget.dataset.id )
  }
  toggleCompletion(e){
    store.dispatch({
       type: 'TOGGLECOMPLETION', todoListName: store.getState().currentViewing, arrayPosition: e
    })
  }
  render() {
    todoListNameHolder = "";
    todoItemHolder = this.listItemsInViewedList();
    if (todoItemHolder != null) {
      // use some kind of mapping array to see which ones are completed
      var iterator = 0;
      todoListNameHolder = todoItemHolder[0].map((z) =>
        {if (z) {
          return (<li>
            <button className = "deleteButton" data-id={iterator} onClick={this.deleteThis.bind(this)}>X</button>
            <h4 className={todoItemHolder[1][iterator].toString()} data-id={iterator++}  onClick={this.handleClick.bind(this)}>
              {z}
            </h4>
          </li>)
        }}
      );
    }
    if (store.getState().currentViewing != "") {
      return <ul Class = "NAVBAR">{todoListNameHolder} <button onClick={this.addTodoItem.bind(this)} className = "addButton">ADD TODO</button><input onChange={this.handleChange.bind(this)} className = "todoListText"type="text" name="name" value={this.state.listName}/></ul>

    }
    return ""
  }
}

// const Counter = ({
//   value,
//   todoAdder,
//   todoRemover,
//   todoItemAdder,
//   todoItemRemover,
//   toggleComplete,
//   currentlyViewingChanger
// }) => (
//   <div>
//     <button onClick={todoAdder}>Add Todo</button>
//     <button onClick={todoRemover}>Remove Todo</button>
//     <button onClick={todoItemAdder}>Add Todo Item</button>
//     <button onClick={toggleComplete}>Toggle Completion</button>
//     <button onClick={todoItemRemover}>Remove Todo Item</button>
//     <button onClick={currentlyViewingChanger}>Change Currently Viewing</button>
//     <h1>{value}</h1>
//   </div>
// );



const { createStore } = Redux;
const store = createStore(todoListManager)

const render = () => {
  var currHolding = store.getState().currentViewing;
  ReactDOM.render(
    [<TodoList
      value={Object.keys(store.getState().toDoLists)}
    />,
    <TodoListItems
      value={store.getState().currentViewing}
    />,
    // <Counter
    //   value={JSON.stringify(store.getState())}
    //   todoAdder={() =>
    //     store.dispatch({
    //       type: 'NEWTODOLIST', name: "todoname"
    //     })
    //   }
    //   todoRemover={() =>
    //     store.dispatch({
    //        type: 'REMTODOLIST', name: "todoname"
    //     })
    //   }
    //   todoItemAdder={() =>
    //     store.dispatch({
    //        type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"
    //     })
    //   }
    //   toggleComplete={() =>
    //     store.dispatch({
    //        type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0
    //     })
    //   }
    //   todoItemRemover={() =>
    //     store.dispatch({
    //         type: 'REMTODO', todoListName: "todoname", arrayPosition: 0
    //     })
    //   }
    //   currentlyViewingChanger={() =>
    //     store.dispatch({
    //         type: 'UPDATECURRENTLYVIEWING', whatViewing: "listYouAreViewing"
    //     })
    //   }
    // />
  ],




    document.getElementById('root')
  );
};

store.subscribe(render);
render();













/*
// add todo
expect(counter(
  {currentViewing:'', toDoLists:{}}, { type: 'NEWTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});
// add second todo
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'NEWTODOLIST', name: "todoname2"})
).toEqual({currentViewing:'', toDoLists:{todoname:[],todoname2:[]}});
// adding a todo when it already exists
expect(counter(
  {currentViewing:'', toDoLists:{todoname:["ANYTHING HERE WILL BE WIPED"]}}, { type: 'NEWTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

// remove
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'REMTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{}});
// remove item that isnt there
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'REMTODOLIST' ,todoName: "todonames"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

// adding todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}});
// adding second todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false},{todo:"brush Teeth", completed:false}]}});

// toggling todo item's completed status
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}});
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}}, { type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}});

// delete todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'REMTODO', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false},{todo:"brush Teeth", completed:true}]}}, { type: 'REMTODO', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}});

//update currently viewing
expect(counter(
  {currentViewing:'', toDoLists:{}}, { type: 'UPDATECURRENTLYVIEWING', whatViewing: "listYouAreViewing"})
).toEqual({currentViewing:'listYouAreViewing', toDoLists:{}});

console.log('Test passed');
*/
