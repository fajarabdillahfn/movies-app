import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OneGenreFunc(props) {
  let [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  let [genreName, setGenreName] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/v1/movies/' + props.match.params.id)
      .then((response) => {
        if (response.status !== 200) {
          setError('Invalid response code: ' + response.status);
        } else {
          setError(null);
        }
        return response.json();
      })
      .then((json) => {
        setMovies(json.movies);
        setGenreName(props.location.genreName);
      });
  }, [props.match.params.id, props.location.genreName]);

  if (!movies) {
    movies = [];
  }

  if (error) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <Fragment>
        <h2>Genre: {genreName}</h2>

        <div className='list-group'>
          {movies.map((m) => (
            <Link
              key={m.id}
              to={`/movies/${m.id}`}
              className='list-group-item list-group-item-action'>
              {m.title}
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default OneGenreFunc;
