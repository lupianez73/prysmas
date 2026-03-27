
'use strict';
import Cat from './fotones.model';
import {getImages,getImageToConvert} from './../../utils';
const controller = {};


controller.show = (req, res) => {
    console.log(req)
     const id = req.params.id;
     res.status(200).json({name: 'carlos'})
}


controller.showAll = (req, res) => {
    // const kitty = new Cat({ name: 'Zildjian' });
    // kitty.save().then(() => console.log('meow'));
    
    //body should contain the following keys:
    // { q, imgDominantColor, imgType }

   const opts = req.query;
     
    getImages(opts,'large').then(result => {
        let images = [];
        result.data.items.map((img,i) => {
         
            let imgData = img.pagemap.imageobject;
            console.log(imgData)
            imgData.map(image => {
                if(!image.contenturl || !/^http:|https:/.test(image.contenturl)) return;
                images.push({
                    large:image.contenturl,
                    thumbnail:image.thumbnail
                })
            })
        })
        
         res.status(200).json({images})

    }).catch(err => {
        console.log(err.response)
    })
}

 controller.getImageToConvert = (req,res) => {
    utils.processImages().then((images) => {
          console.log(images)
    })
}


module.exports = controller;