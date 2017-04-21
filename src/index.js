var lexer = require('./lexer/javascript');

// PROGRESS
// ---------
// [x] LEXER: FIND COMMENTS
// [x] LEXER: KEEP ONLY THE COMMENTS THAT ARE WSGQL.
// [ ] PARSER: SYNTAX TO CHECK FOR UNCLOSED COMMANDS
// [ ] DETERMINE n NUMBER OF STEPS TO CREATE, Min 1 max N.
// [ ] BREAK DOCUMENT INTO FRAGMENTS with an array of steps it should be included in
// [ ] LOOP THROUGH n times, taking only those fragments that need to be included
// [ ] GENERATE N steps in folders (or allow user to generate a directed set of branches instead)

// NOTES
// ------
// - MAKE SURE TO CHECK COMMENT EXTRACTION WITH CSS/ HTML/ ETC.
// - CURRENTLY THE COMMENTS EXTRACTION ALGORITH REQUIRES YOUR COMMENTS TO BE ON THEIR OWN LINE
// - CANNOT STATICALLY ANALYZE

var string = `

// Hello there from comment
console.log('I am not a comment');
// I am another comment

function hello() {
  // I am a comment in a function
  console.log('I am also not a comment')
}

/* notws(show:">1") */

/* ws(show:">1") */

console.log('yoooo'); // ws(end: "show")

// ws(end: "hide")


`;

lexer(string);
