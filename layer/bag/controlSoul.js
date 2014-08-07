var controlSoul = cc.Layer.extend({//背包武魂控制器

	ctor:function (bagLayer) {
		//////////////////////////////
		// 1. super init first
		this._super();

		var panel_bianqian = ccui.helper.seekWidgetByName(bagLayer, "Panel_bianqian");
		panel_bianqian.setVisible(false);

		var ListView_bag = ccui.helper.seekWidgetByName(bagLayer, "ListView_bag");
		ListView_bag.setVisible(false);

		var Panel_daojuxiangqing = ccui.helper.seekWidgetByName(bagLayer, "Panel_daojuxiangqing");
		Panel_daojuxiangqing.setVisible(false);

		return true;
	},
	onEnter:function (){
		this._super();

	},

	onExit:function (){
		this._super();
	}
});