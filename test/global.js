const db = require('../lib/commons/db');

before((done) => {
  db.connect('test', done);
});

after((done) => {
  db.dropCollections('survivors', () => {
    db.close(done);
  });
});
