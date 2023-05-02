import React from 'react';
import "./Button.css";

function Button({children, onClick, disabled, typeOfButton, Class}){
    return(
        <button
            type={typeOfButton}
            onClick={onClick}
            disabled={disabled}
            className={Class}
        >{children}</button>
    )
}

export default Button;