var StartUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/StartUI.json";
    },
    initUI: function () {
        // re-scale background image
        var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);
        //
    },

    show_score: function (score) {
        if (score < 0) {
            return;
        }
        var self = this;
        this.show(function () {
            var start_btn = self.rootUINode.getChildByName("start_btn");
            var score_fnt = self.rootUINode.getChildByName("score_fnt");

            start_btn.setVisible(true);
            score_fnt.setVisible(true);

            var score_fnt = self.rootUINode.getChildByName("score_fnt");
            score_fnt.setString(score);

            var max_score = cc.sys.localStorage.getItem("MAX_SCORE");
            if (!max_score) {
                max_score = 0;
            }

            if (score > max_score) {
                max_score = score;
                cc.sys.localStorage.setItem("MAX_SCORE", score);
            }

            var max_score_label = self.rootUINode.getChildByName("max_score_label");
            max_score_label.setString("最高成绩："+max_score);

            start_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.runScene(new GameScene());
                }
            });
        })
    },

});