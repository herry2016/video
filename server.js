var cluster = require('cluster');
var express = require('express');
var fs = require('fs');

function folderSort(a,b){
  return a.FolderName>b.FolderName ? 1 : -1;
}

function videoSort(a,b){
  return a.VideoName>b.VideoName ? 1 : -1;
}


var WebServer = {
    ThreadCount: require('os').cpus().length,
    Port: 3000,
    Server: undefined,
    WebServer: function(){
        WebServer.Server = module.exports = express.createServer();
    }
}

WebServer.WebServer();

WebServer.Server.configure(function(){
    WebServer.Server.use(express.bodyParser());
    WebServer.Server.use(express.methodOverride());
    WebServer.Server.use(WebServer.Server.router);
    WebServer.Server.use(express.static(__dirname + '/public'));
});

if(cluster.isMaster){
    console.log('starting server on port '+ WebServer.Port + ' with ' + (WebServer.ThreadCount) +' threads');
    console.log('starting server on port '+ (WebServer.Port+1) + ' with ' + (WebServer.ThreadCount) +' threads');

    for(var i=0;i<WebServer.ThreadCount;i++){
        console.log('started thread #'+(i+1))
        cluster.fork();
    }

    cluster.on('death',function(worker){
        console.log('worker' + worker.pid + ' died');
        cluster.fork();
    });
}

else{
    // Serve html files & videos stored in public
    WebServer.Server.listen(WebServer.Port, function(request,response){

    });

    // get a list of folders
    WebServer.Server.get('/ViewFolders',function(req,res){
        fs.readdir('public/videos', function (err, list) {
            var foldersList = [];
            list.forEach(function(file){
                foldersList.push({ FolderName: file });
            });

            foldersList = foldersList.sort(folderSort);

            res.send(foldersList)
        });
    });

    // get the videos in a folder
    WebServer.Server.post('/VideosInFolder', function(req, res) {
        var folderName = req.body.FolderName;
        fs.readdir('public/videos/'+folderName, function (err, list) {
            var videosList = [];
            list.forEach(function(file){
                videosList.push({
                    VideoURL: folderName+'/'+file,
                    VideoName: file
                });
            });

            videosList = videosList.sort(videoSort);

            res.send(videosList)
        });
    });

    WebServer.Server.listen(WebServer.Port+1, function(request,response){

    });
}
