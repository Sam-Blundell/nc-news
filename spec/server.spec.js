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
            expect(topic).to.include.all.keys(['slug', 'description']);
          })
        })
    });
    it('Status:405: Method Not Allowed. Should respond with "method not allowed" when an invalid http request method is sent', () => {
      const invalidMethods = ['put', 'delete', 'patch', 'post'];
      const methodPromises = invalidMethods.map((method) => {
        return request(server)[method]('/api/topics')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      })
      return Promise.all(methodPromises);
    })
  });
  describe('/users', () => {
    describe('/:username', () => {
      it('GET:200, should respond with a user object that has keys "username", "avatar_url", and "name"', () => {
        return request(server).get('/api/users/icellusedkars')
          .expect(200)
          .then(response => {
            expect(response.body.user).to.be.an('object');
            expect(response.body.user).to.have.all.keys(['username', 'avatar_url', 'name']);
          })
      });
      it('Status:404: Not Found. Should respond with "User Not Found" when receives a valid query that doesnt exist in the database', () => {
        return request(server).get('/api/users/noface')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('User Not Found');
          })
      });
      it('Status:405: Method Not Allowed. Should respond with "Method Not Allowed when an invalid http request is sent', () => {
        const invalidMethods = ['put', 'patch', 'post', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(server)[method]('/api/users/:username')
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal('Method Not Allowed');
            })
        })
        return Promise.all(methodPromises);
      });
    });
  });
});
