var info = require ('../lib/info');

var data = require ('../lib/imgdata');



console.log(new Date());
data(__dirname + '\\..\\in\\test.pdf')
    .then(res =>  {
        console.log(new Date());
        console.info(res);
    })
    .catch(err => console.error(err));


