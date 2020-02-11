import React, { useState } from 'react';

export default function Comentar({ onSubmitComentario, mostrarError}) {
    const [mensaje, setMensaje] = useState('')
    const [enviandoComentario, setEnviandoComentario] = useState(false)
    async function onSubmit(e) {
        e.preventDefault()
        if (enviandoComentario){
            return
        }
        try {
            setEnviandoComentario(true)
            await onSubmitComentario(mensaje)
            setMensaje('')
            setEnviandoComentario(false)
        } catch (error) {
            setEnviandoComentario(false)
            mostrarError("Hubo un problema enviando el comentario, intenta de nuevo")
        }
    }

    return (
        <form action="" className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input type="text" placeholder='Deja un comentario...' value={mensaje} onChange={e => setMensaje(e.target.value)} required maxLength='180'/>
            <button type="submit">Post</button>
        </form>
    )
} 