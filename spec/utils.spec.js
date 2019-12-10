const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('should return an empty array when passed an empty array', () => {
    expect(formatDates([])).to.deep.equal([]);
  });
  it('When passed an array containing an object with a "created_at" parameter with a UNIX timestamp value, converts that parameter to a javascript date object and returns a new array', () => {
    const dataObject = [{
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: 1289996514171,
    }];
    const input = formatDates(dataObject);
    const actual = [{
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: new Date(1289996514171)
    }];
    expect(input).to.deep.equal(actual);
  });
  it('When passed an array containing objects with "created_at" parameters with UNIX timestamp values, converts those parameters to javascript date objects and returns a new array.', () => {
    const timeStamps = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      }
    ]
    const input = formatDates(timeStamps);
    const actual = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1289996514171)
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: new Date(1163852514171)
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: new Date(1037708514171)
      }
    ];
    expect(input).to.deep.equal(actual);
  });
  it('Returns a new array and should not mutate the original input array', () => {
    const input = [{
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: new Date(1289996514171)
    }];
    expect(formatDates(input)).to.not.equal(input); //check memory references are different.
    expect(input).to.deep.equal([{
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: new Date(1289996514171)
    }]); //check value is same.
  })
});

describe('makeRefObj', () => {
  it('should return an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it('should return a reference object with a single article title-article_id key-value pair when passed an array containing one article object', () => {
    let articleArray = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: "2016-08-18T12:07:52.389Z"
      }
    ];
    let input = makeRefObj(articleArray);
    let actual = { "Running a Node App": 1 };
    expect(input).to.deep.equal(actual);
  });
  it('should return a reference object with many key-value pairs when passed an array of many objects', () => {
    let articleArray = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: "2016-08-18T12:07:52.389Z"
      },
      {
        article_id: 2,
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body: 'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: "2017-07-20T20:57:53.256Z"
      },
      {
        article_id: 3,
        title: '22 Amazing open source React projects',
        body: 'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
        votes: 0,
        topic: 'coding',
        author: 'happyamy2016',
        created_at: "2017-07-21T17:54:10.346Z"
      }
    ];
    const input = makeRefObj(articleArray);
    const actual = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3
    };
    expect(input).to.deep.equal(actual);
  });
  it('Returns a new array and does not mutate the input array', () => {
    const input = [{
      article_id: 3,
      title: '22 Amazing open source React projects',
      body: 'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      votes: 0,
      topic: 'coding',
      author: 'happyamy2016',
      created_at: "2017-07-21T17:54:10.346Z"
    }];
    expect(makeRefObj(input)).to.not.equal(input);
    expect(input).to.deep.equal([{
      article_id: 3,
      title: '22 Amazing open source React projects',
      body: 'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      votes: 0,
      topic: 'coding',
      author: 'happyamy2016',
      created_at: "2017-07-21T17:54:10.346Z"
    }]);
  })
});

describe('formatComments', () => {
  it('should return an empty array when passed an empty array and a reference object', () => {
    expect(formatComments([], {})).to.deep.equal([]);
  });
  describe('formatting objects in the array', () => {
    const commentArr = [
      {
        body: 'Fruit pastilles',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1132922163389,
      }
    ];
    const refObj = {
      "Living in the shadow of a great man": 10
    };
    const expected = formatComments(commentArr, refObj)[0]; //checking first object inside returned array
    it('should rename the "created_by" key to "author"', () => {
      expect(expected).to.include.all.keys('author')
      expect(expected).to.not.have.any.keys('created_by')
    })
    it('should rename the "belongs_to" key to "article_id, with a value corresponding to the id of the article specified', () => {
      expect(expected).to.include.all.keys('article_id')
      expect(expected).to.not.have.any.keys('belongs_to')
      expect(expected.article_id).to.equal(10);
    })
    it('should convert the "created_at" key value to a javascript date object', () => {
      const newTime = new Date(commentArr[0].created_at);
      expect(expected.created_at).to.deep.equal(newTime);
    })
    it('the remaining object properties (body, votes) should be unchanged', () => {
      expect(expected).to.have.all.keys(['body', 'article_id', 'author', 'votes', 'created_at']);
    })
  })
  it('when passed an array of a single comment object and a reference object, should be able to return a new array containing a new formatted comment object', () => {
    const input = [
      {
        body: 'Fruit pastilles',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1132922163389,
      }
    ];
    const refObj = { 'Living in the shadow of a great man': 10 }
    const expected = formatComments(input, refObj);
    const actual = [
      {
        body: 'Fruit pastilles',
        article_id: 10,
        author: 'icellusedkars',
        votes: 0,
        created_at: new Date(1132922163389),
      }
    ]
    expect(expected).to.deep.equal(actual);
  })
  it('when passed an array of comment objects and a reference object, returns a new array containing new formatted comment objects', () => {
    const input = [
      {
        body: 'Fruit pastilles',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1132922163389,
      },
      {
        body:
          'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'icellusedkars',
        votes: 16,
        created_at: 1101386163389,
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389,
      }
    ];
    const refObj = {
      'Living in the shadow of a great man': 10,
      'UNCOVERED: catspiracy to bring down democracy': 5
    };
    const expected = formatComments(input, refObj);
    const actual = [
      {
        body: 'Fruit pastilles',
        article_id: 10,
        author: 'icellusedkars',
        votes: 0,
        created_at: new Date(1132922163389),
      },
      {
        body:
          'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
        article_id: 5,
        author: 'icellusedkars',
        votes: 16,
        created_at: new Date(1101386163389),
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        article_id: 5,
        author: 'butter_bridge',
        votes: 1,
        created_at: new Date(1069850163389),
      }
    ];
    expect(expected).to.deep.equal(actual);
  });
  it('should return a new array and not mutate the original input array', () => {
    const input = [
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389,
      }
    ];
    const refObj = { 'UNCOVERED: catspiracy to bring down democracy': 5 }
    expect(formatComments(input, refObj)).to.not.equal(input);
    expect(input).to.deep.equal([
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389,
      }
    ])
  })
});