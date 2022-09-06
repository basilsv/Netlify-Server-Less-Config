const express = require('express');
mongo = require('mongodb');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/listings').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('patients')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {

        res.status(400).send('Error fetching listings!');
      } else {

        res.json(result);
        
      }
    });
 console.log("Basil");
    let coll = dbConnect.collection('patients');
coll.count().then((count) => {
    console.log("There are following number of collections: ");
    console.log(count);
});
});

// This section will help you create a new record.
recordRoutes.route('/listings/addPatient').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    
    /*listing_id: req.body.id,
    last_modified: new Date(),
    session_id: req.body.session_id,
    direction: req.body.direction,*/
  };

  dbConnect
    .collection('patients')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        console.log(result);
        res.status(204).send();
      }
    });
});



// This section will help you delete a record.
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { "_id": new mongo.ObjectId(req.params.id) };

  dbConnect
    .collection('patients')
    .deleteOne({ _id: new mongo.ObjectId(req.params.id) }, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery._id}!`);
      } else {
        console.log('1 document deleted');
        console.log(listingQuery._id);
        console.log(typeof listingQuery._id);
        console.log(JSON.stringify(listingQuery));
      }
    });
});

module.exports = recordRoutes;
