process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../db/connection.js');
const { server } = require('../server.js');
const chai = require('chai');
const chaiSorted = require('chai-sorted')
chai.use(chaiSorted);

describe('/api', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());
  describe('/topics', () => {
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
      it('GET:404 Not Found. Should respond with "Article Not Found" when receives a valid parameter that doesnt exist in the database', () => {
        return request(server).get('/api/articles/999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article Not Found');
          })
      });
      it('GET:400 Bad Request. Should respond with "Bad Request" when receives a parameter that isnt an integer', () => {
        return request(server).get('/api/articles/didnthappen')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Bad Request');
          })
      });
      it('PATCH:200, when passed an object in the request body with key "inc_votes" with a number value updates the "votes" property in the database for the article specified on the endpoint and responds with the updated article', () => {
        return request(server).patch('/api/articles/1').send({ inc_votes: 10 })
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.article.votes).to.equal(110);
            expect(response.body.article).to.have.all.keys(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes'])
          })
      })
      it('PATCH:200. No Info In Body. when the request body has no info, sends the unchanged comment back to the client', () => {
        return request(server).patch('/api/articles/1').send()
          .expect(200)
          .then(response => {
            expect(response.body.article.votes).to.equal(100);
            expect(response.body.article).to.have.all.keys(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes'])
          })
      })
      it('PATCH:404 Not Found. Should respond with "Article Not Found" when receives a request with a valid parameter that doesnt exist in the database', () => {
        return request(server).patch('/api/articles/999/').send({ inc_votes: 10 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article Not Found');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Bad Request" when receives a request with a parameter that isnt an integer', () => {
        return request(server).patch('/api/articles/didnthappen').send({ inc_votes: 10 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Bad Request');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Invalid Request Body" when receives a valid request that exists in the database, but with an invalid request body', () => {
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
        it('POST:201, when passed an object in the request body with keys "username" and "body" with string values, adds the comment to the database, updates the appropriate tables, and responds with the posted comment', () => {
          return request(server).post('/api/articles/1/comments').send({ username: 'icellusedkars', body: 'first!' })
            .expect(201)
            .then(response => {
              expect(response.body).to.be.an('object');
              expect(response.body.comment).to.have.all.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body'])
            })
        });
        it('POST:404 No Such User. Should respond with "No Such User" when receives a request object with a user that doesnt exist', () => {
          return request(server).post('/api/articles/1/comments').send({ username: 'noface', body: 'sometext' })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Not Found');
            })
        })
        it('POST:400 Bad Request. Should respond with "Invalid Request Body" when receives a valid request that exists in the database but with an invalid request body', () => {
          return request(server).post('/api/articles/1/comments').send({ username: 'icellusedkars', strangeKey: 'strange value' })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Invalid Request Body');
            })
        });
        it('POST:404 No Such Article. Should respond with "Not Found" when receives a request with a valid parameter that doesnt exist in the database', () => {
          return request(server).post('/api/articles/999/comments').send({ username: 'icellusedkars', body: 'I sell used cars' })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Not Found');
            })
        })
        it('GET:200, responds with an array containing all the comments for the specifced article_id. The comments must have keys "comment_id", "votes", "created_at", "author", "body"', () => {
          return request(server).get('/api/articles/1/comments')
            .expect(200)
            .then(response => {
              expect(response.body).to.be.an('object');
              expect(response.body.comments).to.be.an('array')
              response.body.comments.map(comment => {
                expect(comment).to.have.all.keys(['comment_id', 'votes', 'created_at', 'author', 'body'])
              })
            })
        })
        it('GET:200, accepts an optional "sort_by" query that will sort the returned array of results by any valid column, defaulting to created_at', () => {
          return request(server).get('/api/articles/1/comments?sort_by=votes')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('votes', { descending: true });
            })
        });
        it('GET:200, accepts a second optional "order" query that specifies the order (ascending or descending) of the preceeding "sort_by" query, defaulting to descending', () => {
          return request(server).get('/api/articles/1/comments?sort_by=votes&order=asc')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('votes')
            })
        });
        it('GET:404, No Such article_id. Should respond with "No Such article_id" when passed a parameter of a valid article_id that doesnt exist in the database', () => {
          return request(server).get('/api/articles/999/comments')
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("No Such article_id")
            })
        })
        it('GET:200, Should respond with an empty array when passed an article_id that exists in the database but has no comments', () => {
          return request(server).get('/api/articles/2/comments')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.deep.equal([]);
            })
        });
        it('GET:400, Invalid Column. Should respond with "Bad Request" when passed a sort_by query that isnt a valid column', () => {
          return request(server).get('/api/articles/1/comments?sort_by=theSecretColumn')
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal('Bad Request')
            })
        })
        it('GET:200, when passed a valid sort_by query and an order query that isnt either asc or desc, defaults to desc', () => {
          return request(server).get('/api/articles/1/comments?sort_by=author&order=sideways')
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.sortedBy('author', { descending: true })
            })
        })
        it('Status:405 Method Not Allowed. Should respond with "Method Not Allowed when an invalid http request is sent', () => {
          const invalidMethods = ['put', 'delete', 'patch'];
          const methodPromises = invalidMethods.map(method => {
            return request(server)[method]('/api/articles/:article_id/comments')
              .expect(405)
              .then(response => {
                expect(response.body.msg).to.equal('Method Not Allowed');
              })
          })
          return Promise.all(methodPromises);
        });
      });
    });
    it('GET:200, should respond with an array of article objects that have keys "author", "title", "article_id", "topic", "created_at", "votes", "comment_count"', () => {
      return request(server).get('/api/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          response.body.articles.map(article => {
            expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'])
          })
        })
    });
    it('GET:200, accepts an optional "sort_by" query that will sort the returned array of objects by any valid column, defaulting to created_at', () => {
      return request(server).get('/api/articles?sort_by=votes')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy('votes', { descending: true });
        })
    });
    it('GET:200, accepts a second optional "order" query that specifies the order (ascending or descending) of the preceeding "sort_by" query, defaulting to descending', () => {
      return request(server).get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy('votes')
        })
    });
    it('GET:200, accepts an optional "author" query that will filter the returned array of objects by the specified username', () => {
      return request(server).get('/api/articles?author=icellusedkars')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(6);
          response.body.articles.map(articles => {
            expect(articles.author).to.equal('icellusedkars');
          })
        })
    });
    it('GET:200, accepts an optional "topic" query that will filter the returned array of objects by the specified topic', () => {
      return request(server).get('/api/articles?topic=cats')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(1);
          response.body.articles.map(articles => {
            expect(articles.topic).to.equal('cats');
          })
        })
    });
    it('GET:200, returns an array of articles filtered by a "topic" query and an "author" query, sorted by their created_at value, in descending order', () => {
      return request(server).get('/api/articles?topic=mitch&author=rogersop&sort_by=created_at&order=desc')
        .expect(200)
        .then(response => {
          expect(response.body.articles.length).to.equal(2)
          expect(response.body.articles).to.be.sortedBy('created_at', { descending: true });
          response.body.articles.map(articles => {
            expect(articles.topic).to.equal('mitch');
          })
        })
    })
    it('GET:400, Invalid Column. Should respond with "Bad Request" when passed a sort_by query that isnt a valid column', () => {
      return request(server).get('/api/articles?sort_by=notAColumn')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request')
        })
    })
    it('GET:200, when passed a valid sort_by query and an order query that isnt either asc or desc, defaults to desc', () => {
      return request(server).get('/api/articles?sort_by=title&order=sideways')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy('title', { descending: true })
        })
    })
    it('GET:200, when passed a valid author query that exists in the database but if there are no articles written by that author, should return an empty array', () => {
      return request(server).get('/api/articles?author=lurker')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.deep.equal([])
        })
    })
    it('GET:200, when passed a valid topic query that exists in the database but if there are no articles written on that topic, should return an empty array', () => {
      return request(server).get('/api/articles?topic=paper')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.deep.equal([])
        })
    })
    it('GET:404. No Such username. When passed a valid author query that doesnt exist in the database should return "No Such username"', () => {
      return request(server).get('/api/articles?author=noface')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('No Such username')
        })
    })
    it('GET:404. No Such slug. When passed a valid topic query that doesnt exist in the database should respond with "No Such slug"', () => {
      return request(server).get('/api/articles?topic=thejoysoftesting')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('No Such slug')
        })
    })
    it('Status:405 Method Not Allowed. Should respond with "Method Not Allowed when an invalid http request is sent', () => {
      const invalidMethods = ['put', 'delete', 'patch'];
      const methodPromises = invalidMethods.map(method => {
        return request(server)[method]('/api/articles/:article_id/comments')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          })
      })
      return Promise.all(methodPromises);
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      it('PATCH:200, when passed an object in the request body with key "inc_votes" with a number value updates the "votes" property in the database for the comment specified on the endpoint and responds with the updated comment', () => {
        return request(server).patch('/api/comments/1').send({ inc_votes: 4 })
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.comment.votes).to.equal(20);
            expect(response.body.comment).to.have.all.keys(['author', 'comment_id', 'article_id', 'body', 'created_at', 'votes'])
          })
      })
      it('PATCH:200, when passed a request body with no information returns the unchanged comment specified on the endpoint', () => {
        return request(server).patch('/api/comments/1').send()
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.comment.votes).to.equal(16);
            expect(response.body.comment).to.have.all.keys(['author', 'comment_id', 'article_id', 'body', 'created_at', 'votes'])
          })
      })
      it('PATCH:404 Not Found. Should respond with "Comment Not Found" when receives a request with a valid parameter that doesnt exist in the database', () => {
        return request(server).patch('/api/comments/1111111/').send({ inc_votes: 10 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment Not Found');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Bad Request" when receives a request with a parameter that isnt an integer', () => {
        return request(server).patch('/api/comments/howdidthisgethere').send({ inc_votes: 10 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Bad Request');
          })
      });
      it('PATCH:400 Bad Request. Should respond with "Invalid Request Body" when receives a valid request that exists in the database, but with an invalid request body', () => {
        return request(server).patch('/api/comments/1').send({ inc_votes: 'votes' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Request Body')
          })
      })
      it('DELETE:204. Deletes the comment associated with the comment_id', () => {
        return request(server).delete('/api/comments/2')
          .expect(204)
          .then(() => {
            return request(server).get('/api/articles/1')
              .expect(200)
              .then(response => {
                expect(+response.body.article.comment_count).to.equal(12);
              })
          })
      })
      it('DELETE:404 Comment Not Found. Should respond with "Comment Not Found" when receives a request with a valid comment_id that doesnt exist in the database', () => {
        return request(server).delete('/api/comments/99999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment Not Found')
          })
      })
      it('Status:405 Method Not Allowed. Should respond with "Method Not Allowed when an invalid http request is sent', () => {
        const invalidMethods = ['put', 'post'];
        const methodPromises = invalidMethods.map(method => {
          return request(server)[method]('/api/comments/:comment_id')
            .expect(405)
            .then(response => {
              expect(response.body.msg).to.equal('Method Not Allowed');
            })
        })
        return Promise.all(methodPromises);
      });
    })
  });
  it('GET:200, should respond with a JSON describing all the available endpoints on this API', () => {
    return request(server).get('/api')
      .expect(200)
      .then(response => {
        expect(response.body).to.be.an('object')
      })
  });
});