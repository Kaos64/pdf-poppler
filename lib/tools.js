const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');

const { execFile } = require('child_process');

const chokidar = require('chokidar');


const EXEC_OPTS = require('./os').exec_options;
let popplerPath = require('./os').path;

const convert = require('./convert');

const pagei = require('./imgdata');
const pdfi = require('./info');


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
        let f, l;

        if (opts.hasOwnProperty('page')) {
            f = l = parseInt(opts.page);
        } else if (opts.hasOwnProperty('pages')) {
            f = parseInt(opts.pages.split(':')[0]);
            l = parseInt(opts.pages.split(':')[1]);
        } else if (opts.hasOwnProperty('all')) {
            f = 1;
            l = -1;
        } else if (opts.hasOwnProperty('book')) {
            // Retourne les informations du livre
            return pdfi(file);
        } else {
            return Promise.reject("Unknonw options");

        }
        const _opts = [
            ['-f'],
            f, ['-l'],
            l
        ];
        console.warn(_opts);
        return new Promise((resolve, reject) => {
            pdfi(file, _opts)
                .then(data => {
                    let pages = {};
                    if (l == -1) {
                        l = parseInt(data.pages);
                    }
                    for (let i = f; i <= l; i++) {
                        let pre = 'page' + `${i}`.padStart(5, '_');
                        const p = data[`${pre}_size`].split('x');
                        pages[`${i}`] = {
                            w: parseFloat(p[0]),
                            h: parseFloat(p[1]),
                            rot: data[`${pre}_rot`]
                        }

                        delete data[`${pre}_size`];
                        delete data[`${pre}_rot`];
                    }
                    data.pages_size = pages;
                    resolve(data);
                }).catch(
                    (err) => {
                        reject(err);
                    }
                );
        });
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

    /**
     * return pdf page au format jpeg / base64
     */
    page: getPage,

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




/**
 * 
 * @param {pdf book filename } file 
 * @param {book page number } page 
 * @param {Options} opts 
 */
function getPage(file, page, opts = {}) {
    return new Promise((resolve, reject) => {

        const out = __buildTemp(page, opts.book_pages);
        const picture = out.file + out.suffix;

        execFile(path.join(popplerPath, 'pdftocairo'), [
            ['-f'],
            [page],
            ['-l'],
            [page],
            ['-jpeg'],
            [file],
            [out.file]
        ], EXEC_OPTS, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(picture);
                /*const base64 = base64_encode(picture);
                setTimeout(() => { fs.unlinkSync(picture) }, 1000);
                resolve(base64);*/
            }
        });
    });
}


/**
 * generating name for temporary page using pdf-poppler
 * @param {number of pages in the book} book_pages 
 */
function __buildTemp(page, book_pages) {
    let ret = {
        file: path.join(os.tmpdir(), crypto.randomBytes(16).toString("hex")),
        suffix: '-' + `${page}`.padStart(`${book_pages}`.length, '0') + '.jpg'
    }
    console.log(`__buildTemp ${ret.file}${ret.suffix}`);
    return ret;
}

function base64_encode(picture) {
    return fs.readFileSync(picture, { encoding: 'base64' });
}