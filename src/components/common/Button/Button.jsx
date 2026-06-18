import './Button.css';

const Button = ({
    children,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const classes = [
        'btn',
        variant !== 'default' && `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        fullWidth && 'btn--full',
        iconOnly && 'btn--icon',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes} 
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
