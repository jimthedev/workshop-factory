const extractComments = require("multilang-extract-comments");

const getJavaScriptComments = (str) => {
  return extractComments(str);
}

module.exports = getJavaScriptComments;
