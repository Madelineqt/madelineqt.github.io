import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash as trashSolid } from '@fortawesome/free-solid-svg-icons'

export default function BotonBorrar({onSubmitBorrar}) {
    return (
        <button onClick={onSubmitBorrar}>
                    <FontAwesomeIcon icon={trashSolid}></FontAwesomeIcon>
        </button>
    )
}