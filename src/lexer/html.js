let cheerio = require('cheerio');

// Cheerio has a weird root selector.
// If we try to use the * css selector then it won't
// match comments outside of an html element
const getChildrenFromCheerioRoot = (cheerioInstance) => {
  const root = cheerioInstance.root();

  // Filter out non integer, Cheerio metadata keys in root
  const rootKeys = Object.keys(root).filter(n => n % 1 == 0);

  const rootChildren = rootKeys.map(key => {
    return root[key].children;
  });

  return rootChildren[0];
};

// Recursively get comments from a Cheerio node
const getCommentContents = (a, node) => {
  if(node.type === "comment") {
    return a.concat([node.data]);
  } else if(node.type==="tag" && node.children && node.children.length>0) {
    return a.concat(node.children.reduce(getCommentContents, []));
  } else {
    return a;
  }
};

const getCommentPositions = (str, commentsArray) => {

  // Track the last position we found. We have to go in order
  // because we're making sure to deal with potential duplicates
  // at different positions.
  let lastEndPosition = 0;

  return commentsArray.reduce((a,v,i) => {
    const searchString = '<!--' + v + '-->';
    const startSearchPosition = str.indexOf(searchString, lastEndPosition);
    const endSearchPosition = startSearchPosition + searchString.length;

    // Move forward
    lastEndPosition = endSearchPosition;

    // console.log('LOOKING FOR: ' + searchString);
    // console.log('Found starting at: ' + startSearchPosition);
    // console.log('Found ending at: ' + endSearchPosition);

    return a.concat([{
      content: v,
      start: startSearchPosition,
      end: endSearchPosition
    }]);
  }, []);
}

const getComments = (str) => {

  // Load up cheerio with our html string
  const cheerioInstance = cheerio.load(str, { decodeEntities: false, withStartIndices: true })

  // Gets an ordered list of all comments
  const comments = getChildrenFromCheerioRoot(cheerioInstance).reduce(getCommentContents, []);

  // Finds the positions of the comments
  const commentsWithPositions = getCommentPositions(str, comments);

  return commentsWithPositions;
};

module.exports = getComments;
