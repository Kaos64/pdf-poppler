var tools = require('../lib/tools');

tools.page(__dirname + '\\..\\in\\test2.pdf', 1)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    })