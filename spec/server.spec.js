process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../db/connection.js');
const { server } = require('../server.js');

describe('/api', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());
  describe('/topics', () => { //testing for key data types?
    it('GET:200, should respond with an array of topic objects that have keys "slug" and "describe"', () => {
      return request(server).get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics).to.be.an('array');
          response.body.topics.map(topic => {
            expect(Object.keys(topic)).to.deep.equal(['slug', 'description']);
          })
        })
    });
    // it('GET:200, objects in response array should have "slug" and "description" keys', () => {
    //   return request(server).get('/api/topics')
    //     .expect(200)
    //     .then(response => {
    //       response.body.topics.map(topic => {
    //         expect(Object.keys(topic)).to.deep.equal(['slug', 'description']);
    //       })
    //     })
    // })
    it('Status:405, should respond with "method not allowed" when an invalid http request method is sent', () => {
      const invalidMethods = ['put', 'delete', 'patch', 'post'];
      const methodPromises = invalidMethods.map((method) => {
        return request(server)[method]('/api/topics')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('method not allowed');
          });
      })
      return Promise.all(methodPromises);
    })
  });
  describe('/users', () => {
    describe('/:username', () => {
      it('GET:200, should respond with a user object that has keys "username", "avatar_url", and "name"', () => {
        return request(server).get('api/users/:username')
          .expect(200)
          .then(response => {
            expect(response.body.user).to.be.an('object');
          })
      });
    });
  });
});
