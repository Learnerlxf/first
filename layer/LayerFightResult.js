var LayerFightResult = cc.Layer.extend({

	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		var size = cc.director.getWinSize();

		log.i("init_LayerBuzhen");
		var layer = ccs.uiReader.widgetFromJsonFile("res/ui_fight_result.json");
		this.addChild(layer);
		
		var Btn_Back_out = ccui.helper.seekWidgetByName(layer, "btn_zailaiyici");   //返回监听
		Btn_Back_out.addTouchEventListener(this.BackEvent,this);
		//触摸监听
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded
		}, this);

		return true;
	},

	onTouchBegan:function (touch, event) {
		return true;
	},
	onTouchMoved:function (touch, event) {

	},
	onTouchEnded:function (touch, event) {
		cc.director.replaceScene(makeScene(SceneMain));
	},
	
	BackEvent: function (sender, type) {
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			break;
		case ccui.Widget.TOUCH_MOVED:
			break;
		case ccui.Widget.TOUCH_ENDED:
			log.i("onTouchEnded","1111");
			cc.director.replaceScene(makeScene(new SceneMain()));
			break;
		case ccui.Widget.TOUCH_CANCELED:
			break;
		default:
			break;
		}
	},
	
	
	
	onEnter:function (){
		this._super();

		log.i("LayerBuzhen_OnEnter");
	},

	onExit:function (){
		this._super();
		delete this;
		log.i("LayerBuzhen_OnExit");
	},
	
	closeEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_BEGAN:
			
			break;
		case ccui.Widget.TOUCH_MOVE:
			
			break;
		case ccui.Widget.TOUCH_ENDED:
			this.removeFromParent();
			break;
		default:
			break;
		}
	}
});