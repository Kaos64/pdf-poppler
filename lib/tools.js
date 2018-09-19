const path = require('path');
const { execFile } = require('child_process');

const chokidar = require('chokidar');


const EXEC_OPTS = require('./os').exec_options;
let popplerPath = require('./os').path;

const convert = require('./convert');

const pagei = require('./imgdata');
const pdfi = require('./info');


function tmpfile() {

}

module.exports = {

    /**
     * info get json info of pdf (pages size)...
     * file : filename
     * opts : {
     *      book: if set retour les informations sur le fichier
     *      page : get page information
     *      pages: f:l 
     *      all : get all pages informations 
     * }
     */
    info: function(file, opts = {}) {
        let _opts = [];
        if (opts.hasOwnProperty('page')) {
            _opts = [
                ['-f'],
                [opts.page],
                ['-l'],
                [opts.page]
            ];
        } else if (opts.hasOwnProperty('pages')) {
            _opts = [
                ['-f'],
                [opts.pages.split(':')[0]],
                ['-l'],
                [opts.pages.split(':')[1]]
            ];
        } else if (opts.hasOwnProperty('all')) {
            _opts = [
                ['-f'],
                [1],
                ['-l'],
                [-1]
            ];
        } else if (opts.hasOwnProperty('book')) {
            // Retourne les informations du livre
            return pdfi(file);
        } else {
            return Promise.reject("Unknonw options");

        }
        console.warn(_opts);
        return pagei(file, _opts);
    },

    /**
     * generate cover of book file
     *  file: Filename
     *  opts: {
     *     out: file cover
     *     format: jpeg, png
     *  }
     */
    cover: function(file, opts) {
        console.log(file);
    },

    page: function(file, page, opts = {}) {
        out = __dirname + '\\..\\out\\page';

        console.log(out + '-' + `${page}`.padStart(3, '0') + '.jpg');
        const watcher = chokidar.watch(out + '-' + `${page}`.padStart(3, '0') + '.jpg', { persistent: false });
        watcher.on('add', (event, path) => {
            console.warn(event);
            console.log(path);
            watcher.close();
        })

        return new Promise((resolve, reject) => {
            execFile(path.join(popplerPath, 'pdftocairo'), [
                ['-f'],
                [page],
                ['-l'],
                [page],
                ['-jpeg'],
                [file],
                [out]
            ], EXEC_OPTS, (error, stdout, stderr) => {
                if (error) {
                    //console.error(error);
                    watcher.close();
                    reject(error);
                } else {
                    resolve()
                }

            });
        });

    },

    /**
     *  get page thumbnail
     */
    thumbnail: function(file, opts) {

    },

    /** 
     * convert: 
     */
    convert: function(file, opts) {

    }




}