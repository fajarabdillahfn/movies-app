import React, { Component, Fragment } from 'react';
import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import TextArea from './form-components/TextArea';

export default class EditMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {
        id: 0,
        title: '',
        release_date: '',
        runtime: '',
        mpaa_rating: '',
        rating: '',
        description: '',
      },
      mpaa_options: [
        { id: 'G', value: 'G' },
        { id: 'PG', value: 'PG' },
        { id: 'PG13', value: 'PG13' },
        { id: 'R', value: 'R' },
        { id: 'NC17', value: 'NC17' },
      ],
      isLoaded: false,
      error: null,
      errors: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    //client side validation
    let errors = [];
    if (this.state.movie.title === '') {
      errors.push('title');
    } else if (this.state.movie.release_date === '') {
      errors.push('release_date');
    } else if (this.state.movie.runtime === '') {
      errors.push('runtime');
    } else if (this.state.movie.mpaa_rating === '') {
      errors.push('mpaa_rating');
    } else if (this.state.movie.rating === '') {
      errors.push('rating');
    } else if (this.state.movie.description === '') {
      errors.push('description');
    }

    this.setState({ errors: errors });

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    console.log(payload);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  handleChange = (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;

    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      },
    }));
  };

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id > 0) {
      fetch('http://localhost:4000/v1/movie/' + id)
        .then((response) => {
          if (response.status !== '200') {
            let err = Error;
            err.Message = 'Invalid response code: ' + response.status;
            this.setState({ error: err });
          }
          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);

          this.setState(
            {
              movie: {
                id: id,
                title: json.movie.title,
                release_date: releaseDate.toISOString().split('T')[0],
                runtime: json.movie.runtime,
                mpaa_rating: json.movie.mpaa_rating,
                rating: json.movie.rating,
                description: json.movie.description,
              },
              isLoaded: true,
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error,
              });
            }
          );
        });
    } else {
      this.setState({ isLoaded: true });
    }
  }

  render() {
    let { movie, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
          <h2>Add/Edit Movie</h2>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input
              type='hidden'
              name='id'
              id='id'
              value={movie.id}
              onChange={this.handleChange}
            />

            <Input
              title={'Title'}
              className={this.hasError('title') ? 'is-invalid' : ''}
              type={'text'}
              name={'title'}
              value={movie.title}
              handleChange={this.handleChange}
              errorDiv={this.hasError('title') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter a title'}
            />

            <Input
              title={'Release Date'}
              className={this.hasError('release_date') ? 'is-invalid' : ''}
              type={'date'}
              name={'release_date'}
              value={movie.release_date}
              handleChange={this.handleChange}
              errorDiv={
                this.hasError('release_date') ? 'text-danger' : 'd-none'
              }
              errorMsg={'Please enter the release date'}
            />

            <Input
              title={'Runtime'}
              className={this.hasError('runtime') ? 'is-invalid' : ''}
              type={'text'}
              name={'runtime'}
              value={movie.runtime}
              handleChange={this.handleChange}
              errorDiv={this.hasError('runtime') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter the runtime in minutes'}
            />

            <Select
              title={'MPAA Rating'}
              className={this.hasError('mpaa_rating') ? 'is-invalid' : ''}
              name={'mpaa_rating'}
              options={this.state.mpaa_options}
              value={movie.mpaa_rating}
              handleChange={this.handleChange}
              placeholder={'Choose...'}
              errorDiv={this.hasError('mpaa_rating') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter the MPAA rating'}
            />

            <Input
              title={'Rating'}
              className={this.hasError('rating') ? 'is-invalid' : ''}
              type={'text'}
              name={'rating'}
              value={movie.rating}
              handleChange={this.handleChange}
              errorDiv={this.hasError('rating') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter the rating'}
            />

            <TextArea
              title={'Description'}
              className={this.hasError('description') ? 'is-invalid' : ''}
              rows={'3'}
              name={'description'}
              value={movie.description}
              handleChange={this.handleChange}
              errorDiv={this.hasError('description') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter a description'}
            />

            <hr />

            <button className='btn btn-primary'>Save</button>
          </form>
        </Fragment>
      );
    }
  }
}