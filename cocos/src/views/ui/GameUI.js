var GameUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameUI.json";
        this.score = 0;
        this.initWidth = 0;
        this.initHeight = 0;
    },
    initUI: function () {
        var self = this;
        this.game_panel = this.rootUINode.getChildByName("game_panel");
        this.initWidth = this.game_panel.getContentSize().width * 0.2;
        this.initHeight = this.game_panel.getContentSize().height * 0.2;

        //
        this.initPosition();
        //
        this.game_panel.setTouchEnabled(true);
        this.game_panel.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                self.stick = self.drawStick();
                self.game_panel.addChild(self.stick);
                var position = self.run_sprite.getPosition();
                self.stick.setContentSize(cc.size(20, 20));
                self.stick.setPosition(cc.p(position.x + 20, position.y));
                self.stick.setAnchorPoint(cc.p(0.5, 0));
                self.stick.runAction(cc.scaleBy(0.2, 1, 1.2).repeatForever());
            } else if (eventType === ccui.Widget.TOUCH_ENDED || eventType === ccui.Widget.TOUCH_CANCELED) {
                self.game_panel.setTouchEnabled(false);
                self.stick.stopAllActions();
                self.stick.runAction(cc.sequence(
                    cc.spawn(
                        cc.rotateTo(1, 90, 0),
                        cc.moveBy(1, 0, -1)
                    ),
                    cc.callFunc(function () {
                        //
                        var len = self.stick.getBoundingBox().width;
                        UICommonWidget.load_effect_plist("run");
                        self.run_sprite.runAction(
                            cc.sequence(
                                cc.spawn(
                                    UICommonWidget.create_effect_action({
                                        "FRAMENUM": 4,
                                        "TIME": 1,
                                        "NAME": "GameUI/run"
                                    }),
                                    cc.moveBy(1, len + 30, 0)
                                ),
                                cc.callFunc(function () {
                                    if ((self.stick.x + len + 10 ) > self.newRect.dis
                                        && (self.stick.x + len + 10) < (self.newRect.dis + self.newRect.len)) {
                                        if ((self.stick.x + len + 10 ) > (self.newRect.dis + self.newRect.len / 2 - 5)
                                            && (self.stick.x + len + 10) < (self.newRect.dis + self.newRect.len / 2 + 5)) {
                                            self.moveSucc(2);
                                        }else {
                                            self.moveSucc(1);
                                        }
                                        self.game_panel.setTouchEnabled(true);
                                    }
                                    else {
                                        self.run_sprite.runAction(cc.sequence(
                                            cc.moveTo(1, self.run_sprite.x, -self.game_panel.getContentSize().height * 0.2),
                                            cc.callFunc(function () {
                                                cc.sys.localStorage.setItem("SCORE", self.score);
                                                setTimeout(function () {
                                                    h1global.runScene(new StartScene());
                                                },1000);
                                            })
                                        ))
                                    }
                                })
                            )
                        );
                    })
                ));
            }
        });
    },

    initPosition: function () {
        var dots = [
            cc.p(0, 0),
            cc.p(0, this.initHeight),
            cc.p(this.initWidth, this.initHeight),
            cc.p(this.initWidth, 0)
        ];

        this.bgRectOld = this.drawRect(dots);
        this.bgRectOld.setPosition(cc.p(this.initWidth, 0));
        this.game_panel.addChild(this.bgRectOld);

        // 人物
        cc.spriteFrameCache.addSpriteFrames(res.run_plist, res.run_png);
        this.run_sprite = cc.Sprite.create("#GameUI/run1.png");
        this.run_sprite.setAnchorPoint(cc.p(0.5, 0));
        this.run_sprite.setPosition(cc.p(this.bgRectOld.x + this.bgRectOld.getBoundingBox().width / 2, this.initHeight - 10));
        this.game_panel.addChild(this.run_sprite);
        this.CreateNewRect();
    },

    drawRect: function (dots) {
        if (!dots) {
            return;
        }
        var shape = new cc.DrawNode();
        var triangle = dots;
        var black = cc.color(0, 0, 0, 255);
        shape.drawPoly(triangle, black, 3, black);
        shape.setContentSize(cc.size(dots[2].x - dots[0].x, dots[1].y));
        return shape;
    },

    drawStick: function () {
        var dots = [
            cc.p(0, 0),
            cc.p(0, 20),
            cc.p(3, 20),
            cc.p(3, 0)
        ];
        var shape = new cc.DrawNode();
        var triangle = dots;
        var black = cc.color(0, 0, 0, 255);
        shape.drawPoly(triangle, black, 3, black);
        shape.setContentSize(cc.size(3, 20));
        return shape;
    },

    randomXY: function (beforeDis) {
        var random1 = 0;
        var random2 = 0;
        while ((beforeDis + 1000 * (random1 + random2) / 100) > cc.winSize.width || random2 < 8
        || (random1 === 0 && random2 === 0) ) {
            this.score = this.score >= 50 ? 50 : this.score;
            // 距离
            random1 = Math.random() * (100 - this.score) + this.score;
            // 本身宽度
            random2 = Math.abs(Math.random() * 100 - this.score);
        }
        return {dis: random1 * 10 + beforeDis, len: random2 * 10};
    },

    moveSucc: function (flag) {
        var self = this;
        this.bgRectOld.runAction(cc.sequence(
            cc.moveTo(1, -cc.winSize.width / 2, 0),
            cc.callFunc(function () {
                self.bgRectOld.removeFromParent(true);
            })
        ))
        this.stick.removeFromParent();
        this.red_sprite.removeFromParent();
        this.bgRectNew.runAction(cc.sequence(
            cc.moveTo(1, self.initWidth, 0),
            cc.callFunc(function () {
                self.copyDraw();
                self.bgRectNew.removeFromParent();
                self.CreateNewRect();
            })
        ))
        this.run_sprite.runAction(cc.moveTo(1, self.initWidth + self.newRect.len / 2, self.initHeight - 10));

        // 分数
        this.score += flag;
        this.rootUINode.getChildByName("score_fnt").setString(this.score.toString());
    }
    ,

    copyDraw: function () {
        this.bgRectOld = this.drawRect(this.newDots);
        this.game_panel.addChild(this.bgRectOld);
        this.bgRectOld.setPosition(cc.p(this.initWidth, 0));
    },

    CreateNewRect: function () {
        var randomXY = this.randomXY(this.bgRectOld.x + this.bgRectOld.getBoundingBox().width + 20);
        this.newDots = [
            cc.p(0, 0),
            cc.p(0, this.initHeight),
            cc.p(randomXY.len, this.initHeight),
            cc.p(randomXY.len, 0)
        ]
        this.bgRectNew = this.drawRect(this.newDots);
        this.newRect = {dis: randomXY.dis, len: randomXY.len};
        this.game_panel.addChild(this.bgRectNew);
        this.bgRectNew.setPosition(cc.p(this.newRect.dis, 0));

        //
        this.red_sprite = cc.Sprite.create();
        this.red_sprite.setAnchorPoint(cc.p(0.5, 0));
        this.red_sprite.setColor(cc.color(255, 0, 0));
        this.red_sprite.setTextureRect(cc.rect(0, 0, 10, 10));
        this.red_sprite.setPosition(cc.p(this.newRect.dis + this.newDots[2].x / 2, this.initHeight - 10));
        this.game_panel.addChild(this.red_sprite);
    }


});