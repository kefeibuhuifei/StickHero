var StartScene = cc.Scene.extend({
    className: "StartScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();
    },

    loadUIManager: function () {
        var curUIManager = new StartSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);

        h1global.curUIMgr = curUIManager;

        var score = cc.sys.localStorage.getItem("SCORE") || 0;

        curUIManager.start_ui.hasPreload = true;
        curUIManager.start_ui.show_score(score);
    },

});