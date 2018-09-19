const path = require('path');
const {execFile} = require('child_process');
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
    info: function (file, opts = {}){
        let _opts = [];
        if(opts.hasOwnProperty('page')){
            _opts = [ ['-f'], [opts.page], ['-l'] , [opts.page]];
        }else if(opts.hasOwnProperty('pages')){
            _opts = [ ['-f'], [opts.pages.split(':')[0]], ['-l'] , [opts.pages.split(':')[1]]];
        }else if(opts.hasOwnProperty('all')){
            _opts = [ ['-f'], [1], ['-l'] , [-1]];
        }else if(opts.hasOwnProperty('book')){
            // Retourne les informations du livre
            return pdfi(file);
        }else{
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
    cover: function(file, opts){
        console.log(file);
    },

    page: function (file, opts){
        execFile(path.join(popplerPath, 'pdfimages'),[], EXEC_OPTS, (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                reject(error);
            }
            else {  
                resolve()
            }
        });

    },
 
    /**
     *  get page thumbnail
     */
    thumbnail: function(file, opts){

    },

    /** 
     * convert: 
     */
    convert: function(file, opts){

    }




}