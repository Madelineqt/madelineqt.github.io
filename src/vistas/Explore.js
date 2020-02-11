import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Main from '../componentes/Main'
import Loading from '../componentes/Loading'
import { ImagenAvatar } from '../componentes/Avatar'
import Axios from 'axios'
import Grid from '../componentes/Grid'


export default function Explore ({mostrarError}){
    const [posts, setPosts] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function cargarPostsYUsuarios(){
        try{
            const [posts, usuarios] = await Promise.all([
                Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/posts/explore`).then(({ data}) => data),
                Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/explore`).then(({ data}) => data),
            ])
            setPosts(posts)
            setUsuarios(usuarios)
            setLoading(false)
        } catch (error){
            mostrarError("Error al cargar Explore, intenta de nuevo")
            console.log(error);
        }
        }
    cargarPostsYUsuarios()
    },[mostrarError])


    if (loading){
        return (
            <Main center><Loading /></Main>
        )
    }

    return (
        <Main center>
            <div className="Explore__section">
                <h2 className="Explore__title">Descubrir usuarios</h2>
                <div className="Explore__usuarios-container">
                    {
                        usuarios.map(usuario => {
                            return (
                                <div className="Explore__usuario" key={usuario._id}>
                                    <ImagenAvatar usuario={usuario}/>
                                    <p>{usuario.username}</p>
                                    <Link to={`/perfil/${usuario.username}`}>Ver Perfil</Link>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="Explore__section">
                <h2 className="Explore__title">Explorar</h2>
                <Grid posts={posts}/>
            </div>
        </Main>
    )

}