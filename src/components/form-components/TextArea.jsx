const TextArea = (props) => {
  return (
    <div className='mb-3'>
      <label htmlFor={props.name} className='form-label'>
        {props.title}
      </label>
      <textarea
        name={props.name}
        id={props.name}
        rows={props.rows}
        className={`form-control ${props.className}`}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
};

export default TextArea;
