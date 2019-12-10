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

});
