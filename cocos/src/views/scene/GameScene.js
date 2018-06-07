// cc.loader.loadJs("src/views/uimanager/LoginSceneUIManager.js")

var GameScene = cc.Scene.extend({
    className: "GameScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();
    },

    loadUIManager: function () {
        var curUIManager = new GameSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);
        h1global.curUIMgr = curUIManager;

        curUIManager.game_ui.show();
    }
});
