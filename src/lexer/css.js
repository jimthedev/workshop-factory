var _ = require('lodash');

var css = require('css');

const isComment = (node) => { return node && node.type==='comment'; };

function traverseForComments(tree) {
  const { declarations, rules } = tree;

  // console.log('RULES:', rules ? rules.length : 0);
  // console.log('DECLARATIONS:', declarations ? declarations.length : 0);

  // if(rules && rules[1]) console.log(isComment(rules[1]));

  const childRules = rules && rules.length > 0 ? rules.reduce((rulesA, rulesV, rulesI) => {

    if(isComment(rulesV)) {
      // Comment detected
      return rulesA.concat([rulesV]);
    } else {
      // Recurse
      return rulesA.concat(traverseForComments(rulesV));
    }

  }, []) : [];

  const childDeclarations = declarations && declarations.length > 0 ? declarations.reduce((declarationsA, declarationsV, declarationsI) =>{
    if(isComment(declarationsV)) {
      // Comment
      return declarationsA.concat([declarationsV]);
    } else {
      // Recurse
      return declarationsA.concat(traverseForComments(declarationsV));
    }
  }, []) : [];

  let childComments = childDeclarations.concat(childRules);
  return childComments;
}

const getComments = (str) => {

  // Parse
  const ast = css.parse(str);

  // Find comments
  const nestedComments = traverseForComments(ast.stylesheet);

  // Flatten
  const comments = _.flattenDeep(nestedComments);

  return comments;
}

module.exports = getComments;
