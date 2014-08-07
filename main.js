cc.game.onStart = function(){
  cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);
//	jsb.fileUtils.addSearchPath("");
	var searchPaths = jsb.fileUtils.getSearchPaths();
	for(var i in searchPaths) {
		cc.log("##########" + searchPaths[i]);
	}
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(makeScene(new SceneLogo()));
    }, this);
};
cc.game.run();