import React, { useEffect, useState } from 'react';
import Main from '../componentes/Main';
import Loading from '../componentes/Loading'
import Axios from 'axios'
import RecursoNoExiste from '../componentes/RecursoNoExiste' 


export default function Editar({ mostrarError, match, usuario, editarperfil, logout, history}) {
    const username = match.params.username
    const [cargandoEdicion, setCargandoEdicion] = useState(true);
    const [editando, setEditando] = useState(false)
    const [perfilNoExiste, setPerfilNoExiste] = useState(false)
    const [edicion, setEdicion] = useState({
        _id: '',
        username: '',
        nombre: '',
        bio: ''
    }) 
    useEffect(()=>{
        async function cargarEdicion(){
            try {
                setCargandoEdicion(true)
                const { data: usuario } = await Axios.get(`https://clontagram.herokuapp.com/api/usuarios/${username}`)
                setEdicion({
                    _id: usuario._id,
                    username: usuario.username,
                    nombre: usuario.nombre,
                    bio: usuario.bio
                })
                setCargandoEdicion(false)
            } catch (error){
                if (error.response && (error.response.status === 404 || error.response.status === 400)){
                setPerfilNoExiste(true)
                } else {  
                    mostrarError("Error cargando perfil")
                }
                setCargandoEdicion(false)
            }
        }
        cargarEdicion()
    }, [username, mostrarError])




    function handleInputChange(e){
        
        setEdicion({
            _id: usuario._id,
            username: document.getElementById("username").value,
            nombre: document.getElementById("nombre").value,
            bio: document.getElementById("bio").value,
            [e.target.name]: e.target.value
        })
        console.log(edicion)
    }
    async function handleSubmit(e){
        e.preventDefault();
        if (editando){
            return
        }
        try {
            setEditando(true)
            await editarperfil(edicion, usuario.username)
            if (edicion.username !== username){
                setEditando(false)
                logout()
            }
            setEditando(false)
            history.push(`/perfil/${usuario.username}`)
        } catch (error){
            setEditando(false)
            mostrarError("error editando el perfil")
            console.log(error)
        }
    }
    
    function esmiperfil(){
        return username === usuario.username
    }
    if (cargandoEdicion){
        return <Main center><Loading /></Main>
    }
    if(perfilNoExiste){
        return  <RecursoNoExiste mensaje="El perfil que estas intentando ver no existe" />
    }
    if (!esmiperfil()){
        return <RecursoNoExiste mensaje="Estas intentando editar un perfil que no es tuyo" />
    }
    
    return(
        <Main center>
            <div className="Signup">
            <div className="FormContainer">
            <h1 className="Form__titulo">Editar perfil</h1>
            <p className="text-sm">*Si cambia de nombre de usuario, se deslogueará de la página</p>
                <br></br>
              <form onSubmit={handleSubmit}>
              <p className="FormContainer__info">
                Username
              </p>
 
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="Form__field"
                  required
                  minLength="3"
                  maxLength="30"
                  onChange={handleInputChange}
                  value={edicion.username}
                />
              <p className="FormContainer__info">
                Nombre y Apellido
              </p>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre y Apellido"
                  className="Form__field"
                  required
                  minLength="3"
                  maxLength="100"
                  onChange={handleInputChange}
                  value={edicion.nombre}
                />
                <p className="FormContainer__info">
                Biografía
              </p>
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder="Cuéntanos de ti..."
                  className="Form__field"
                  required
                  maxLength="150"
                  onChange={handleInputChange}
                  value={edicion.bio}
                />
                
                <button className="Form__submit" type="submit">
                  Editar perfil
                </button>
               
              </form>
            </div>
          </div>
        </Main>
    )
}
    