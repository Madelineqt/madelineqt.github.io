import React from 'react';
import { Link } from 'react-router-dom'
import stringTocolor from 'string-to-color'

export default function Avatar({ usuario }) {
   return (
    <div className="Avatar">
        <ImagenAvatar usuario={usuario} />

        <Link to={`/perfil/${usuario.username}`}><h2>{usuario.username}</h2></Link>

    </div>    
   )

}

export function ImagenAvatar({ usuario }) {
    let tieneFoto
    if (!usuario.imagen){
        tieneFoto = false
    } else {
        tieneFoto = true
    }
    const style = {
        backgroundImage: tieneFoto === true ? `url(${window.location.protocol}//${window.location.hostname}:4000${usuario.imagen})` : null,
        backgroundColor: stringTocolor(usuario.username)
    }

    return <div className="Avatar__img" style={style}></div>
}
