var controlItem =cc.Layer.extend({//背包道具控制器
	_layerbag:null,
	_panel_bianqian:null,//
	_listView_bag:null,
	_Panel_daojuxiangqing:null,
	_lineOfProp:null,
	
	_preItem:null,//上一次选中的道具
	_chooseItemList:[],//选择要显示的道具列表
	ctor:function (bagLayer) {
		this._super();
		this._layerbag = bagLayer;
		//道具左菜单
		this._panel_bianqian = ccui.helper.seekWidgetByName(bagLayer, "Panel_bianqian");
		this._panel_bianqian.setVisible(true);
		//道具列表
		this._listView_bag = ccui.helper.seekWidgetByName(bagLayer, "ListView_bag");
		this._listView_bag.setVisible(true);
		//道具详情
		this._Panel_daojuxiangqing = ccui.helper.seekWidgetByName(bagLayer, "Panel_daojuxiangqing");
		this._Panel_daojuxiangqing.setVisible(true);
		
		this._lineOfProp = ccs.uiReader.widgetFromJsonFile("res/item_bag.json");//道具列表的每行
		this._lineOfProp.retain();
		
		var btn_all = ccui.helper.seekWidgetByName(this._panel_bianqian, "btn_01");//全部按钮
		btn_all.addTouchEventListener(this.leftMenuEvent,this);
		btn_all.setTag(1);
		var btn_baoxiang = ccui.helper.seekWidgetByName(this._panel_bianqian, "btn_02");//宝箱按钮
		btn_baoxiang.addTouchEventListener(this.leftMenuEvent,this);
		btn_baoxiang.setTag(2);
		var btn_xiaohao = ccui.helper.seekWidgetByName(this._panel_bianqian, "btn_03");//消耗按钮
		btn_xiaohao.addTouchEventListener(this.leftMenuEvent,this);
		btn_xiaohao.setTag(3);
		
		//道具列表默认加载所以道具
		var temp_button = ccui.Button.create();
		temp_button.setTag(1);
		this.leftMenuEvent(temp_button,ccui.Widget.TOUCH_ENDED);
		
		return true;
	},
	onEnter:function (){
		this._super();
	},
	onExit:function (){
		this._super();
	},
	leftMenuEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:

			this._listView_bag.removeAllItems();
			this._chooseItemList = this.removeAllFromArray(this._chooseItemList); 
			if (sender.getTag() == 1) {//所有道具
				for ( var i in userItemBagList) {	
					this._chooseItemList.push(userItemBagList[i]);				
				}	
				
			}else if (sender.getTag() == 2) {//宝箱道具
				for ( var i in userItemBagBoxList) {
					this._chooseItemList.push(userItemBagBoxList[i]);					
				}
			}else if (sender.getTag() == 3) {//消耗道具
				for ( var i in userItemBagCostList) {
					this._chooseItemList.push(userItemBagCostList[i]);					
				}
			}
			this.updateItemList(this._chooseItemList);
			var item_zero = ccui.Button.create();
			item_zero.setTag(0);
			this.selectedIconEvent(item_zero, ccui.Widget.TOUCH_ENDED);
			break;
		default:
			break;
		}
	},
	//选中道具列表里的道具
	selectedIconEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			//默认加载的道具详情
			if (this._chooseItemList.length == 0) {
				this._Panel_daojuxiangqing.setVisible(false);
				return;
			}else{
				this._Panel_daojuxiangqing.setVisible(true);
			}
			/*选中道具后加边框*/			
			var select_items = this._listView_bag.getItem(this._listView_bag.getCurSelectedIndex());
			var remainder = (sender.getTag() % 5)+1;
			var str = "item"+remainder;
			var select_item = (select_items.getChildByName("item_bag_0")).getChildByName(str);
			if (this._preItem && this._preItem != select_item) {
				var pre_pic = this._preItem.getChildByName("pic_501");//选中标记
				pre_pic.setVisible(false);
				
			}
			var cur_pic = select_item.getChildByName("pic_501");//选中标记
			cur_pic.setVisible(true);
			this._preItem = select_item;
			
			//道具对象
			var obj_prop = itemList[this._chooseItemList[sender.getTag()].id];
			var daojuxiangqing = ccui.helper.seekWidgetByName(this._layerbag , "Panel_daojuxiangqing");
			
			//道具名字按钮
			var btn_icon = ccui.helper.seekWidgetByName(daojuxiangqing,"btn_icon");
			btn_icon.addTouchEventListener(this.itemInfoEvent,this);
			btn_icon.setTag(obj_prop.id);
			btn_icon.loadTextures("res/icon/"+obj_prop.iconIndex+".png","","");
			
			//道具品阶框
			var pic_pinzhi = ccui.helper.seekWidgetByName(daojuxiangqing,"pic_pinzhi");
			pic_pinzhi.setVisible(true);
			switch (itemList[this._chooseItemList[sender.getTag()].id].quality) {
			case 1:
				pic_pinzhi.loadTexture("res/other/pic_hongsekuang.png");
				break;
			case 2:
				pic_pinzhi.loadTexture("res/other/pic_lvsekuang.png");
				break;
			case 3:
				pic_pinzhi.loadTexture("res/other/pic_lansekuang.png");
				break;
			case 4:
				pic_pinzhi.loadTexture("res/other/pic_zisekuang.png");
				break;
			case 5:
				pic_pinzhi.loadTexture("res/other/pic_jinsekuang.png");
				break;
			case 6:
				pic_pinzhi.loadTexture("res/other/pic_fenhongkuang.png");
				break;
			case 7:
				pic_pinzhi.loadTexture("res/other/pic_hongsekuang.png");
				break;
			default:
				break;
			}
			
			//道具名字
			var prop_name = ccui.helper.seekWidgetByName(daojuxiangqing,"txt_icon_name");
			prop_name.setString(textList[obj_prop.name].chnStr);
			//道具框内
			var txt_504 = ccui.helper.seekWidgetByName(daojuxiangqing,"txt_504");
			txt_504.removeFromParent();
			var txt_505 = ccui.helper.seekWidgetByName(daojuxiangqing,"pic_505");
			txt_505.removeFromParent();
			
			//道具数量
			var prop_num = ccui.helper.seekWidgetByName(daojuxiangqing,"txt_002");
			prop_num.setString(this._chooseItemList[sender.getTag()].count);
			
			//道具作用
			var pic_jineng_di = ccui.helper.seekWidgetByName(daojuxiangqing,"pic_jineng_di");
			var txt_miaoshu = pic_jineng_di.getChildByName("txt_miaoshu");
			txt_miaoshu.setString("使用该道具可以获得10点经验");
			
			//道具描述
			var txt_miaoshu_1 = ccui.helper.seekWidgetByName(daojuxiangqing,"txt_miaoshu");
			txt_miaoshu_1.setString(textList[obj_prop.desc].chnStr);
			
			//出售价格
			var prop_price = ccui.helper.seekWidgetByName(daojuxiangqing,"txt_007");
			prop_price.setString(obj_prop.sellPrice);
			
			//btn出售
			var btn_sell = ccui.helper.seekWidgetByName(daojuxiangqing,"btn_chushou");
			btn_sell.addTouchEventListener(this.sellEvent,this);
			btn_sell.setTag(sender.getTag());
			
			//btn使用
			var btn_use = ccui.helper.seekWidgetByName(daojuxiangqing,"btn_shiyong");
			btn_use.addTouchEventListener(this.useEvent,this);
			btn_use.setTag(sender.getTag());
			
			break;
		default:
			break;
		}
	},
	itemInfoEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			log.i("controlItem","itemInfo");
			break;
		default:
			break;
		}
	},	
	sellEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			log.i("controlItem","sell item");	
			
			//装备不可以卖
			if (itemList[this._chooseItemList[sender.getTag()].id].isCanSell == 2) {
				return;
			}
			
			var item_type = itemList[this._chooseItemList[sender.getTag()].id].itemType;
			
			if(this._chooseItemList[sender.getTag()].count > 0){
				this._chooseItemList[sender.getTag()].count -= 1;
				//如果道具为0，删除该道具
				if (this._chooseItemList[sender.getTag()].count == 0) {
					switch (item_type) {
					case 1://宝箱里道具
						userItemBagBoxList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagBoxList);
						break;
					case 2://消耗里道具
						userItemBagCostList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagCostList);
					default:
						break;
					}
					//所有道具
					userItemBagList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagList);
					this._chooseItemList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], this._chooseItemList );
					
					//更新道具列表
					this.updateItemList(this._chooseItemList );
					
					sender.setTag(0);//删除道具后默认选中第一个
					this.selectedIconEvent(sender, ccui.Widget.TOUCH_ENDED);
				}else{
					this.updateItemList(this._chooseItemList );
					this.selectedIconEvent(sender, ccui.Widget.TOUCH_ENDED);
				}
			}
		default:
			break;
		}
	},
	useEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			log.i("controlItem","sell item");
			
			var item_type = itemList[this._chooseItemList[sender.getTag()].id].itemType;

			if(this._chooseItemList[sender.getTag()].count > 0){
				this._chooseItemList[sender.getTag()].count -= 1;
				//如果道具为0，删除该道具
				if (this._chooseItemList[sender.getTag()].count == 0) {
					switch (item_type) {
					case 1://宝箱里道具
						userItemBagBoxList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagBoxList);
						break;
					case 2://消耗里道具
						userItemBagCostList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagCostList);
					default:
						break;
					}
					//所有道具
					userItemBagList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], userItemBagList);
					this._chooseItemList = this.removeAtValueFromArray(this._chooseItemList[sender.getTag()], this._chooseItemList );

					//更新道具列表
					this.updateItemList(this._chooseItemList );

					sender.setTag(0);//删除道具后默认选中第一个
					this.selectedIconEvent(sender, ccui.Widget.TOUCH_ENDED);
				}else{
					this.updateItemList(this._chooseItemList );
					this.selectedIconEvent(sender, ccui.Widget.TOUCH_ENDED);
				}
			}
		default:
			break;
		}
	},
	//更新道具列表
	updateItemList:function(itemList_parameter){
		this._preItem = null;
		this._listView_bag.removeAllItems();
		var line =  Math.floor(itemList_parameter.length / 5) + 1;//行数
		var remainder = itemList_parameter.length % 5;//最后一行的元素个数

		for (var i  = 0; i  < line ; i ++) {//道具的每一行
			var dataOfLine = this._lineOfProp.clone();
			var items = dataOfLine.getChildByName("item_bag_0");
			for (var j = 0; j < 5 ; j++) {//道具每行的每一符号		
				if ((line == (i+1))&& (remainder == j)) {//最后一行未填满的位置隐藏						
					for (var k = j; k < 5; k++) {
						var str = "item"+(k+1);
						var item = items.getChildByName(str);
						item.setVisible(false);
					}
					break;
				}	
				
				//道具对象
				var obj_prop = itemList[itemList_parameter[i*5+j].id];	
				
				var str = "item"+(j+1);
				log.i("controlProp","str= "+str);
				var item = items.getChildByName(str);//道具item
				
				var icon = item.getChildByName("btn_icon");
				icon.setTag(i*5+j);
				icon.addTouchEventListener(this.selectedIconEvent,this);
				icon.loadTextures("res/icon/"+obj_prop.iconIndex+".png","","");

				//道具数量
				var shuzi = item.getChildByName("txt_shuzhi");
				shuzi.setString(itemList_parameter[i*5+j].count);
				shuzi.setVisible(true);
				
				//道具品阶框 quality
				var pic_pinzhi = item.getChildByName("pic_pinzhi");
				pic_pinzhi.setVisible(true);
				switch (itemList[itemList_parameter[i*5+j].id].quality) {
				case 1:
					pic_pinzhi.loadTexture("res/other/pic_hongsekuang.png");
					break;
				case 2:
					pic_pinzhi.loadTexture("res/other/pic_lvsekuang.png");
					break;
				case 3:
					pic_pinzhi.loadTexture("res/other/pic_lansekuang.png");
					break;
				case 4:
					pic_pinzhi.loadTexture("res/other/pic_zisekuang.png");
					break;
				case 5:
					pic_pinzhi.loadTexture("res/other/pic_jinsekuang.png");
					break;
				case 6:
					pic_pinzhi.loadTexture("res/other/pic_fenhongkuang.png");
					break;
				case 7:
					pic_pinzhi.loadTexture("res/other/pic_hongsekuang.png");
					break;
				default:
					break;
				}
				
				//道具中用不到的remove
				var txt_502 = item.getChildByName("txt_502");
				txt_502.removeFromParent();
				var txt_503 = item.getChildByName("txt_503");
				txt_503.removeFromParent();
				var txt_504 = item.getChildByName("txt_504");
				txt_504.removeFromParent();
				var txt_505 = item.getChildByName("pic_505");
				txt_505.removeFromParent();
			}
			this._listView_bag.pushBackCustomItem(dataOfLine);
		}
	},
	
	removeAtIndexFromArray : function(index,array)
	{
		if(index>=0 && index<array.length)
		{
			for(var i=index; i<array.length; i++)
			{
				array[i] = array[i+1];
			}
			array.length = array.length-1;
		}
		return array;
	},

	removeAllFromArray:function(array){
		if(array && array.length>0)
		{
			var num = array.length
			for(var i=0; i < num; i++)
			{
				array.pop();
			}			
		}
		return array;
	},
	//删除数组中是某个值
	removeAtValueFromArray : function(valueParam,array){
		if(array){
			var index  = -1;
			for ( var i in array) {
				if (array[i] == valueParam) {
					index = i;
				}
			}
			array = this.removeAtIndexFromArray(Math.round(index), array);
		}
		return array;
	}
});