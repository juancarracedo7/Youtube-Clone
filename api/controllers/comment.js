import Comment from '../models/Comment.js'
import Video from '../models/Video.js'

export const addComment = async(req,res,next) => {
    const newCommet = new Comment({userId:req.user.id, ...req.body})//agrego un nuevo comentario
    //para agreagr un nuevo comentario necesito el id del video y del usuario, mas el comentario
    try {
        const savedComment = await newCommet.save() // guardo el nuevo comentario
        res.status(200).json(savedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async(req,res,next) => {
    try {
        const comment = await Comment.findById(res.params.id)
        const video = await Video.findById(res.params.id)
        if(req.user.id === comment.userId || req.user.id === video.userId){
             //si es nuestro comentario   O si somos los duenos del video, podemos borrar el comentario
             Comment.findByIdAndDelete(req.params.id)
             res.satus(200).json('comment deleted')
        } else {
            res.status(404).json('only the owner can delete')
        }
    } catch (error) {
        next(error)
    }
}

export const getComments = async(req,res,next) => {
    try {
        const comments = await Comment.find({videoId : req.params.videoId})
        //obtengo los comentarios del video con su videoId
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}