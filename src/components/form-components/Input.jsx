const Input = (props) => {
  return (
    <div className='mb-3'>
      <label htmlFor={props.name} className='form-label'>
        {props.title}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        className={`form-control ${props.className}`}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
};

export default Input;
