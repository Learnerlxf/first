var LayerBag = cc.Layer.extend({	
	bagLayer : null,//背包层

	_control_daoju:null,//道具控制器
	_control_zhuangbei:null,//装备控制器
	_control_wuhun:null,//武魂控制器
	_panel_biaoqian:null,//道具、装备、武器控制标签
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		var size = cc.director.getWinSize();		

		this.bagLayer = ccs.uiReader.widgetFromJsonFile("res/ui_bag.json");
		this.addChild(this.bagLayer);
		
		this.hideAllItems();//默认全部隐藏
		
		this._panel_biaoqian = ccui.helper.seekWidgetByName(this.bagLayer,"Panel_biaoqian");//上菜单
		
		this._btn_daoju = ccui.helper.seekWidgetByName(this._panel_biaoqian ,"btn_2");//道具
		this._btn_daoju.addTouchEventListener(this.daojuEvent,this);
		
		this._btn_zhuangbei = ccui.helper.seekWidgetByName(this._panel_biaoqian , "btn_3");//装备
		this._btn_zhuangbei.addTouchEventListener(this.zhuangbeiEvent,this);
		
		this._btn_wuhun = ccui.helper.seekWidgetByName(this._panel_biaoqian ,"btn_5");//武魂
		this._btn_wuhun.addTouchEventListener(this.wuhunEvent,this);

		var btn_guanbi = ccui.helper.seekWidgetByName(this._panel_biaoqian , "btn_guanbi");//关闭
		btn_guanbi.addTouchEventListener(this.closeEvent,this);
		
		this.daojuEvent(null, ccui.Widget.TOUCH_ENDED);
		

		return true;
	},
	onEnter:function (){
		this._super();

	},

	onExit:function (){
		this._super();
	},

	closeEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			this.removeFromParent();
			break;
		default:
			break;
		}
	},
	daojuEvent:function(sender,type){
		switch (type ) {
		case ccui.Widget.TOUCH_ENDED :
			if (this._control_wuhun) {
				delete this._control_wuhun;
				this._control_wuhun = null;
			}
			if (this._control_zhuangbei) {
				delete this._control_zhuangbei;
				this._control_zhuangbei = null;
			}
			if (this._control_daoju) {
				
			}else{
				this.hideAllItems();
				this._btn_daoju.loadTextures("res/btn/btn_yeqian_2.png","","");
				this._btn_zhuangbei.loadTextures("res/btn/btn_yeqian_1.png","","");
				this._btn_wuhun.loadTextures("res/btn/btn_yeqian_1.png","","");
				
				this._control_daoju = new controlItem(this.bagLayer);
			}			
			break;

		default:
			break;
		}
	},
	zhuangbeiEvent:function(sender,type){
		switch (type ) {
		case ccui.Widget.TOUCH_ENDED:
			if (this._control_wuhun) {
				delete this._control_wuhun;
				this._control_wuhun = null;				
			}
			if (this._control_daoju) {
				delete this._control_daoju;
				this._control_daoju = null;
			}
			if (this._control_zhuangbei) {

			}else{
				this.hideAllItems();
				this._btn_daoju.loadTextures("res/btn/btn_yeqian_1.png","","");
				this._btn_zhuangbei.loadTextures("res/btn/btn_yeqian_2.png","","");
				this._btn_wuhun.loadTextures("res/btn/btn_yeqian_1.png","","");
				this._control_zhuangbei = new controlEquipment(this.bagLayer);
			}
			break;

		default:
			break;
		}
	},
	wuhunEvent:function(sender,type){
	switch (type ) {
	case ccui.Widget.TOUCH_ENDED:
		if (this._control_daoju) {
			delete this._control_daoju;
			this._control_daoju = null;
		}
		if (this._control_zhuangbei) {
			delete this._control_zhuangbei;
			this._control_zhuangbei = null;
		}
		if (this._control_wuhun) {
			
		}else{
			this.hideAllItems();
			this._btn_daoju.loadTextures("res/btn/btn_yeqian_1.png","","");
			this._btn_zhuangbei.loadTextures("res/btn/btn_yeqian_1.png","","");
			this._btn_wuhun.loadTextures("res/btn/btn_yeqian_2.png","","");
			this._control_wuhun = new controlSoul(this.bagLayer);
		}
		break;

	default:
		break;
		}
	},
	hideAllItems : function(){
		//物品列表容器
		var ListView_bag = ccui.helper.seekWidgetByName(this.bagLayer, "ListView_bag");
		ListView_bag.setVisible(false);
		//道具详情层
		var Panel_daojuxiangqing = ccui.helper.seekWidgetByName(this.bagLayer, "Panel_daojuxiangqing");
		Panel_daojuxiangqing.setVisible(false);
		//装备详情层
		var Panel_zhuangbeixiangqing = ccui.helper.seekWidgetByName(this.bagLayer, "Panel_zhuangbei");
		Panel_zhuangbeixiangqing.setVisible(false);
		//道具左菜单
		var Panel_bianqian = ccui.helper.seekWidgetByName(this.bagLayer, "Panel_bianqian");
		Panel_bianqian.setVisible(false);
		//装备左菜单
		var Panel_bianqian_1 = ccui.helper.seekWidgetByName(this.bagLayer, "Panel_bianqian_1");
		Panel_bianqian_1.setVisible(false);
		//碎片信息
		var Panel_suipian = ccui.helper.seekWidgetByName(this.bagLayer, "Panel_suipian");
		Panel_suipian.setVisible(false);
	}
	
});