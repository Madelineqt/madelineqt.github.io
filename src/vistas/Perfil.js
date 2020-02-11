import React, { useEffect, useState } from 'react';
import Main from '../componentes/Main'
import Loading from '../componentes/Loading'
import Axios from 'axios'
import Grid from '../componentes/Grid'
import RecursoNoExiste from '../componentes/RecursoNoExiste'
import stringToColor from 'string-to-color'
import toggleSiguiendo from '../helpers/amistad-helpers'
import useEsMobil from './../Hooks/useEsMobil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit as IconoEdit } from '@fortawesome/free-solid-svg-icons'

export default function Perfil({ mostrarError, usuario, match, logout, history}) {
    const username = match.params.username
    const [usuarioDuenoDelPerfil, setUsuarioDuenoDelPerfil] = useState(null)
    const [cargandoPerfil, setCargandoPerfil] = useState(true)
    const [posts, setPosts] = useState([])
    const [perfilNoExiste, setPerfilNoExiste] = useState(false)
    const [subiendoImagen, setSubiendoImagen] = useState(false)
    const [enviandoAmistad, setEnviandoAmistad] = useState(false)
    const esMobil = useEsMobil()

    useEffect(()=>{
        async function cargarPostsYUsuario(){
            try {
                setCargandoPerfil(true)
                const { data: usuario } = await Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/${username}`)
                const { data: posts } = await Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/posts/usuario/${usuario._id}`)
                setUsuarioDuenoDelPerfil(usuario)
                setPosts(posts)
                setCargandoPerfil(false)
            } catch (error){
                if (error.response && (error.response.status === 404 || error.response.status === 400)){
                setPerfilNoExiste(true)
                } else {  
                    mostrarError("Error cargando perfil")
                }
                setCargandoPerfil(false)
            }
        }
        cargarPostsYUsuario()
    }, [username, mostrarError])

function esElPerfilDeLaPersonaLogin(){
        return usuario._id === usuarioDuenoDelPerfil._id
    }

function iraEdicion(){
    history.push(`/editar/${usuario.username}`)
}
async function handleImagenSeleccionada(event){
    try {
        setSubiendoImagen(true)
        const file = event.target.files[0]
        const config = {
            headers:{
                'Content-Type': file.type
            }
        }
        const { data } = await Axios.post(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/upload`, file, config)
        setUsuarioDuenoDelPerfil({...usuarioDuenoDelPerfil, imagen: data.url})
        setSubiendoImagen(false)
    } catch(error){
        mostrarError(error.response.data)
        setSubiendoImagen(false)
        console.log(error)
    }
}
    async function onToggleSiguiendo(){
        if (enviandoAmistad){
            return;
        }
        try {
            setEnviandoAmistad(true)
            const usuarioActualizado = await toggleSiguiendo(usuarioDuenoDelPerfil)
            setUsuarioDuenoDelPerfil(usuarioActualizado)
            setEnviandoAmistad(false)
        } catch (error) {
            mostrarError('Problema al seguir/dejar de seguir, intenta de nuevo')
            setEnviandoAmistad(false)
            console.log(error)


        }
    }
    if (cargandoPerfil){
        return <Main center><Loading /></Main>
    }
    if (perfilNoExiste){
        return  <RecursoNoExiste mensaje="El perfil que estas intentando ver no existe" />
    }
    if (usuario === null ) {
        return null
    }



    return (
        <Main center>
            <div className="Perfil">
                <ImagenAvatar esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin} usuarioDuenoDelPerfil={usuarioDuenoDelPerfil} handleImagenSeleccionada={handleImagenSeleccionada} subiendoImagen={subiendoImagen}></ImagenAvatar>
            
            <div className="Perfil__bio-container">
                <div className="Perfil__bio-heading">
                    <h2 className="capitalize">{usuarioDuenoDelPerfil.username}</h2>
                    {!esElPerfilDeLaPersonaLogin() && (
                    <BotonSeguir siguiendo={usuarioDuenoDelPerfil.siguiendo} toggleSiguiendo={onToggleSiguiendo}/>
                    )}
                    {esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout}/>}
                    {esElPerfilDeLaPersonaLogin() && <BotonEditar iraEdicion={iraEdicion}/>}
                </div>
                { !esMobil && <DescripcionPerfil usuarioDuenoDelPerfil={usuarioDuenoDelPerfil}></DescripcionPerfil>}
            </div>
            </div>
            { esMobil && <DescripcionPerfil usuarioDuenoDelPerfil={usuarioDuenoDelPerfil}></DescripcionPerfil>}
            <div className="Perfil__separador" />
            { posts.length > 0 ? <Grid posts={posts} /> : <NoHaPosteadoFotos /> }
        </Main>
    )
}

function DescripcionPerfil({usuarioDuenoDelPerfil}){
    return (
        <div className="Perfil__descripcion">
            <h2 className="Perfil__nombre">{usuarioDuenoDelPerfil.nombre}</h2>
            <p>{usuarioDuenoDelPerfil.bio}</p>
            <p className="Perfil__estadisticas">
                <b>{usuarioDuenoDelPerfil.numSiguiendo}</b> Following
                <span className="ml-4">
                    <b>{usuarioDuenoDelPerfil.numSeguidores}</b> Followers
                </span>
            </p>
        </div>
    )
}

function ImagenAvatar({
    esElPerfilDeLaPersonaLogin,
    usuarioDuenoDelPerfil,
    handleImagenSeleccionada,
    subiendoImagen
}){
    let contenido;
    if (subiendoImagen) {
        contenido = <Loading />
    } else if (esElPerfilDeLaPersonaLogin()) {
        contenido = (
            <label className="Perfil__img-placeholder Perfil__img-placeholder--pointer" style={{
                backgroundImage: usuarioDuenoDelPerfil.imagen ? `url(${window.location.protocol}//${window.location.hostname}:4000${usuarioDuenoDelPerfil.imagen})` : null,
                backgroundColor: stringToColor(usuarioDuenoDelPerfil.username)
            }}>
            <input type="file" onChange={handleImagenSeleccionada} className="hidden" name="imagen"/>
            </label>
        )
    } else {
        contenido = (
            <div className="Perfil__img-placeholder" style={{
                backgroundImage: usuarioDuenoDelPerfil.imagen ? `url(${window.location.protocol}//${window.location.hostname}:4000${usuarioDuenoDelPerfil.imagen})` : null,
                backgroundColor: stringToColor(usuarioDuenoDelPerfil.username)
            }

            }></div>
        )
    }
    return <div className="Perfil__img-container">{contenido}</div>
}
function BotonSeguir({siguiendo, toggleSiguiendo}){
    return (
        <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
            { siguiendo ? 'Dejar de seguir' : 'Seguir'}
        </button>
    )

}
function BotonEditar({iraEdicion}){
    return (
        
        
        <button onClick={iraEdicion} className="Perfil__boton-logout"><FontAwesomeIcon icon={IconoEdit}/></button>
        
    )
}

function BotonLogout({logout}){
    return (
        <button onClick={logout} className="Perfil__boton-logout">Logout</button>
    )
}
function NoHaPosteadoFotos(){
    return <p className="text-center">Este usuario no ha posteado fotos</p>
}