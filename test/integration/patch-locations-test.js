const { assert } = require('chai');
const supertest = require('supertest');
const applicationServer = require('../../lib/application');
const fixtures = require('../fixtures');
const survivorsModels = require('../../lib/survivors/survivors-models');

let app;

describe('Testes de atualização de localização', () => {
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
    it('Sucesso ao atualizar localização de um sobrevivente', (done) => {
      const survivorFixture = fixtures.createSurvivor();
      const body = fixtures.bodyPatchcLocation({ longitude: 1, latitude: 2 });


      fixtures.populateSurvivors(survivorFixture, (error) => {
        assert.isNull(error);

        supertest(app)
          .patch(`/locations/${survivorFixture.name}`)
          .send(body)
          .end((err, data) => {
            survivorsModels.findOne({ name: survivorFixture.name }, (errFind, survivor) => {
              assert.isNull(err);
              assert.isNull(errFind);
              assert.strictEqual(200, data.statusCode);
              assert.strictEqual(survivor.location.longitude, 1);
              assert.strictEqual(survivor.location.latitude, 2);
              assert.strictEqual(survivor.traceLocation.length, 2);
              assert.isDefined(survivor.location.timestamp);
              done();
            });
          });
      });
    });

    describe('Testes de erro', () => {
      it('Sobrevivente inexistente', (done) => {
        const body = fixtures.bodyPatchcLocation({ longitude: 1, latitude: 2 });

        supertest(app)
          .patch('/locations/teste')
          .send(body)
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(404, data.statusCode);
            done();
          });
      });

      it('Erro de contrato. Falta latitude', (done) => {
        const body = fixtures.bodyPatchcLocation({ longitude: 1, latitude: 2 });
        delete body.latitude;

        supertest(app)
          .patch('/locations/teste')
          .send(body)
          .end((err, data) => {
            assert.isNull(err);
            assert.strictEqual(400, data.statusCode);
            assert.strictEqual('Missing required property: latitude.', data.text);
            done();
          });
      });
    });
  });
});
