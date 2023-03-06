import React from 'react';
import { Button } from 'antd';
import './components.css';
export function BaseButton(props) {
    const { buttonText, onClick = () => {}, icon } = props;
    return (
        <div className='charge-button' onClick={onClick}>
            {icon}<span style={{'margin-left': '5px'}}>{buttonText}</span>
        </div>
    );

}