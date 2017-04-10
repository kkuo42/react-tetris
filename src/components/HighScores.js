import * as React from 'react'; 

let count = 0;

export class HighScores extends React.Component {
  componentWillMount() {
    this.props.dispatch({type: "REQUEST_SCORES"})
  }

  render() {
    if(!this.props.online) {
      return <h2>Server Offline</h2>;
    }
    else { 
      const tableItems = this.props.scores.map(
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