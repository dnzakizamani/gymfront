import './Input.css';

const Input = ({
    label,
    error,
    type = 'text',
    id,
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    fullWidth = false,
    className = '',
    ...props
}) => {
    const inputId = id || name;
    const inputClasses = [
        'input',
        error && 'input--error',
        fullWidth && 'input--full',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="input-wrapper">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default Input;
