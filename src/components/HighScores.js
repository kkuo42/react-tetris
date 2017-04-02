import * as React from 'react'; 

let count = 0;

export class HighScores extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scores: undefined };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.body.className = 'ok';
                //console.log(xhr.responseText);
                this.setState({scores: JSON.parse(xhr.responseText)});
            } else {
                document.body.className = 'error';
            }
        }
    }.bind(this);
    xhr.open("GET", './scores' , true);
    xhr.send(null);
  }

  render() {
    if(!this.state.scores) {
      return <h1>LOADING</h1>;
    }
    else { 
      const tableItems = this.state.scores.map(
        (x) => <tr key={count++}>
                 <td>{x[0]}</td>
                 <td>{x[1]}</td>
               </tr>   
      );
      return <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {tableItems}
        </tbody>
      </table>;
    }
  }

}