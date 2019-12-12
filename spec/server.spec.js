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
  describe('/articles', () => {
    describe('/:articles-id', () => {
      it('GET:200, when passed a valid article_id that exists in the database, should respond with that article object with the keys: "author", "title", "article_id", "body", "topic", "created_at", "votes", and "comment_count"', () => {
        return request(server).get('/api/articles/1')
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.article).to.have.all.keys(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count'])
          })
      });
      it('GET:404 Not Found. Should respond with "Article Not Found" when receives a valid query that doesnt exist in the database', () => {
        return request(server).get('/api/articles/999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article Not Found');
          })
      });
      it('GET:400 Bad Request. Should respond with "Invalid Article Id" when receives a parameter that isnt an integer', () => {
        return request(server).get('/api/articles/didnthappen')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Article Id');
          })
      });
      it('PATCH:200, when passed an object in the request body with key "inc_votes" with a number value updates the "votes" property in the database for the article specified on the endpoint and responds with the updated article', () => {
        return request(server).patch('/api/articles/1').send({ inc_votes: 10 })
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.article.votes).to.equal(110); //article_id:1 initially has 100 votes.
            expect(response.body.article).to.have.all.keys(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count'])
          })
      })
      it('PATCH:404 Not Found. Should respond with "Article Not Found" when receives a request with a parameter that doesnt exist in the database', () => {
        return request(server).patch('/api/articles/999/').send({ inc_votes: 10 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article Not Found');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Invalid Article Id" when receives a request with a parameter that isnt an integer', () => {
        return request(server).patch('/api/articles/didnthappen').send({ inc_votes: 10 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Article Id');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Invalid Request Body" when receives a valid PATCH request that exists in the database, but with an invalid request body', () => {
        return request(server).patch('/api/articles/1').send({ inc_votes: 'votes' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Request Body')
          })
      })
      it('Status:405 Method Not Allowed. Should respond with "Method Not Allowed when an invalid http request is sent', () => {
        const invalidMethods = ['put', 'post', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(server)[method]('/api/articles/:article_id')
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal('Method Not Allowed');
            })
        })
        return Promise.all(methodPromises);
      });
      describe('/comments', () => {
        it('POST:201', () => {

        });
      });
    });
  });
})
