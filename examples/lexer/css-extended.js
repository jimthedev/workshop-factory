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
  /*
    I am after it all
   */
`;

const getCSSComments = require('../../src/lexer/css')

const cssComments = getCSSComments(cssString)

console.assert(cssComments.length === 14);

console.log(cssComments);
