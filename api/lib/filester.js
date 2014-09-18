'use strict';
var fs = require('fs');

module.exports = function Filester(dir,files_) {
	files_ = files_ || [];
    
	if (typeof files_ === 'undefined') files_=[];
    
	var files = fs.readdirSync(dir);
    
	for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            filester(name,files_);
        } else {
            files_.push(name);
        }
    }
    
	return files_;
};