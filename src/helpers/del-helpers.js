import Axios from 'axios'

export default async function borrarPost(post){
    const url = `https://clontagram.herokuapp.com/api/posts/${post._id}`
    Axios.delete(url, post._id)
    return
}