var tools = require('../lib/tools');
const fs = require('fs');
/*
tools.page(__dirname + '\\..\\in\\test2.pdf', 20, { book_pages: 173 })
    .then(data => {
        //console.log(data);
        fs.writeFileSync(__dirname + '\\..\\out\\test.jpg', data, { encoding: 'base64' });

    })
    .catch(err => {
        console.error(err);
    })


*/

tools.info(__dirname + '\\..\\in\\test.pdf', {
        pages: '10:20'
    })
    .then(data => {
        console.warn(data);
    })
    .catch(err => console.error(err));