import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    //user de params y de jwt, los comparo
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id, // encuentro y actualizo el user por id
        {
          $set: req.body, // seteo nuevo user que me envian por body
        },
        { new: true } //devueve la actualizacion
      );
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  } else return next(res.status(404).json("You can update only your account"));
};

export const deleted = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    //user de params y de jwt, los comparo
    try {
      await User.findByIdAndDelete(req.params.id); // encuentro el user y lo elimino
      res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  } else return next(res.status(404).json("You can delete only your account"));
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id) // obtengo el usuario por su id
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
};

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, // este es nuestro user
            {
            $push:{subscribedUsers:req.params.id} // este es el user del suscriptor
        })

        await User.findByIdAndUpdate(req.params.id, { $inc:{subscribers: 1}}) // aumento la cantidad de subs

        res.status(200).json('Now you are subscriptor 😁')
    } catch (error) {
        next(error)
    }
};

export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, // este es nuestro user
        {
        $pull:{subscribedUsers:req.params.id} // este es el user del suscriptor
    })

    await User.findByIdAndUpdate(req.params.id, { $inc:{subscribers: 1}}) // disminuyo la cantidad de subs

    res.status(200).json('You are not more a subscriptor 😢 ')
    } catch (error) {
        next(error)
    }
};

export const like = async (req, res, next) => {

      const id = req.user.id
      const videoId=req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId,{
          //addToSet para que el like se ponga una sola vez, y no se repita
          $addToSet:{like:id},
          $pull:{dislike:id}
        })
        res.status(200).json('Thanks for the like😁')
    } catch (error) {
        next(error)
    }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id
  const videoId=req.params.videoId
try {
    await Video.findByIdAndUpdate(videoId,{
      //addToSet para que el like se ponga una sola vez
      $addToSet:{dislike:id},
      $pull:{like:id}
    })
    res.status(200).json('Thanks for the dislike😢')
    } catch (error) {
        next(error)
    }
};
