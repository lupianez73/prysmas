const sharp = require('sharp');



// sharp('./images/1.png')
//   .rotate(180)
//   .resize(300)
//   .flatten()
//   .background('#ff6600')
// //   .overlayWith('./images/2.png', { gravity: sharp.gravity.southeast } )
//   .sharpen()
//   .withMetadata()
// //   .quality(90)
//   .webp()
//   .toBuffer()
//   .then(function(outputBuffer) {
//     // outputBuffer contains upside down, 300px wide, alpha channel flattened
//     // onto orange background, composited with overlay.png with SE gravity,
//     // sharpened, with metadata, 90% quality WebP image data. Phew!
//     console.log(outputBuffer)
//   });


  sharp('images/download.jpg')
  .resize(300, 200)
  .toFile('output.jpg', function(err) {
      console.log(err)
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });

