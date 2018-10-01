const { assert } = require('chai');
const supertest = require('supertest');
const async = require('async');
const applicationServer = require('../../lib/application');
const fixtures = require('../fixtures');
const db = require('../../lib/commons/db');

let app;

describe('Testes de relatorio', () => {
  beforeEach((done) => {
    applicationServer.start((err, express) => {
      assert.isNull(err);
      app = express;
      done();
    });
  });

  afterEach((done) => {
    db.dropCollections('survivors', (errDb) => {
      assert.isNull(errDb);
      applicationServer.close(done);
    });
  });

  describe('Testes de sucesso', () => {
    it('Sucesso buscar relatorio', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor();

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
          .get('/reports')
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(200, data.statusCode);
            assert.strictEqual(data.body.averageItemsPerSurvivors.water, 1);
            assert.strictEqual(data.body.averageItemsPerSurvivors.food, 1);
            assert.strictEqual(data.body.averageItemsPerSurvivors.medication, 1);
            assert.strictEqual(data.body.averageItemsPerSurvivors.ammunition, 1);
            assert.strictEqual(data.body.lostPoints, 0);
            assert.strictEqual(data.body.survivorsInfected, 0);
            assert.strictEqual(data.body.survivorsNotInfected, 2);
            done();
          });
      });
    });
    it('Relatorio com um infectado', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ isInfected: true });

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
          .get('/reports')
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(200, data.statusCode);
            assert.strictEqual(data.body.averageItemsPerSurvivors.water, 0.5);
            assert.strictEqual(data.body.averageItemsPerSurvivors.food, 0.5);
            assert.strictEqual(data.body.averageItemsPerSurvivors.medication, 0.5);
            assert.strictEqual(data.body.averageItemsPerSurvivors.ammunition, 0.5);
            assert.strictEqual(data.body.lostPoints, 10);
            assert.strictEqual(data.body.survivorsInfected, 1);
            assert.strictEqual(data.body.survivorsNotInfected, 1);
            done();
          });
      });
    });

    it('Relatorio com media de agua maior', (done) => {
      const firstSurvivor = fixtures.createSurvivor();
      const infectedSurvivor = fixtures.createSurvivor({ waterQuantity: 10 });

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
          .get('/reports')
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(200, data.statusCode);
            assert.strictEqual(data.body.averageItemsPerSurvivors.water, 5.5);
            assert.strictEqual(data.body.averageItemsPerSurvivors.food, 1);
            assert.strictEqual(data.body.averageItemsPerSurvivors.medication, 1);
            assert.strictEqual(data.body.averageItemsPerSurvivors.ammunition, 1);
            assert.strictEqual(data.body.lostPoints, 0);
            assert.strictEqual(data.body.survivorsInfected, 0);
            assert.strictEqual(data.body.survivorsNotInfected, 2);
            done();
          });
      });
    });

    it('Nenhum sobrevivente encontrado', (done) => {
      supertest(app)
        .get('/reports')
        .end((err, data) => {
          assert.isNull(err);
          assert.strictEqual(404, data.statusCode);
          assert.strictEqual('Not found survivors', data.text);
          done();
        });
    });
  });
});
