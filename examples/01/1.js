
const NeDB = require('nedb');
const path = require('path');

const feathers = require('feathers');
const service = require('feathers-nedb');

const app = feathers()
  .configure(user);

const users = app.service('users');

Promise.all([
  users.create({ name: 'Jane Doe', email: 'jane.doe@gmail.com' }),
  users.create({ name: 'John Doe', email: 'john.doe@gmail.com' }),
  users.create({ name: 'Judy Doe', email: 'judy.doe@gmail.com' })
])
  .then(results => {
    console.log('Jane Doe item\n', results[0]);
    console.log('John Doe item\n', results[1]);
    console.log('Judy Doe item\n', results[2]);
    
    users.find()
      .then(results => console.log('find all items\n', results))
  })
  .catch(err => console.log(err));

function user() {
  const app = this;

  const db = new NeDB({
    filename: path.join('examples', 'data', 'users.db'),
    autoload: true
  });

  app.use('users', service({ Model: db }));
}
