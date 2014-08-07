var LayerWorldMap = cc.Layer.extend({
	itemList:null,
	_worldMapID:0,
	_areaMapUI : null,
	ctor:function (wordMapID) {
		//////////////////////////////
		// 1. super init first
		this._super();		
		var size = cc.director.getWinSize();		
		this._worldMapID = wordMapID;
		var worldMapUI = ccs.uiReader.widgetFromJsonFile("res/world_maplist.json");  //世界地图UI
		var areaMapUI = ccs.uiReader.widgetFromJsonFile("res/area_"+wordMapID +".json"); //区域地图	
		this._areaMapUI = areaMapUI;
		this.itemList = ccui.helper.seekWidgetByName(worldMapUI, "itemList"); //世界地图list列表
		this.itemList.addEventListenerListView( this.selectedItemEvent,this );
		this.itemList.addEventListenerScrollView( this.listScrollEvent, this );
		
		var itemWorld 	= ccs.uiReader.widgetFromJsonFile("res/item_world.json");  //list列表标签
		
		for (var i in userWorldMapList ) 
		{
			var item = itemWorld.clone();
			var text = ccui.helper.seekWidgetByName(item, "txt_name");
			log.i("text",worldMapList[userWorldMapList[i].id].name);
			text.setString(textList[worldMapList[userWorldMapList[i].id].name].chnStr);
			log.i("world id :" ,userWorldMapList [i].id);
//			item.addTouchEventListener(this.selectedItemEvent,this);
			item.setTag(userWorldMapList [i].id);
			this.itemList.pushBackCustomItem(item);
		}		
		
//		this.itemList.pushBackCustomItem(itemWorld.clone());
//		this.itemList.pushBackCustomItem(itemWorld.clone());
//		this.itemList.pushBackCustomItem(itemWorld.clone());
//		this.itemList.pushBackCustomItem(itemWorld.clone());
		
		this.addChild(worldMapUI);
		worldMapUI.addChild(this._areaMapUI, 1);
		
		var btn_Back = ccui.helper.seekWidgetByName(worldMapUI, "btn_guanbi"); //返回监听
		btn_Back.addTouchEventListener(this.BackEvent,this);
		
//		var areaMapList = worldMapList[this._worldMapID].areaList;
//		
//		var btn_changePass;
//		var index = 1;
//		for (var i in areaMapList)
//		{
//			btn_changePass = ccui.helper.seekWidgetByName(areaMapUI, "btn_guangka_"+index); //大关卡监听
//			index++;
//			log.i("area id: ",areaMapList[i]);
//			btn_changePass.setTag(areaMapList[i]);
//			btn_changePass.addTouchEventListener(this.passChangekEvent,this);
//		}
		this.reload();

		return true;
	},
	
	reload : function()
	{
		var areaMapList = worldMapList[this._worldMapID].areaList;
		var openCount = userWorldMapList[this._worldMapID].openCount;
		log.i("openCount ",openCount);
		var btn_changePass = null;
		var index = 1;
		for (var i in areaMapList)
		{			
			btn_changePass = ccui.helper.seekWidgetByName(this._areaMapUI, "btn_guangka_"+index); //大关卡监听
			
			log.i("area id: ",areaMapList[i]);
			btn_changePass.setTag(areaMapList[i]);			
			if(index <= openCount){
				btn_changePass.addTouchEventListener(this.passChangekEvent,this);							
			}
			else{
//				btn_changePass.addTouchEventListener(this.passChangekEvent);				
			}
			index++;
			
		}

	},

	selectedItemEvent: function( sender, type ){
		
		var item = sender.getItem(sender.getCurSelectedIndex());		

		//--------------ccui.ListView.ON_SELECTED_ITEM_END undefined ???-----------
		if( type == 1 ){
		//--------------ccui.ListView.ON_SELECTED_ITEM_END undefined ???-----------
			if (item.getTag() != this._worldMapID) {

				var newMap = new LayerWorldMap(item.getTag());  //创建Fb  
				this.changeLayer(newMap);
			}
		}
	},
	changeLayer : function(layer)
	{
		log.i("this.getEventDispatcher()",this.getEventDispatcher());
//		var event = this.getEventDispatcher();
		this.scheduleOnce(this.removeFromParent);
		var uiLayer = this.getParent();
		uiLayer.addChild(layer);
	},

	selectedStateEvent:function( sender, type ){
		if( this.curIndex == sender.getTag() ){
			return;
		}
		if( type == ccui.CheckBox.EVENT_UNSELECTED ){
		}
	},
	
	//大关卡选择回调
	passChangekEvent: function (sender, type)
	{
		var tag = sender.getTag(); //获取点击的tag
		log.i("LayerWorldMap", "Back Event, tag:" + tag);
		
		switch (type)
		{		
			case ccui.Widget.TOUCH_ENDED:				
								
				var areaMapid = areaMapList[tag].id;	//取得选择的区域地图ID			
				log.i("area id",areaMapid);				
				var duplList =  areaMapList[tag].duplList;//取得选择的区域地图5个小地图列表	
				var smallpass1 = new LayerSmallPassInfo(areaMapid);  //创建小关卡				
				this.addChild(smallpass1);
				break;

			default:
				break;
		}
	},

	
	
	//返回回调
	BackEvent: function (sender, type)
	{
		log.i("BackEvent", "Back Event");
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.log("touchEnd");
			this.removeFromParent();
			break;

		default:
			break;
		}
	}

});