const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');
//
const DB = require('./modules/db');

/// DECLARATIONS //////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const app = express();

/// SET UP VIEW ENGINE ////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// explicitly view path becauseit breaks the moment you add a view engine
app.set('views', path.join(__dirname, 'views'));

/// OTHER MIDDLEWARE //////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/// ROUTES ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(indexRoute);
app.use(usersRoute);
app.use(express.static(path.join(__dirname, 'public')));

/// MODULE INITIALIZATION /////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
DB.Initialize();

const listener = app.listen(8080, function () {
  console.log('Listening on port ' + listener.address().port);
});
