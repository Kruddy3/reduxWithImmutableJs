class TodoListItems extends React.Component {
  constructor(props) {
    super(props);
    this.listItemsInViewedList = this.listItemsInViewedList.bind(this);
    this.toggleCompletion = this.toggleCompletion.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.addTodoItem = this.addTodoItem.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      listName: "",
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
    var todoListNameHolderForList = "";
    var todoItemHolder = this.listItemsInViewedList();
    if (todoItemHolder != null) {
      // use some kind of mapping array to see which ones are completed
      var iterator = 0;
      todoListNameHolderForList = todoItemHolder[0].map((z) =>
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
      return <ul Class = "NAVBAR">{todoListNameHolderForList} <button onClick={this.addTodoItem.bind(this)} className = "addButton">ADD TODO</button><input onChange={this.handleChange.bind(this)} className = "todoListText"type="text" name="name" value={this.state.listName}/></ul>

    }
    return ""
  }
}
