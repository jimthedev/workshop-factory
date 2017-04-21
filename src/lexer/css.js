var _ = require('lodash');

var css = require('css');

const cssString = `
  /* Before font face */
  @font-face { /* During font face */
    font-family: MyHelvetica; /* In font face */
    src: local("Helvetica Neue Bold"),
      local("HelveticaNeue-Bold"),
      url(MgOpenModernaBold.ttf);
    font-weight: bold;
  }
  @supports (--foo: green) { /* comment during supports {}/\ */
    /*beforemediaquiery*/ @media (max-width: 600px) { /* duringmediaquery */
      .facet_sidebar {
        /* Very deep rule */
        display: none;
      }
    } /* Aftermediaquery */
    body {
      color: green;
    }
    /* SUPPORTS */
  } /* SAME LINE AS CLOSING SUPPORTS */

  /* Heya */
  .myclass { /* Hello there */
    border: 1px solid #fff; /* Yeah me too */
  }
`

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

const ast = css.parse(cssString);

// Recursively find comments
const comments = traverseForComments(ast.stylesheet);

// Flatten
console.log(_.flattenDeep(comments))

console.assert(comments.length === 13);
