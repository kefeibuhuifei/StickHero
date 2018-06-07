"use strict";

var h1global = function(){
    this.ctor();
};

h1global.ctor = function() {
    this.curUIMgr = undefined
    this.entityManager = undefined
    this.reconnect = false;
};

h1global.runScene = function(scene){
    cc.director.runScene(scene);
    h1global.curScene = scene;
};
