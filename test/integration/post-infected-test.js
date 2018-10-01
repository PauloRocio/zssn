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
    it('Sucesso ao delatar um infectado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor();
      const body = fixtures.bodyPostInfected({
        name: firstSurvivor.name,
        infectedName: infectedSurvivor.name
      });

      async.series([
        (callback) => {
          fixtures.populateSurvivors(firstSurvivor, callback);
        },
        (callback) => {
          fixtures.populateSurvivors(infectedSurvivor, callback);
        }
      ], (error) => {
        assert.isNull(error);

        supertest(app)
          .post('/infected')
          .send(body)
          .end((err, data) => {
            survivorsModels.findOne({ name: infectedSurvivor.name }, (errFind, survivor) => {
              assert.isNull(err);
              assert.isNull(errFind);
              assert.strictEqual(200, data.statusCode);
              assert.isFalse(survivor.isInfected);
              assert.strictEqual(survivor.countInfected, 1);
              assert.strictEqual(survivor.traceRelateInfected.length, 1);
              assert.strictEqual(survivor.traceRelateInfected[0].name, firstSurvivor.name);
              done();
            });
          });
      });
    });
    it('Sucesso ao marcar um sobrevivente como infectado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ countInfected: 2 });
      const body = fixtures.bodyPostInfected({
        name: firstSurvivor.name,
        infectedName: infectedSurvivor.name
      });

      async.series([
        (callback) => {
          fixtures.populateSurvivors(firstSurvivor, callback);
        },
        (callback) => {
          fixtures.populateSurvivors(infectedSurvivor, callback);
        }
      ], (error) => {
        assert.isNull(error);

        supertest(app)
          .post('/infected')
          .send(body)
          .end((err, data) => {
            survivorsModels.findOne({ name: infectedSurvivor.name }, (errFind, survivor) => {
              assert.isNull(err);
              assert.isNull(errFind);
              assert.strictEqual(200, data.statusCode);
              assert.isTrue(survivor.isInfected);
              assert.strictEqual(survivor.countInfected, 3);
              done();
            });
          });
      });
    });
  });
  describe('Testes de erro', () => {
    it('Relator não existe no banco', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ countInfected: 2 });
      const body = fixtures.bodyPostInfected({
        name: firstSurvivor.name,
        infectedName: infectedSurvivor.name
      });

      async.series([
        (callback) => {
          fixtures.populateSurvivors(infectedSurvivor, callback);
        }
      ], (error) => {
        assert.isNull(error);

        supertest(app)
          .post('/infected')
          .send(body)
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(404, data.statusCode);
            done();
          });
      });
    });

    it('Relatando sobrevivente já infectado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ countInfected: 3 });
      const body = fixtures.bodyPostInfected({
        name: firstSurvivor.name,
        infectedName: infectedSurvivor.name
      });

      async.series([
        (callback) => {
          fixtures.populateSurvivors(firstSurvivor, callback);
        },
        (callback) => {
          fixtures.populateSurvivors(infectedSurvivor, callback);
        }
      ], (error) => {
        assert.isNull(error);

        supertest(app)
          .post('/infected')
          .send(body)
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(409, data.statusCode);
            done();
          });
      });
    });

    it('Contrato errado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ countInfected: 3 });
      const body = fixtures.bodyPostInfected({
        name: firstSurvivor.name,
        infectedName: infectedSurvivor.name
      });
      delete body.survivorName;

      supertest(app)
        .post('/infected')
        .send(body)
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(400, data.statusCode);
          assert.strictEqual('Missing required property: survivorName.', data.text);
          done();
        });
    });
  });
});
