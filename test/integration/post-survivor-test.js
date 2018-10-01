const { assert } = require('chai');
const supertest = require('supertest');
const applicationServer = require('../../lib/application');
const fixtures = require('../fixtures');
const survivorsModels = require('../../lib/survivors/survivors-models');

let app;

describe('Testes de inserção de sobreviventes', () => {
  beforeEach((done) => {
    applicationServer.start((err, express) => {
      app = express;
      done();
    });
  });

  afterEach((done) => {
    applicationServer.close(done);
  });

  describe('Testes de sucesso', () => {
    it('Sucesso ao criar um sobrevivente', (done) => {
      const body = fixtures.bodyPostSurvivor();
      supertest(app)
        .post('/survivors')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(200, data.statusCode);
          assert.strictEqual('Inserted survivor with success!', data.text);
          survivorsModels.findOne({ name: body.name }, (error, survivor) => {
            assert.isNull(error);
            assert.strictEqual(body.name, survivor.name);
            assert.strictEqual(body.age, survivor.age);
            assert.strictEqual(body.gender, survivor.gender);
            assert.strictEqual(body.location.latitude, survivor.location.latitude);
            assert.strictEqual(body.location.longitude, survivor.location.longitude);
            assert.strictEqual(survivor.items.water.quantity, 1);
            assert.strictEqual(survivor.items.food.quantity, 1);
            assert.strictEqual(survivor.items.medication.quantity, 1);
            assert.strictEqual(survivor.items.ammunition.quantity, 1);
            assert.isFalse(survivor.isInfected);
            assert.isDefined(survivor.created);
            assert.isDefined(survivor.traceLocation);
            assert.isDefined(survivor.traceRelateInfected);
            done();
          });
        });
    });
  });
  describe('Testes de erro', () => {
    it('Inserindo usuario sem nome', (done) => {
      const body = fixtures.bodyPostSurvivor();
      delete body.name;
      supertest(app)
        .post('/survivors')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(400, data.statusCode);
          assert.strictEqual('Missing required property: name.', data.text);
          done();
        });
    });
  });
});
