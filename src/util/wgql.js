const graphql = require("graphql");
const gql = require("graphql-tag").default;

module.exports = {
  toGQL,
  isGQLObject,
  isWorkshopGQLObject
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
