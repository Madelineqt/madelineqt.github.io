import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Axios from 'axios'
import { setToken, deleteToken, getToken, innitAxiosInterceptors } from './helpers/auth-helpers'
import Nav from './componentes/Nav';
import Loading from './componentes/Loading'
import Error from './componentes/Error'
import Signup from './vistas/Signup'
import Login from './vistas/Login'
import Upload from './vistas/Upload'
import Feed from './vistas/Feed'
import Main from './componentes/Main'
import Post from './vistas/Post'
import Explore from './vistas/Explore'
import Editar from './vistas/EditarPerfil'
import Perfil from './vistas/Perfil'
innitAxiosInterceptors();
export default function App() {
  const [usuario, setUsuario] = useState(null); // no sabemos si hay un usuario autenticado
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      if (!getToken()) {
        setCargandoUsuario(false);
        return;
      }

      try {
        const { data: usuario } = await Axios.get(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/whoami`);
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    }

    cargarUsuario();
  }, []);

  async function login(email, password) {
    const { data } = await Axios.post(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/login`, {
      email,
      password
    });
    setUsuario(data.usuario);
    setToken(data.token);
  }

  async function signup(usuario) {
    const { data } = await Axios.post(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/signup`, usuario);
    setUsuario(data.usuario);
    setToken(data.token);
  }

  async function editarperfil(editado, usuarioaeditar){
    console.log(usuarioaeditar)
    console.log(editado)
    await Axios.put(`${window.location.protocol}//${window.location.hostname}:4000/api/usuarios/${usuarioaeditar}`, editado)
  }

  function logout() {
    setUsuario(null);
    deleteToken();
  }

  function mostrarError(mensaje) {
    setError(mensaje);
  }

  function esconderError() {
    setError(null);
  }

  if (cargandoUsuario) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }
  return (
  <Router>
    <Nav usuario={usuario}/>
    <Error mensaje={error} esconderError={esconderError}/>
    { usuario ? (
    <LoginRoutes mostrarError={mostrarError} usuario={usuario} logout={logout} Editar={Editar} editarperfil={editarperfil}/>
    ) : (
    <LogoutRoutes login={login} signup={signup} mostrarError={mostrarError}/>
    )
    }
  </Router>
  )
}

function LoginRoutes ({ mostrarError, usuario, logout, editarperfil}) {
  return (
    <Switch>
  <Route
  path='/upload/'
  render={props => <Upload {...props} Upload={Upload} mostrarError={mostrarError} usuario={usuario} />}
  />
  <Route
  path='/post/:id'
  render={props => <Post {...props} Post={Post} mostrarError={mostrarError} usuario={usuario} />}
  />
  <Route
  path='/perfil/:username'
  render={props => <Perfil {...props} Perfil={Perfil} mostrarError={mostrarError} usuario={usuario} logout={logout}/>}
  />
   <Route
  path='/editar/:username'
  render={props => <Editar {...props} Editar={Editar} editarperfil={editarperfil} mostrarError={mostrarError} usuario={usuario} logout={logout}/>}
  />
  <Route
  path='/explore'
  render={props => <Explore {...props} Explore={Explore} mostrarError={mostrarError} usuario={usuario} />}
  />
  <Route
  default
  render={props => <Feed {...props} Feed={Feed} mostrarError={mostrarError} usuario={usuario} />}
  />
  
  
  
  
  </Switch>
  )
}

function LogoutRoutes({login, signup, mostrarError }) {
  return (
    <Switch>
  <Route
  path='/login/'
  render={props => <Login {...props} login={login} mostrarError={mostrarError} />}
  />
  <Route 
  render={props => <Signup {...props} signup={signup} mostrarError={mostrarError} />}
  default
  />
  </Switch>
  )
}