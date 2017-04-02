import * as React from 'react';

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
    event.preventDefault();

    if(this.state.name === "") {
      alert("You must enter a name.");
    }
    else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/submit', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          name: this.state.name,
          score: this.props.score
      }));
      this.setState({submitted: true});
      this.props.store.dispatch({type: "submit"});
    }
  }

  render() {
    if(this.state.submitted) {
      return <div>Submitted!</div>;
    }
    else {
      return <div>
        Submit highscore?
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>;
    }
  }
}
