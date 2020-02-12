import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Main from '../componentes/Main'
import Loading from '../componentes/Loading'
import Avatar from '../componentes/Avatar'
import BotonLike from '../componentes/BotonLike'
import BotonBorrar from '../componentes/Basura'
import RecursoNoExiste from '../componentes/RecursoNoExiste'
import Comentar from '../componentes/Comentar'
import Axios from 'axios'
import {toggleLike, comentar } from '../helpers/post-helpers'
import borrarPost from '../helpers/del-helpers'

export default function PostVista({ history, mostrarError, match, usuario}) {
    const postId = match.params.id
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postNoExiste, setPostNoExiste] = useState(false) 
    const [enviandoLike, setEnviandoLike] = useState(false)
    const [borrando, setBorrando] = useState(false)

    useEffect(() => {
        async function cargarPost() {
          try {
            const { data: post } = await Axios.get(`https://clontagram.herokuapp.com/api/posts/${postId}`);
            setPost(post);
            setLoading(false);
          } catch (error) {
            if (
              error.response &&
              (error.response.status === 404 || error.response.status === 400)
            ) {
              setPostNoExiste(true);
            } else {
              mostrarError('Hubo un problema cargando este post.');
            }
            setLoading(false);
          }
        }
    
        cargarPost();
      }, [postId, mostrarError]);
      
async function onSubmitComentario(mensaje){
    const postActualizado = await comentar(post, mensaje, usuario)
    setPost(postActualizado)
}
function esmipost(){
    return usuario._id === post.usuario._id
    
}
async function onSubmitBorrar(){
    if (borrando){
        return
    }
    try {
        setBorrando(true)
        await borrarPost(post)
        setBorrando(false)
        history.push(`/perfil/${usuario.username}`)
    } catch(error){
        setBorrando(false)
        mostrarError("Error borrando el post")
        console.log(error)
    }
}
async function onSubmitLike() {
    if (enviandoLike){
        return
}
try {
    setEnviandoLike(true)
    const postActualizado = await toggleLike(post)
    setPost(postActualizado)
    setEnviandoLike(false)
} catch (error) {
    setEnviandoLike(false)
    mostrarError("Hubo un problema dandole a like, intenta de nuevo")
    console.log(error)
}}
if (loading) {
    return(
    <Main><Loading /></Main>)
}
if (postNoExiste) {
    return <RecursoNoExiste mensaje="El post que estas intentando ver no existe"></RecursoNoExiste>
}
if (post == null) {
    return null
}
  


    return (
    <Main center>
        <Post {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike} onSubmitBorrar={onSubmitBorrar} esmipost={esmipost}/>
    </Main>)
}

function Post({
    comentarios, caption, url, usuario, estaLike, onSubmitLike, onSubmitComentario, onSubmitBorrar, esmipost
}){
return (
    <div className="Post">
        <div className="Post__image-container">
            <img src={`https://clontagram.herokuapp.com${url}`} alt={caption}/>
        </div>
        <div className="Post__side-bar">
            <Avatar usuario={usuario} />
            <div className="Post__comentarios-y-like">
                <Comentarios usuario={usuario} caption={caption} comentarios={comentarios} />
                <div className="Post__like">
                    <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
                </div>
                {esmipost() && (
                <div className="Post__like">
                    <BotonBorrar onSubmitBorrar={onSubmitBorrar}/>
                </div>
                )}
                <Comentar onSubmitComentario={onSubmitComentario} />
            </div>
        </div>
    </div>
)
}
function Comentarios({usuario, caption, comentarios}){
    return (
        <ul className="Post__comentarios">
            <li className="Post__comentario">
            <Link to={`/perfil.${usuario}`} className="Post__autor-comentario"><b>{usuario.username}</b></Link> {caption}
            </li>
            {
                comentarios.map((comentario) => (
                    <li className="Post__comentario" key={comentario._id}>
                        <Link to={`/perfil.${comentario.usuario.username}`} className="Post__autor-comentario"><b>{comentario.usuario.username}</b> </Link>{comentario.mensaje}
                    </li>
                ))
            }
        </ul>
            )
}