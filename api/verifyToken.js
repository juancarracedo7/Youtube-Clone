import jwt from "jsonwebtoken";

export const verifyToken =(req,res, next) => {
    const token = req.cookies.acces_token // obtengo el token que esta en las cookie
    if(!token) {
        return next(res.status(404).json('Token error')) // si no tiene token devuelvo el error
    }

    jwt.verify(token, process.env.JWT, (error, user) =>{  // verifico si el token coincide
        if(error) return next(res.status(404).json('Token error'))
        req.user = user
        next()
    })
}