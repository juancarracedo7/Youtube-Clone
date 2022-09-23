import User from '../models/User.js'
import Video from '../models/Video.js'

export const addVideo = async (req, res, next)=>{

    const newVideo = new Video({userId:req.user.id, ...req.body}) //agrego un nuevo video

    try {
        const savedVideo = await newVideo.save()  // guardo el video
        res.status(200).json(savedVideo)
    } catch (error) {
        next(error)
    }
}

export const updateVideo = async (req, res, next)=>{

    try {
        const video = await Video.findById(req.params.id) // encuentr el video por id
       if (!video)  return next('Video not updated') // si no hay video
       if(req.user.id === video.userId){ // si es igual el usuario token y usuario del video
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, //busco y updateo el video
            {
            $set:req.body
        },
        {new:true})
        res.status(200).json(updatedVideo)
       } else {
        res.status(404).json('You can update only your videos')
       }
    } catch (error) {
        next(error)
    }
}

export const deleteVideo = async (req, res, next)=>{

    try {
        const video = await Video.findById(req.params.id) // encuentr el video por id
        if (!video)  return next('Video not updated') // si no hay video
        if(req.user.id === video.userId){ // si es igual el usuario token y usuario del video
        await Video.findByIdAndDelete(req.params.id)
         res.status(200).json('Video deleted')
        } else {
         res.status(404).json('You can delete only your videos')
        }
    } catch (error) {
        next(error)
    }
}

export const getVideo = async (req, res, next)=>{

    try {
        const video = await Video.findById(req.params.id) // obtengo video por id
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}

export const addView = async (req, res, next)=>{

    try {
         await Video.findByIdAndUpdate(req.params.id, { // encuentro video y le incremento 1 view
            $inc:{views:1}
        })
        res.status(200).json('1 more view 😃')
    } catch (error) {
        next(error)
    }
}

export const ramdon = async (req, res, next)=>{

    try {
        const videos = await Video.aggregate([{$sample: {size : 40}}]) // me devuelve un video ramdon, elijo cuantos
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const trend = async (req, res, next)=>{

    try {
        const videos = await Video.find().sort({views:-1})// -1 los mas vistos y 1 los menos(ordenamiento)
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const sub = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const subscribedChannels = user.subscribedUsers;
    //   console.log('subs',subscribedChannels)
  
      const list = await Promise.all(
        subscribedChannels.map(async (channelId) => {
            // console.log('id', channelId)
          return await Video.find({ userId: channelId });
        })
      );
  
      res.status(200).json(list.flat().sort((a,b)=> b.createdAt - a.createdAt));
      // hago un flat para sacarles un array y despues las ordeno con un sort del mas nuevo a mas viejo
    } catch (err) {
      next(err);
    }
  };


  export const getByTags = async (req, res, next)=>{

    const tags = req.query.tags.split(',')
    console.log(tags)
    try {
        const videos = await Video.find({tags:{$in: tags}}).limit(20)
        // el metodo $in busca dentro de array  TAGS algo especifico, en este caso tags que me llega por query
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const getByTitle = async (req, res, next)=>{

    const title = req.query.title
    console.log('title',title)
    try {
        const videos = await Video.find({title: {$regex:title, $options:"i"}}).limit(40)
        // regex es para que cuando coincida una letra aparezca el nombe y la i para que no haya 
        //diferencia de mayusculas con minusculas
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}
