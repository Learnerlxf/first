var LayerSmallPassInfo = cc.Layer.extend({
	duplList:null,
	layer:null,
	currentItem:null,//当前选中关卡	
	currentLevel:0, //当前地图难度
	layerList:[],	//ui item表
	_areaMapID:0,
	_worldMapID:0,
	ctor:function (areaMapid) {  //(参数：区域地图id,)
		//////////////////////////////
		// 1. super init first
		log.i("_areaMapID",this._areaMapID);
		log.i("this.layerList.length",this.layerList.length);
		
		this._super();	
		this._areaMapID = areaMapid;
		for ( var i in worldMapList) {
			var midList = worldMapList[i].areaList;
			for ( var j in midList) {
				if (midList[j] == this._areaMapID) {
					this._worldMapID = worldMapList[i].id;
					break;
				}
			}
		}
		this.layerList.length = 0;
		this.duplList = areaMapList[areaMapid].duplList; //获取区域地图下的5个副本id
		log.i("id ",this.duplList);  //传入的小副本列表【0-4】10101
		
		var size = cc.director.getWinSize();
		//小关卡
		this.layer = ccs.uiReader.widgetFromJsonFile("res/guanka.json"); 
		this.addChild(this.layer);
		//关卡框
		var layerStageIteam = ccs.uiReader.widgetFromJsonFile("res/item_stage.json");
//		log.i("layerStageIteam",layerStageIteam);
//		layerStageIteam.retain();
		//副本名称
		
		fbName = ccui.helper.seekWidgetByName(this.layer, "txt_guankangbiaoti");
		//name= duplMapList[duplList[i-1]].name;
		var areaMapname =  areaMapList[areaMapid].name;		
		fbName.setString(textList[areaMapname].chnStr);	
		
		var layer1;
		var item1;
		var name; //副本名称文字id
		var text; //根据副本名称文字id 取得文字
		var textControl;//文本控件
		var icon;//副本缩略图
		var index = 1;		
//		var lastItem;//上次挑战副本
		for(var i in this.duplList)
		{
//			log.i("this.duplList[i]",this.duplList[i]);
			layer1 = ccui.helper.seekWidgetByName(this.layer, "Panel_ceng_"+index);
			index++;
			
			item1 = layerStageIteam.clone();
			item1.setAnchorPoint(cc.p(0,0));
			
			//设置副本文本名字
//			log.i("fuben", "fuben id:" + this.duplList[i]);
			name= duplMapListNormal[this.duplList[i]].name;
			text=	textList[name].chnStr ;
			textControl = ccui.helper.seekWidgetByName(item1, "guanka_name");
			textControl.setString(text);	
			//设置低框icon  guankasuoluetu
			
			icon = ccui.helper.seekWidgetByName(item1,"guankasuoluetu");
//			log.i("tp",duplMapList[this.duplList[i-1]].imageIndex[2]);
			icon.loadTexture( "res/map/"+duplMapListNormal[this.duplList[i]].imageIndex[2]+".jpg" );
//			setGrey(icon);

			//icon.getTexture();
			icon.scaleX = 0.18;
			icon.scaleY = 0.25;
			
			layer1.addChild(item1, 100);
			item1.setTag(this.duplList[i]);
			this.layerList.push(item1);
			item1.addTouchEventListener(this.ChangeFB,this);  //监听5个小FB 
			
		}
		
		//扫荡次数
		var seekLabel = ccui.helper.seekWidgetByName(this.layer, "txt_saodangmiaoshu_shuzhi");
		seekLabel.setString("999/999");
		//to do
		
		this.reload();		
		
		var btn_Back = ccui.helper.seekWidgetByName(this.layer, "btn_guanbi"); //返回监听
		btn_Back.addTouchEventListener(this.BackEvent,this);
		
		var btn_starFight = ccui.helper.seekWidgetByName(this.layer, "btn_jinrufuben"); //进入战斗buton监听
		btn_starFight.addTouchEventListener(this.StarFightEvent,this);	
		
		var btn = ccui.helper.seekWidgetByName(this, "btn_fubenleixing_01");
		btn.addTouchEventListener(this.touchLevel1,this);
		
		var btn = ccui.helper.seekWidgetByName(this, "btn_fubenleixing_02");
		btn.addTouchEventListener(this.touchLevel2,this);
		
		var btn = ccui.helper.seekWidgetByName(this, "btn_fubenleixing_03");
		btn.addTouchEventListener(this.touchLevel3,this);
		
		return true;
	},
	
	reload : function()
	{
		for(var i in this.layerList)
		{
			var item = this.layerList[i];
//			log.i("item",item);
//			log.i("item.getTag()",item.getTag());
//			log.i("lastDuplMapId",lastDuplMapId);
			if (item.getTag() == lastDuplMapId){//默认上一次挑战副本的为选中状态
				this.currentItem = item;
			}
			this.setChoosable(item);
		}
		if (this.currentItem) {
			this.setSelectState(this.currentItem.getTag());//设置数据
		}
		else {
			this.currentItem = this.layerList[0];
			this.setSelectState(this.currentItem.getTag());
		}
		
	},
	
	touchLevel1 : function(sender, type) 
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			this.setLevel(1);
			break;

		default:
			break;
		}
	},
	
	touchLevel2 : function(sender, type) 
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			this.setLevel(2);
			break;

		default:
			break;
		}
	},
	
	touchLevel3 : function(sender, type) 
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			this.setLevel(3);
			break;

		default:
			break;
		}
	},
	
	setChoosable : function(item)
	{
		if (this.isChoosable(item.getTag())) {
//			var icon = ccui.helper.seekWidgetByName(item,"guankasuoluetu");
			var shadow = ccui.helper.seekWidgetByName(item,"yinyingceng");
			shadow.setVisible(false);
//			setNormal(icon);
		}
		else {
			var shadow = ccui.helper.seekWidgetByName(item,"yinyingceng");
			shadow.setLocalZOrder(999);
			shadow.setVisible(true);
		}
	},
	
	isChoosable : function (mapID) {		
		if (!userWorldMapList[this._worldMapID]) {
			return false;
		}
		var userAreaMapList = userWorldMapList[this._worldMapID].userAreaMapList;	
		if (!userAreaMapList[this._areaMapID]) {
			return false;
		}
		var userDuplMapList = userAreaMapList[this._areaMapID].userDuplMapList;
		if (!userDuplMapList) {
			return false;
		}
		
		for(var i in userDuplMapList)
		{
			if (mapID == userDuplMapList[i].id) {
				return true;
			}
		}
		return false;
				
	},
	
	ChangeFB: function (sender, type){  //选择哪一个副本
		if (!this.isChoosable(sender.getTag())) {
			return;
		}
		switch (type)
		{
			case ccui.Widget.TOUCH_ENDED:
				this.setSelectState(sender.getTag()); //更新选中副本的数据和状态
				log.i("ChangeFB", sender.getTag());
				
		}		
		
	},

	
	setSelectState : function(areaId) {  //更新选中副本的数据和状态
//		for(var i =1;i<6;i++){
//			var id = duplMapListNormal[this.duplList[i-1]].id;
//			var item = ccui.helper.seekWidgetByTag(this, id);//获取关卡界面
//			
//			if(item){
//				log.i("item",item);
//				var choose  = ccui.helper.seekWidgetByName(item, "xuanzhong");//获取选中状态
//				choose.setVisible(false);
//			}
//			
//		}		

		var id;
		var item;//获取关卡界面
		var choose;//获取选中状态
		var needMplable;//体力消耗值文本控件
		var needMp;//需求的体力值
		var fbDescText;//副本描述文本框
		var desc;//推荐等级文本文字id
		var textdesc;//取得描述文字
		var adviceLev ;//推荐等级文本框
		var adviceLevTextId;//文本id

		for(var i =1;i<6;i++){
			id = duplMapListNormal[this.duplList[i-1]].id;

			item = ccui.helper.seekWidgetByTag(this, id);//获取关卡界面
			choose  = ccui.helper.seekWidgetByName(item, "xuanzhong");//获取选中状态

			//体力需求
			 needMplable  = ccui.helper.seekWidgetByName(this.layer, "txt_tili");//体力消耗值文本			
//			log.i("setSelectState", "needMplable:" + needMplable + " areaId:" + areaId);
			 needMp = duplMapListNormal[areaId].needMp;
//			log.i("needMp",needMp)
			//副本描述
			fbDescText  = ccui.helper.seekWidgetByName(this.layer, "txt_guankamiaoshu");//副本描述文本框
			desc = duplMapListNormal[areaId].desc; //描述文本id
			textdesc = textList[desc].chnStr ; //描述文本
			//推荐等级
			adviceLev = ccui.helper.seekWidgetByName(this.layer, "txt_tuijiandengji_ditu_shuzhi");//推荐等级文本框
			adviceLevTextId =  duplMapListNormal[areaId].recommendLv; //文本id			
			

			if(id == areaId) {//10101
				choose.setVisible(true);				
				needMplable.setString(needMp);//需要的体力
				fbDescText.setString(textdesc);//副本描述
				this.currentItem = item;
				adviceLev.setString(adviceLevTextId); //推荐等级
				needMp =null;				
			}
			else {
				choose.setVisible(false);
			}
		}
		this.setEnemy();
		this.setLevel(1);
	},
	
	
	StarFightEvent: function (sender, type)
	{
//		log.i("StarFightEvent", "start fight event");
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.log("touchEnd");
			var sceneFinght	=new SceneFight(this.currentItem.getTag(),this.currentLevel);
			if(isUsePhysics) {
				cc.director.replaceScene(makeSceneWithPhysics(sceneFinght));
			}
			else {
				cc.director.replaceScene(makeScene(sceneFinght));
			}


			break;

		default:
			break;
		}
	},
	
	BackEvent: function (sender, type)
	{
//		log.i("LayerSmallPassInfo", "Back Event");
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
//			log.i("LayerSmallPassInfo", "touchEnd");
			this.removeFromParent();
//			delete this;
			break;

		default:
			break;
		}
	},
	
	setEnemy: function()
	{
		var id = this.currentItem.getTag();
//		duplMapList[id];
		var enemyList = [];
		var list1 = duplMapListNormal[id].firstNpcList;
		var list2 = duplMapListNormal[id].secondNpcList;
		var list3 = duplMapListNormal[id].thirdNpcList;
//		log.i("firstNpcList",duplMapListNormal[id].firstNpcList);
//		for ( var i in list1) {
//			log.i("enemyList",list1[i]);
//			log.i("enemy id ",list1[i].id);
//			enemyList.push(list1[i].id);			
//		}
//		for ( var i in list2) {
//			enemyList.push(list2[i].id);			
//		}
		for ( var i in list3) {
			enemyList.push(list3[i].id);			
		}
//		for ( var i in npcList) {
//			log.i("npc",npcList[i].id);
//		}
//		for ( var i in enemyList) {
//			log.i("enemyList",enemyList[i]);
//		}
		
//		firstNpcList:[],//第一波怪
//		secondNpcList:[],//第二波怪
//		thirdNpcList:[],//第三波怪
		var layer = ccui.helper.seekWidgetByName(this.layer,"ListView_203");
		layer.removeAllItems();
		for (var i in enemyList) 
		{
			var enemy  = ccs.uiReader.widgetFromJsonFile("res/icon_role.json");  //btn_touxiangceng_0
			var image  = ccui.helper.seekWidgetByName(enemy,"btn_icon");
			log.i("imageindex",npcList[enemyList[i]].imageIndex);
			
			image.loadTextures( "res/card/small/"+npcList[enemyList[i]].imageIndex+".png" ,"","");
			//image.loadTextures( "res/card/small"+npcList[enemyList[i]].imageIndex+".png" ,"","");
			var boss = ccui.helper.seekWidgetByName(enemy,"pic_flag");
			if (npcList[enemyList[i]].npcType == 1) {
				boss.setVisible(false);
			}
			else {
				boss.setVisible(true);			
			}
			var layer = ccui.helper.seekWidgetByName(this.layer,"ListView_203");
			
			layer.pushBackCustomItem(enemy);			
//			imageIndex:0,//形象图片
//			npcType:0,//1普通怪，2boss
		}
		
		
	},
	
	setLevel: function(level)
	{
		if (level <= 3) {
			this.currentLevel = level;
			for (var i = 1; i < 4; i++) {
				var layer = ccui.helper.seekWidgetByName(this.layer, "btn_fubenleixing_0"+i+"_diertai");
				layer.setVisible(false);
			}
			var layer = ccui.helper.seekWidgetByName(this.layer, "btn_fubenleixing_0"+level+"_diertai");
			layer.setVisible(true);
			
			var usingMapList;
			switch(level)
			{
			case 1:
				usingMapList = duplMapListNormal;				
				break;
			case 2:
				usingMapList = duplMapListHard;				
				break;
			case 3:
				usingMapList = duplMapListMaster;				
				break;
			default:
				break;
			
			}
			var areaId = this.currentItem.getTag();
			var map = usingMapList[areaId];
			
			//体力需求
			var needMplable  = ccui.helper.seekWidgetByName(this.layer, "txt_tili");//体力消耗值文本			
			var needMp = usingMapList[areaId].needMp;
			needMplable.setString(needMp);//需要的体力
			
			//副本描述
			var fbDescText  = ccui.helper.seekWidgetByName(this.layer, "txt_guankamiaoshu");//副本描述文本框
			var desc = usingMapList[areaId].desc; //描述文本id
			var textdesc = textList[desc].chnStr ; //描述文本
			fbDescText.setString(textdesc);//副本描述
			
			//推荐等级
			var adviceLev = ccui.helper.seekWidgetByName(this.layer, "txt_tuijiandengji_ditu_shuzhi");//推荐等级文本框
			var adviceLevTextId =  usingMapList[areaId].recommendLv; //文本id			
			adviceLev.setString(adviceLevTextId); //推荐等级			
			
			//今日剩余次数
			var leftTimeLabel = ccui.helper.seekWidgetByName(this.layer, "txt_shengyucishu_shuzhi");
			leftTimeLabel.setString("3/3");
			//to do			
			
			//更改奖励
			var layer = ccui.helper.seekWidgetByName(this.layer,"ListView_204");
			layer.removeAllItems();
			var mapItemList = map.npcDropList;
			
			for ( var i in mapItemList) {
				var itemId = mapItemList[i].itemid;
				
				
				var item = ccs.uiReader.widgetFromJsonFile("res/icon_item.json");
				var image  = ccui.helper.seekWidgetByName(item,"btn_icon");
				var num  = ccui.helper.seekWidgetByName(item,"txt_shuzhi");
				num.setVisible(false);
//				log.i("itemList[itemId].iconIndex",itemList[itemId].iconIndex);
				image.loadTextures( "res/icon/"+itemList[itemId].iconIndex+".png" ,"","");

				layer.pushBackCustomItem(item);
			}
			
			this.setStar();
		}
		
	},
	
	setStar : function()
	{
		var starLabel = ccui.helper.seekWidgetByName(this.layer,"txt_guankajiangli_shuzhi"); 
		starLabel.setString("15");
		//to do star num
		
		var useDulpMapList = [];
		if (userWorldMapList[this._worldMapID]) {
			if (userWorldMapList[this._worldMapID].userAreaMapList[this._areaMapID]) {
				useDulpMapList = userWorldMapList[this._worldMapID].userAreaMapList[this._areaMapID].userDuplMapList;
			}
			
		}
		
		var starNumList = [];
		for ( var i in useDulpMapList) {
			var starNum = useDulpMapList[i].starNum[this.currentLevel - 1]
//			log.i("starNum",starNum)
			starNumList.push(starNum);
		}
		
		var index = 0;
		for ( var i in this.layerList) 
		{
			if (index >= starNumList.length) {
				this._setStarNum(this.layerList[i],0);
			}
			else {
				this._setStarNum(this.layerList[i],starNumList[index]);
			}
				
			index++;
		}
	},
	
	_setStarNum : function(layer , num)
	{
		log.i("star num",num);
		for (var i = 1; i <= 3; i++) {
			var star = ccui.helper.seekWidgetByName(layer,"xingxing_0"+i);			
//			log.i("xingxing_0" + i)
			if (star) {
				if(i <= num)
				{
					star.setVisible(true);
				}
				else {
					star.setVisible(false);
				}				
			}
			else {
				log.i("error","noStar");
			}
		}
		
	}

});