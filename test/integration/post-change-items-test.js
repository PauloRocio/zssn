const { assert } = require('chai');
const supertest = require('supertest');
const async = require('async');
const applicationServer = require('../../lib/application');
const fixtures = require('../fixtures');
const survivorsModels = require('../../lib/survivors/survivors-models');

let app;

describe('Testes de relatar infectado', () => {
  beforeEach((done) => {
    applicationServer.start((err, express) => {
      assert.isNull(err);
      app = express;
      done();
    });
  });

  afterEach((done) => {
    applicationServer.close(done);
  });

  describe('Testes de sucesso', () => {
    it('Sucesso ao realizar uma troca', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const secondSurvivor = fixtures.createSurvivor({ medicationQuantity: 2 });
      const body = fixtures.bodyPostchangeItems({
        firstName: firstSurvivor.name,
        secondName: secondSurvivor.name
      });

      async.series([
        (callback) => {
          fixtures.populateSurvivors(firstSurvivor, callback);
        },
        (callback) => {
          fixtures.populateSurvivors(secondSurvivor, callback);
        }
      ], (error) => {
        assert.isNull(error);

        supertest(app)
          .post('/changeitems')
          .send(body)
          .end((err, data) => {
            survivorsModels.find({
              name:
                { $in: [firstSurvivor.name, secondSurvivor.name] }
            }, {}, (errFind, survivors) => {
              assert.isNull(err);
              assert.isNull(errFind);
              assert.strictEqual(200, data.statusCode);
              assert.strictEqual(survivors[0].items.water.quantity, 0);
              assert.strictEqual(survivors[0].items.medication.quantity, 3);
              assert.strictEqual(survivors[1].items.water.quantity, 2);
              assert.strictEqual(survivors[1].items.medication.quantity, 0);
              done();
            });
          });
      });
    });
  });
  describe('Testes de erro', () => {
    it('Tentando realizar troca injusta', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const secondSurvivor = fixtures.createSurvivor();
      const body = fixtures.bodyPostchangeItems({
        firstName: firstSurvivor.name,
        secondName: secondSurvivor.name,
        firstQuantity: 10
      });

      supertest(app)
        .post('/changeitems')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(400, data.statusCode);
          done();
        });
    });

    it('Contrato errado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const secondSurvivor = fixtures.createSurvivor();
      const body = fixtures.bodyPostchangeItems({
        firstName: firstSurvivor.name,
        secondName: secondSurvivor.name
      });
      delete body.firstSurvivor.name;
      supertest(app)
        .post('/changeitems')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(400, data.statusCode);
          assert.strictEqual('Missing required property: name.', data.text);
          done();
        });
    });

    it('Sobrevivente naão existe no banco', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const secondSurvivor = fixtures.createSurvivor();
      const body = fixtures.bodyPostchangeItems({
        firstName: firstSurvivor.name,
        secondName: secondSurvivor.name
      });
      supertest(app)
        .post('/changeitems')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(400, data.statusCode);
          done();
        });
    });
  });
});
