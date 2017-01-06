import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    alert('Name: ' + this.state.name + "\nScore: " + this.props.score);
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        name: this.state.name,
        score: this.props.score
    }));
  }

  render() {
    return <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>;
  }
}
