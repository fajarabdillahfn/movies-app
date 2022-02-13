import React, { Fragment, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router-dom';
import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import TextArea from './form-components/TextArea';
import Alert from './ui-components/Alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function EditMovieFunc(props) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({ type: 'd-none', message: '' });
  const mpaa_options = [
    { id: 'G', value: 'G' },
    { id: 'PG', value: 'PG' },
    { id: 'PG13', value: 'PG13' },
    { id: 'R', value: 'R' },
    { id: 'NC17', value: 'NC17' },
  ];

  useEffect(() => {
    if (props.jwt === '') {
      props.history.push({
        pathname: '/login',
      });
      return;
    }

    const id = props.match.params.id;
    if (id > 0) {
      fetch('http://localhost:4000/v1/movie/' + id)
        .then((response) => {
          if (response.status !== 200) {
            setError('Invalid response code: ' + response.status);
          } else {
            setError(null);
          }
          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);
          json.movie.release_date = releaseDate.toISOString().split('T')[0];

          setMovie(json.movie);
        });
    }
  }, [props.history, props.jwt, props.match.params.id]);

  const handleChange = () => (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    //client side validation
    let errors = [];
    if (movie.title === '') {
      errors.push('title');
    } else if (movie.release_date === '') {
      errors.push('release_date');
    } else if (movie.runtime === '') {
      errors.push('runtime');
    } else if (movie.mpaa_rating === '') {
      errors.push('mpaa_rating');
    } else if (movie.rating === '') {
      errors.push('rating');
    } else if (movie.description === '') {
      errors.push('description');
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + props.jwt);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders,
    };

    fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({
            alert: {
              type: 'alert-danger',
              message: data.error.message,
            },
          });
        } else {
          props.history.push({
            pathname: '/admin',
          });
        }
      });
  };

  const confirmDelete = (e) => {
    confirmAlert({
      title: 'Delete Movie',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', 'Bearer ' + props.jwt);

            fetch('http://localhost:4000/v1/admin/deletemovie/' + movie.id, {
              method: 'GET',
              headers: myHeaders,
            })
              .then((response) => response.json)
              .then((data) => {
                if (data.error) {
                  setAlert({
                    alert: {
                      type: 'alert-danger',
                      message: data.error.message,
                    },
                  });
                } else {
                  setAlert({
                    alert: {
                      type: 'alert-success',
                      message: 'Movie deleted',
                    },
                  });
                  props.history.push({
                    pathname: '/admin',
                  });
                }
              });
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  function hasError(key) {
    return errors.indexOf(key) !== -1;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <Alert alertType={alert.type} alertMessage={alert.message} />
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type='hidden'
            name='id'
            id='id'
            value={movie.id}
            onChange={handleChange('id')}
          />

          <Input
            title={'Title'}
            className={hasError('title') ? 'is-invalid' : ''}
            type={'text'}
            name={'title'}
            value={movie.title}
            handleChange={handleChange('title')}
            errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter a title'}
          />

          <Input
            title={'Release Date'}
            className={hasError('release_date') ? 'is-invalid' : ''}
            type={'date'}
            name={'release_date'}
            value={movie.release_date}
            handleChange={handleChange('release_date')}
            errorDiv={hasError('release_date') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter the release date'}
          />

          <Input
            title={'Runtime'}
            className={hasError('runtime') ? 'is-invalid' : ''}
            type={'text'}
            name={'runtime'}
            value={movie.runtime}
            handleChange={handleChange('runtime')}
            errorDiv={hasError('runtime') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter the runtime in minutes'}
          />

          <Select
            title={'MPAA Rating'}
            className={hasError('mpaa_rating') ? 'is-invalid' : ''}
            name={'mpaa_rating'}
            options={mpaa_options}
            value={movie.mpaa_rating}
            handleChange={handleChange('mpaa_rating')}
            placeholder={'Choose...'}
            errorDiv={hasError('mpaa_rating') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter the MPAA rating'}
          />

          <Input
            title={'Rating'}
            className={hasError('rating') ? 'is-invalid' : ''}
            type={'text'}
            name={'rating'}
            value={movie.rating}
            handleChange={handleChange('rating')}
            errorDiv={hasError('rating') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter the rating'}
          />

          <TextArea
            title={'Description'}
            className={hasError('description') ? 'is-invalid' : ''}
            rows={'3'}
            name={'description'}
            value={movie.description}
            handleChange={handleChange('description')}
            errorDiv={hasError('description') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter a description'}
          />

          <hr />

          <button className='btn btn-primary'>Save</button>
          <Link to='/admin' className='btn btn-warning ms-1'>
            Cancel
          </Link>
          {movie.id > 0 && (
            <a
              href='#!'
              onClick={() => confirmDelete()}
              className='btn btn-danger ms-1'>
              Delete
            </a>
          )}
        </form>
      </Fragment>
    );
  }
}

export default EditMovieFunc;
