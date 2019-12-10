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
  it('should not mutate the original input array', () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input); //check memory references are different.
    expect(formatDates(input)).to.deep.equal([]); //check value is same.
  })
});

describe('makeRefObj', () => { });

describe('formatComments', () => { });
