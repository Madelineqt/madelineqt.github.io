import Axios from 'axios'

export default async function borrarPost(post){
    const url = `${window.location.protocol}//${window.location.hostname}:4000/api/posts/${post._id}`
    Axios.delete(url, post._id)
    return
}