var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.genre_list = function(req, res, next) {

    Genre.find().sort([['name']])
      .exec(function (err, list_genres) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
      });
      
  };
// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
            Genre.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};

exports.genre_create_get = function(req, res, next) {       
    res.render('genre_form', { title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Genre name must be specified.'),
    // Sanitize fields.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('genre_form', { title: 'Create Genre', genre: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var genre = new Genre(
                {
                    name: req.body.name,
                    
                });
            genre.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(genre.url);
            });
        }
    }
];
// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};