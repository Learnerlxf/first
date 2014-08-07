var LayerBuzhen = cc.Layer.extend({
	_layer:null,//布阵层
	_touchLayer:null,//触摸控制层
	_touchPosition:null,//触摸层的触摸点坐标位置，是世界坐标
	_difTouchPosition:null,
	_isMoving:false,//是否正在拖动人物
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		
		var size = cc.director.getWinSize();

		log.i("init_LayerBuzhen");
		var layer = ccs.uiReader.widgetFromJsonFile("res/buzhen.json");
		this.addChild(layer);
		this._layer = layer;
		
		//触控层
		this._touchLayer = layer.getChildByName("touch_control_layer");
		if (this._touchLayer) {
			cc.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
		}
		this._touchLayer.setTouchEnabled(false);
		this._touchPosition = cc.p(0,0);
				
		//关闭按钮
		var btn_guanbi = ccui.helper.seekWidgetByName(layer, "btn_guanbi");
		btn_guanbi.addTouchEventListener(this.closeEvent,this);
		
		//更新人物位置
		this.updateHeroLocation();

		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: function (touch, event) {	
				var target = event.getCurrentTarget();
				var worldPosition = touch.getLocation();
				target.getParent().getParent().setTouchPosition(worldPosition);
				cc.log("touch layer began");
				return true;
			},
			onTouchMoved:function (touch, event){
				var target = event.getCurrentTarget();
				var worldPosition = touch.getLocation();
				target.getParent().getParent().setTouchPosition(worldPosition);
				target.getParent().getParent().setTouchDiff(touch.getDelta());
				cc.log("touch layer moving");
			},
			onTouchEnded:function (touch, event){
				var target = event.getCurrentTarget();
				var worldPosition = touch.getLocation();
				target.getParent().getParent().setTouchPosition(worldPosition);
				cc.log("touch layer end");
			},
			onTouchCancelled:function (touch, event){

			}
		}, this._touchLayer);

		return true;
	},
	onEnter:function (){
		this._super();
		log.i("LayerBuzhen_OnEnter");
		
	},

	onExit:function (){
		this._super();
		log.i("LayerBuzhen_OnExit");
	},
	
	closeEvent:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {
			this.removeFromParent();
		}
		if (type == ccui.Widget.TOUCH_MOVED) {
		}
	},
	//两个触摸点的位置差
	setTouchDiff:function(pPosition){
		this._difTouchPosition = pPosition;		
	},
	//触摸点的世界坐标
	setTouchPosition:function(pPosition){
		this._touchPosition = pPosition;
	},
	heroEvent:function(sender,type){
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				sender.getParent().setZOrder(3);
				break;
			case ccui.Widget.TOUCH_MOVED:
				var armature = sender.getChildByTag(100);					
				
				armature.x += this._difTouchPosition.x;
				armature.y += this._difTouchPosition.y;
				this._isMoving = true;
				break;
			case ccui.Widget.TOUCH_ENDED:
				sender.getParent().setZOrder((sender.getTag()-1)%2);
				var armature = sender.getChildByTag(100);
				armature.x = sender.getSize().width/2;
				armature.y = 0;	
				if (this._isMoving) {
					this.isChangPosition(sender);//判断是否达到交换位置的条件					
				}else{
					var wuzheLayer = new LayerWuzheView(sender,null,false);
					this.addChild(wuzheLayer);
				}
				this._isMoving = false;
				break;
			case ccui.Widget.TOUCH_CANCELED:
				sender.getParent().setZOrder((sender.getTag()-1)%2);
				var armature = sender.getChildByTag(100);
				armature.x = sender.getSize().width/2;
				armature.y = 0;
				this.isChangPosition(sender);//判断是否达到交换位置的条件
				this._isMoving = false;
				break;
	
			default:
				break;
		}
	},
	seatTouchEvent:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {
			cc.log("you touch seat = "+sender.getTag());
			var num = 0;
			for ( var i in userCardInBattleList) {
				num++;
			}
			if (num >= 5) {//达到上限
				cc.log("reach to max");
				return;
			}			
			//添加上阵英雄栏			
		}
	},
	isChangPosition:function(sender){
		switch (sender.getTag()) {
		case 1:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card2");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);
			
			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);
			
			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(1,2);
			}
			break;
		case 2:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card1");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);

			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);
			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(2,1);
			}
			break;
		case 3:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card4");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);

			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);

			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(3,4);
			}
			break;
		case 4:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card3");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);

			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);

			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(4,3);
			}
			break;
		case 5:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card6");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);

			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);

			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(5,6);
			}
			break;
		case 6:
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card5");
			var collisionPosition = layerTemp.convertToNodeSpace(this._touchPosition);

			var layerTempSize = layerTemp.getSize();
			var rect = cc.rect(0,0,layerTempSize.width,layerTempSize.height);

			if (cc.rectContainsPoint(rect, collisionPosition)) {
				this.changeSeatPosition(6,5);
			}
			break;

		default:
			break;
		}
	},
	changeSeatPosition:function(p1,p2){//玩家上阵的卡牌列表 中的两个元素位置对换 拿着P1去和P2换
		if (userCardInBattleList[p2]) {//如果目标位置有英雄 则对换位置，否则直接移过去
			var temp = userCardInBattleList[p1];
			userCardInBattleList[p1] = userCardInBattleList[p2];
			userCardInBattleList[p1].point = p2;

			userCardInBattleList[p2] = temp;
			userCardInBattleList[p2].point = p1;			
		}else{
			userCardInBattleList[p2] = userCardInBattleList[p1];
			userCardInBattleList[p2].point = p2;
			delete userCardInBattleList[p1];
			
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card"+p1);
			layerTemp.removeAllChildren();
			layerTemp.setTouchEnabled(false);
			var seatP1 = ccui.helper.seekWidgetByName(this._layer, "pic_dizuo_0"+p1);
			seatP1.setTouchEnabled(true);
			var layerTemp2 = ccui.helper.seekWidgetByName(this._layer, "panel_card"+p2);
			layerTemp2.setTouchEnabled(true);
			var seatP2 = ccui.helper.seekWidgetByName(this._layer, "pic_dizuo_0"+p2);
			seatP2.setTouchEnabled(false);
		}
		this.updateHeroLocation();
	},
	updateHeroLocation:function(){
		for (var i = 1; i <= 6; i++) {
			var seat = ccui.helper.seekWidgetByName(this._layer, "pic_dizuo_0"+i);
			seat.setTouchEnabled(true);
			seat.setTag(i);
			seat.addTouchEventListener(this.seatTouchEvent,this);
			
			var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card"+i);
			layerTemp.setTouchEnabled(false);
			layerTemp.removeAllChildren();
		}
		for (var i = 1; i <= 6; i++) {
			if (userCardInBattleList[i]) {
				log.i("updateHeroLoaction","i in userCardInBattleList = "+i);
				log.i("updateHeroLoaction","userCardInBattleList[i].point"+userCardInBattleList[i].point);

				var baseCard = cardList[userCardInBattleList[i].cardId];
				var point = userCardInBattleList[i].point;

				var sprite = new AnimationCard(baseCard.imageIndex);
				var layerTemp = ccui.helper.seekWidgetByName(this._layer, "panel_card"+point);
				//layerTemp.setBackGroundColorOpacity(55);
				layerTemp.setTouchEnabled(true);
				
				var seat = ccui.helper.seekWidgetByName(this._layer, "pic_dizuo_0"+point);
				seat.setTouchEnabled(false);
				
				var size = sprite.armature.getContentSize();
				sprite.armature.x = (layerTemp.getSize().width/2);
				cc.log("sprite.armature.x"+sprite.armature.x);
				sprite.armature.y = 0;
				
				sprite.play(ACT_CARD.STANDBY);
				sprite.armature.setTag(point);
				layerTemp.addChild(sprite.armature,99,100);

			
				layerTemp.setTouchEnabled(true);
				layerTemp.addTouchEventListener(this.heroEvent,this);
				layerTemp.setTag(point);
			}
		}
	}
	
});