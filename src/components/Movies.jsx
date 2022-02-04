import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Movies extends Component {
  state = { movies: [] };

  componentDidMount() {
    this.setState({
      movies: [
        { id: 1, title: 'The Shawshank Redemption', runtime: 142 },
        { id: 2, title: 'One Piece', runtime: 120 },
        { id: 3, title: 'The Matrix', runtime: 152 },
      ],
    });
  }

  render() {
    return (
      <Fragment>
        <h2>Choose a Movie</h2>

        <ul>
          {this.state.movies.map((m) => (
            <li key={m.id}>
              <Link to={`/movies/${m.id}`}>{m.title}</Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}
