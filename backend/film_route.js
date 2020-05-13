const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const filmSchema = new Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  format: { type: String, required: true },
  stars: { type: Array, required: true }
},{
  timestamps: true,
});
const Film = mongoose.model('film', filmSchema);
const router = require('express').Router();

router.route('/').get((req, res) => {
  Film.find()
    .then(film => res.json(film))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const year = Number(req.body.year);
  const format = req.body.format;
  const stars = req.body.stars;
  const newFilm = new Film({
      title,
      year,
      format,
      stars,
  });

  newFilm.save()
    .then(() => res.json('film added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/adding').post((req, res) => {
  var Film = mongoose.model('Film',filmSchema,'films');
  var kino = [];
  console.log(req);
  for (let x = 0; x < req.body.length;x++) {
    var title = req.body[x].title;
    var year = Number(req.body[x].year);
    var format  = req.body[x].format;
    var stars =[];

    for(let y = 0; y < req.body[x].stars.length; y++)
      stars.push(req.body[x].stars[y]);
    var porno = {
      title ,
      year ,
      format, 
      stars
    };
    kino.push(porno);
  }

  Film.collection.insert(kino,function (err,docs){
    if (err) {
      console.log(err);
      res.json(err)
    } else {
      res.json('film added!')
      console.log('film added!');
    }
  });
});


router.route('/update/:id').post((req, res) => {
  Film.findById(req.params.id)
    .then(film => {
      film.title = req.body.title;
      film.year = Number(req.body.year);
      film.format = req.body.format;
      film.stars = req.body.stars;

      film.save()
        .then(() => res.json('film updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Film.findByIdAndDelete(req.params.id)
    .then(() => res.json('film deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Film.findById(req.params.id)
    .then(film => res.json(film))
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;