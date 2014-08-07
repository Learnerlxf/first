var LayerHeadInfo = cc.Layer.extend({

	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		var size = cc.director.getWinSize();

		var layer = ccs.uiReader.widgetFromJsonFile("res/uiplayer_2.json");
		this.addChild(layer);
		
		var btn_Back = ccui.helper.seekWidgetByName(layer, "btn_guanbi"); //返回监听
		btn_Back.addTouchEventListener(this.BackEvent,this);
		
		//var btn_Back = ccui.helper.seekWidgetByName(layer, "genghuan_di"); //更换头像监听
		//btn_Back.addTouchEventListener(this.BackEvent,this);
		this.addPlayInfo(layer);

		return true;
	},
	
	
	BackEvent: function (sender, type) {
		log.i("LayerHeadInfo", "Back Event");
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			log.i("LayerHeadInfo", "TOUCH_ENDED");
			this.removeFromParent();
			break;

		default:
			break;
		}
	},
	addPlayInfo : function(layer){
		var player_name = ccui.helper.seekWidgetByName(layer,"txt_name");
		player_name.setString(User.name);
		var soldier_level = ccui.helper.seekWidgetByName(layer,"txt_level");
		soldier_level.setString(User.level);
		var soldier_exp = ccui.helper.seekWidgetByName(layer,"txt_exp");
		soldier_exp.setString(User.exp);
		var gvg_exp = ccui.helper.seekWidgetByName(layer,"txt_gvg_exp");
		gvg_exp.setString(User.level);
		var player_name = ccui.helper.seekWidgetByName(layer,"txt_zhanghao_shuzhi");
		player_name.setString(User.id);
	}

});