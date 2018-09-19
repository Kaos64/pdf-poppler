var tools = require('../lib/tools');

tools.info(__dirname + '\\..\\in\\test.pdf', {'page': '3'})
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    })