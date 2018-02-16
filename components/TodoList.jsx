class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listName: "",
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
    var todoListNameHolder = "";
    todoListNameHolder = this.props.value.map((z) => {
      if (z == store.getState().currentViewing) {
        return (<span>
          <button className = "deleteButton" data-id={z}  onClick={this.deleteThis.bind(this)}>X</button>
            <h1 data-id={z} onClick={this.handleClick.bind(this)} style= {{color: 'red'}}>
              {z}
            </h1>
          </span>
          )
      } else {
        return (<span>
          <button className = "deleteButton" data-id={z}  onClick={this.deleteThis.bind(this)}>X</button>
            <h1 data-id={z} onClick={this.handleClick.bind(this)} style= {{color: 'black'}}>
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
