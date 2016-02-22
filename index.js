fs = require('fs');
async = require("async");

walk("C:\\Users\\user\\Documents\\entersecure-desktop\\SecureScanAdmin\\Finger",function(err,files){
	var project = {};
	files.forEach(function (path){
		loadFile(project,path);
	});
	console.log(project);
});

function loadFile(project,file){
	var contents = fs.readFileSync(file).toString();
	var rePattern = new RegExp(/class (.*){/);
	var arrMatches = contents.match(rePattern);
	try{
	var clasName = arrMatches[1].split(':')[0].trim();
	var inheritsClass = arrMatches[1].split(':')[1].trim();
	project[clasName] = {};
	if(!project[inheritsClass]){
		project[inheritsClass] = {};
		project[inheritsClass].used = [];
	}
	project[clasName]["inherits"] = {};
	project[clasName]["inherits"][inheritsClass] = project[inheritsClass];
	var tmpfile = {};
	tmpfile[clasName]=project[clasName];
	project[inheritsClass].used.push(tmpfile)
	}catch(err){

	}
}

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};