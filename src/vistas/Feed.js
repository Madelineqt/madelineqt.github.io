import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Main from '../componentes/Main'
import Axios from 'axios'
import Loading from '../componentes/Loading'
import Post from '../componentes/Post'
async function cargarPosts(fechaDelUltimaPost) {
    const query = fechaDelUltimaPost ? `?fecha=${fechaDelUltimaPost}` : ''
    const { data: nuevosPosts } = await Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/posts/feed${query}`)
    return nuevosPosts
}
const NUMERO_DE_POSTS_POR_LLAMADA = 3

export default function Feed({ mostrarError, usuario }) {
    const [posts, setPosts] = useState([])
    const [cargandoPostIniciales, setcargandoPostIniciales] = useState(true)
    const [cargandoMasPosts, setCargandoMasPosts] = useState(false)
    const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false)


    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts()
                setPosts(nuevosPosts)
                setcargandoPostIniciales(false)
                revisarSiHayMasPosts(nuevosPosts)
            } catch (error) {
                mostrarError('Problema cargando la feed')
                console.log(error)
            }
        }
        cargarPostsIniciales()
    }, [mostrarError])

    function actualizarPost(postOriginal, postActualizado) {
        setPosts((posts) => {
            const postsActualizados = posts.map(post => {
                if (post !== postOriginal){
                    return post
                }
                return postActualizado
            })
            return postsActualizados
        })
    }
    async function cargarMasPosts(){
        if (cargandoMasPosts){
            return
        }
        try{
            setCargandoMasPosts(true)
            const fechaDelUltimaPost = posts[posts.length - 1].fecha_creado
            const nuevosPosts = await cargarPosts(fechaDelUltimaPost)
            setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts])
            setCargandoMasPosts(false)
            revisarSiHayMasPosts(nuevosPosts)
        } catch (error) {
            mostrarError("Problema al cargar")
            setCargandoMasPosts(false)
        }
    }
    function revisarSiHayMasPosts(nuevosPosts){
        if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA) {
            setTodosLosPostsCargados(true)
        }
    }
    if (cargandoPostIniciales){
        return (
            <Main center>
                <Loading/>
            </Main>
        )
    }
    if (!cargandoPostIniciales && posts.length === 0){
        return <Main center><NoSiguesANadie/></Main>
    }

    return(
        <Main center>
            <div className="Feed">
                {
                    posts.map(post => (<Post key={post._id} post={post} actualizarPost={actualizarPost} mostrarError={mostrarError} usuario={usuario}/>))
                }
                <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostsCargados} />
            </div>
        </Main>
    )
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                Tu feed no tiene fotos porque no sigues a nadie, o porque no han publicado fotos.
            </p>
            <div className="text-center">
                <Link to='/explore' className='NoSiguesANadie__boton'>Explora Clontagram</Link>
            </div>
        </div>
    )
}

function CargarMasPosts({ onClick, todosLosPostsCargados}) {
    if (todosLosPostsCargados){
        return <div className="Feed__no-hay-mas-posts">No hay más posts</div>
    }
    return (
        <button className="Feed__cargar-mas" onClick={onClick}>Ver más</button>
    )
    }
