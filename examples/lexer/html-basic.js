const htmlString = `
  <!-- YO -->
  <html>
    <!-- YO -->
  </html>
  <!-- YO -->
`;

const getHtmlComments = require('../../src/lexer/html')

console.log(getHtmlComments(htmlString));
