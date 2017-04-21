const graphql = require("graphql");
const gql = require("graphql-tag").default;
const extractComments = require("multilang-extract-comments");

const getCommentsASTFromString = (str) => {
  return extractComments(str);
}

const getObjectKeys = (obj) => {
  return Object.keys(obj)
}
const isString = (str) => {
  return Object.prototype.toString.call(str) == '[object String]'
}


function toGQL(str) {
  if (str.indexOf("ws") < 0) {
    return false;
  }
  return gql`{${str}}`;
}
function isGQLObject(obj) {
  return obj && typeof obj.kind !== "undefined";
}
function isWorkshopGQLObject(obj) {
  // Pretty strict selector
  return (
    isGQLObject(obj) &&
    obj.kind === "Document" &&
    obj.definitions &&
    obj.definitions[0] &&
    obj.definitions[0].kind === "OperationDefinition" &&
    obj.definitions[0].selectionSet &&
    obj.definitions[0].selectionSet.kind === "SelectionSet" &&
    obj.definitions[0].selectionSet.selections &&
    obj.definitions[0].selectionSet.selections[0] &&
    obj.definitions[0].selectionSet.selections[0].name &&
    obj.definitions[0].selectionSet.selections[0].name.kind==="Name" &&
    obj.definitions[0].selectionSet.selections[0].name.value==="ws"
  );
}

function getScalarValue(node) {
  return node.value;
}

function getListValues(node) {
  return node.value.values;
}

function getWorkshopRoot(node) {
  return node.definitions[0].selectionSet;
}

function getValue(node) {
  const scalarValue = getScalarValue(node);
  return scalarValue ? scalarValue : getListValues(node);
  return node.value && node.value.value ? getScalarValue : node.value.values;
}
function getName(node) {
  return node.name;
}
function getArgument(node, i=0) {
  return node.selections[0].arguments[i]
}

function lexer(str) {
  if(!isString(str)) { throw Error('Lexer cannot process non-strings.') }
  const commentsAST = getCommentsASTFromString(str);
  const commentsKeys = getObjectKeys(commentsAST);
  const numCommentsKeys = commentsKeys.length;

  console.log("================");
  console.log("LEXER DETECTED " + numCommentsKeys + " TOTAL COMMENTS.");
  console.log("================\n");

  const remaining = commentsKeys.reduce((a, key, index) => {

    const commentASTNode = commentsAST[key];
    const commentASTNodeContentAsString = commentASTNode.content;
    const parsedCommentObject = toGQL(commentASTNodeContentAsString);
    const commentIsWorkshopObject = isWorkshopGQLObject(parsedCommentObject);

    // It isn't even gql, ignore it
    if(!parsedCommentObject) {
      console.log('IGNORING COMMENT #' + index + ' (NO GQL FOUND)');
      return a;
    }

    // It is valid gql but no query with ws() found in the root query
    if(!commentIsWorkshopObject) {
      console.log('IGNORING COMMENT #' + index + ' (GQL FOUND, BUT NOT WORKSHOP RELATED, ws() directive missing)');
      return a;
    }
    const commentRoot = getWorkshopRoot(parsedCommentObject);
    const nextCommentKey = commentsKeys[index + 1];
    const  nextCommentASTNodeContentAsString = commentsAST[nextCommentKey] &&
      commentsAST[nextCommentKey].content;
    const current = {
      command: getArgument(commentRoot, 0).name.value,
      value: getValue(getArgument(commentRoot)),
      ast: commentASTNode,
    }
    let next;
    console.log("PROCESSING COMMENT #" + index);
    console.log("\n  Current Comment");
    console.log("\n  " + commentASTNodeContentAsString + "\n");
    console.log("    " + (commentIsWorkshopObject ? "V" : "Inv") + "alid workshop GQL object.");
    console.log("    First argument:", current.command);
    console.log("    First value:", current.value);
    console.log("    AST:", current.ast);

    if (index + 1 === numCommentsKeys) {
      // No more comments after this
      console.log("\n    LAST COMMENT DETECTED");
    } else {
      // Will be more comments
      // nextComment = commentsAST[nextKey];
      console.log('\n........................................ ')
      console.log('\n  Next Comment\n')

      const nextObject = toGQL(nextCommentASTNodeContentAsString);
      const nextRoot = getWorkshopRoot(nextObject);
      next = {
        object: nextObject,
        isWorkshopObject: isWorkshopGQLObject(nextObject),
        root: nextRoot,
        content: nextCommentASTNodeContentAsString,
        command: getName(getArgument(nextRoot, 0)).value,
        value: getValue(getArgument(nextRoot, 0))
      };
      console.log('  ' + next.content + '\n');
      console.log(
        "    Next comment is Workshop GQL object? ",
        next.isWorkshopObject
      );
      console.log('    First argument: ', next.command)
      console.log('    First value: ', next.value, '\n')
    }
    return [...a, {
      current,
      next
    }]

    console.log("\n--------\n");
  }, []);

  console.log("================");
  console.log("LEXER KEPT " + (remaining.length) + " of " + numCommentsKeys + " COMMENTS.");
  console.log("================\n");

  return remaining;
}

module.exports = lexer;
