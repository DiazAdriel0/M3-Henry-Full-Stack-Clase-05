const express = require("express");

let publications = [];

const server = express();

server.use(express.json());

/* server.get("/posts", (req,res) => {
    res.status(200).send("Posts")
}) */

let id = 0 
server.post("/posts", (req,res) => {
    const {author, title, contents} = req.body
    if(author && title && contents){
        const publicacion = {
            id: ++id,
            author,
            title,
            contents,
        }
        publications.push(publicacion)
        res.status(200).json(publicacion)
    }else{
        const error = {error: "No se recibieron los parámetros necesarios para crear la publicación"}
        res.status(400).json(error)
    }
})

server.get("/posts", (req,res) => {
    const { author, title } = req.query
    if (author && title) {
        let publicationsFound = publications.filter(publication => publication.author === author && publication.title === title)
        if(publicationsFound.length > 0) res.status(200).send(publicationsFound) 
        else{
            const error = {error: "No existe ninguna publicación con dicho título y autor indicado"}
            res.status(400).json(error)
        }
    }
    res.status(200).send(publications)
})

server.get("/posts/:author", (req,res) => {
    const {author} = req.params
    const pubsOfAuthor = publications.filter(publication => publication.author === author)
    if (pubsOfAuthor.length > 0) res.status(200).send(pubsOfAuthor)
    else res.status(400).json({error: "No existe ninguna publicación del autor indicado"})
})

server.put("/posts/:id", (req,res) => {
    const {id} = req.params
    const {title, contents} = req.body
    if (title && contents){
        let postToBeModified = publications.find(publication => publication.id === Number(id))
        if (postToBeModified){
            postToBeModified = {
                ...postToBeModified,
                title: title,
                contents: contents,
            }
            res.status(200).json(postToBeModified)
        }
    }else{
        res.status(400).json({error: "No se recibieron los parámetros necesarios para modificar la publicación"})
    }
    res.status(400).json({error: "No se recibió el id correcto necesario para modificar la publicación"})
})

server.delete("/posts/:id", (req,res) => {
    const {id} = req.params
    if(id){
        const filteredPublications = publications.filter(publication => publication.id !== Number(id))
        if(filteredPublications.length < publications.length){
            publications = filteredPublications
            res.status(200).json({ success: true })
        }else{
            res.status(400).json({error: "No se recibió el id correcto necesario para eliminar la publicación"})
        }
    }else{
        res.status(400).json({error: "No se recibió el id de la publicación a eliminar"})
    }
})

//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
