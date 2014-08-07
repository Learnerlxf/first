var controlEquipment = cc.Layer.extend({//背包装备控制器
	_Panel_bianqian_1:null,
	_listView_bag:null,
	_Panel_zhuangbei:null,
	_layerbag:null,
	
	_lineOfProp:null,
	
	_btn_weapon:null,
	_btn_clothes:null,
	_btn_headDress:null,
	_btn_fragment:null,
	
	_chooseEquipList:[],//选择要显示的装备列表
	_preItem:null,//上一次选中的装备 
	ctor:function (bagLayer) {
		//////////////////////////////
		// 1. super init first
		this._super();
		this._layerbag = bagLayer;
		//装备左菜单
		this._Panel_bianqian_1 = ccui.helper.seekWidgetByName(bagLayer, "Panel_bianqian_1");
		this._Panel_bianqian_1.setVisible(true);
		//装备列表
		this._listView_bag = ccui.helper.seekWidgetByName(bagLayer, "ListView_bag");
		this._listView_bag.setVisible(true);
		//装备详情
		this._Panel_zhuangbei = ccui.helper.seekWidgetByName(bagLayer, "Panel_zhuangbei");
		this._Panel_zhuangbei.setVisible(true);
		
		
		//武器
		this._btn_weapon = ccui.helper.seekWidgetByName(this._Panel_bianqian_1, "btn_142");
		this._btn_weapon.addTouchEventListener(this.leftMenuEvent,this);
		this._btn_weapon.setTag(1);
		//衣服
		this._btn_clothes = ccui.helper.seekWidgetByName(this._Panel_bianqian_1, "btn_141");
		this._btn_clothes.addTouchEventListener(this.leftMenuEvent,this);
		this._btn_clothes.setTag(2);
		//首饰
		this._btn_headDress = ccui.helper.seekWidgetByName(this._Panel_bianqian_1, "btn_140");
		this._btn_headDress.addTouchEventListener(this.leftMenuEvent,this);
		this._btn_headDress.setTag(3);
		//碎片
		this._btn_fragment = ccui.helper.seekWidgetByName(this._Panel_bianqian_1, "btn_143");
		this._btn_fragment.addTouchEventListener(this.leftMenuEvent,this);
		this._btn_fragment.setTag(4);
		
		//装备列表的每行
		this._lineOfProp = ccs.uiReader.widgetFromJsonFile("res/item_bag.json");
		this._lineOfProp.retain();
		
		//装备默认加载第一个装备
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
			this._preItem  = null;
			this._listView_bag.removeAllItems();
			this._chooseEquipList = this.removeAllFromArray(this._chooseEquipList); 
			if (sender.getTag() == 1) {//武器btn
				
				for ( var i in userEquipInBagList) {
					if (equipList[userEquipInBagList[i].id].type == 1) {//武器类装备
						this._chooseEquipList.push(userEquipInBagList[i]);
					}
				}
			}else if (sender.getTag() == 2) {//衣服btn
				for ( var i in userEquipInBagList) {
					if (equipList[userEquipInBagList[i].id].type == 2) {//类装备
						this._chooseEquipList.push(userEquipInBagList[i]);
					}
				}
			}else if (sender.getTag() == 3) {//首饰btn
				for ( var i in userEquipInBagList) {
					if (equipList[userEquipInBagList[i].id].type == 3) {//武器类装备
						this._chooseEquipList.push(userEquipInBagList[i]);
					}
				}
			}else if (sender.getTag() == 4) {//碎片
				
			}
			this.updateEquipmentList(this._chooseEquipList);
			var equipment_zero = ccui.Button.create();
			equipment_zero.setTag(0);
			this.selectedIconEvent(equipment_zero, ccui.Widget.TOUCH_ENDED);
			break;
		default:
			break;
		}
	},
	strengthenEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			log.i("controlEquipment","strengthenEvent");
			break;
		default:
			break;
		}
		
	},
	autoStrenthenEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:
			log.i("controlEquipment","autoStrenthenEvent");
			break;
		default:
			break;
		}
	},
	updateEquipmentList:function(itemList_parameter){
		this._listView_bag.removeAllItems();
		var line =  Math.floor(itemList_parameter.length / 5) + 1;//行数
		var remainder = itemList_parameter.length % 5;//最后一行的元素个数

		for (var i  = 0; i  < line ; i ++) {//装备的每一行
			var dataOfLine = this._lineOfProp.clone();
			var items = dataOfLine.getChildByName("item_bag_0");
			for (var j = 0; j < 5 ; j++) {//装备每行的每一符号		
				if ((line == (i+1))&& (remainder == j)) {//最后一行未填满的位置隐藏						
					for (var k = j; k < 5; k++) {
						var str = "item"+(k+1);
						var item = items.getChildByName(str);
						item.setVisible(false);
					}
					break;
				}
				var str = "item"+(j+1);
				log.i("controlProp","str= "+str);
				var item = items.getChildByName(str);//装备item

				var icon = item.getChildByName("btn_icon");
				icon.setTag(i*5+j);
				icon.addTouchEventListener(this.selectedIconEvent,this);
				icon.loadTextures("res/icon/equlicon/"+equipList[itemList_parameter[i*5+j].id].iconIndex+".png","","");

				//装备数量
				var shuzi = item.getChildByName("txt_shuzhi");
				shuzi.setVisible(false);
				
				//装备品阶框 quality
				var pic_pinzhi = item.getChildByName("pic_pinzhi");
				pic_pinzhi.setVisible(true);
				
				switch (equipList[this._chooseEquipList[i*5+j].id].quality) {
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
				
				//等级标签：lv
				var txt_502 = item.getChildByName("txt_502");
				txt_502.setVisible(true);
				var txt_503 = item.getChildByName("txt_503");
				txt_503.setString(this._chooseEquipList[i*5+j].level);

				//缘
				var txt_504 = item.getChildByName("txt_504");
				txt_504.setVisible(false);
				//上箭头
				var txt_505 = item.getChildByName("pic_505");
				txt_505.setVisible(false);
				//
			}
			this._listView_bag.pushBackCustomItem(dataOfLine);
		}
	},
	selectedIconEvent:function(sender,type){
		switch (type) {
		case ccui.Widget.TOUCH_ENDED:			
			//默认加载的装备详情
			log.i("controlEquipment","equipment num="+this._chooseEquipList.length);
	
			if (this._chooseEquipList.length == 0) {
				this._Panel_zhuangbei.setVisible(false);
				return;
			}else{
				this._Panel_zhuangbei.setVisible(true);
			}
			/*选中装备后加边框*/			
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

			//装备对象
			var obj_equipment = this._chooseEquipList[sender.getTag()];
			var equipmentXiangqing = ccui.helper.seekWidgetByName(this._layerbag , "Panel_zhuangbei");
			
			//装备品阶框
			var pic_pinzhi = ccui.helper.seekWidgetByName(equipmentXiangqing,"pic_pinzhi");
			pic_pinzhi.setVisible(true);			
			switch (equipList[this._chooseEquipList[sender.getTag()].id].quality) {
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
			
			
			//装备名字按钮
			var  btn_icon = ccui.helper.seekWidgetByName(equipmentXiangqing,"btn_icon");
			btn_icon.addTouchEventListener(this.itemInfoEvent,this);
			btn_icon.setTag(obj_equipment.seqId);
			btn_icon.loadTextures("res/icon/equlicon/"+equipList[obj_equipment.id].iconIndex+".png","","");
			//装备图标框内
			var txt_504 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_504");
			txt_504.setVisible(false);
			//上箭头
			var txt_505 = ccui.helper.seekWidgetByName(equipmentXiangqing,"pic_505");
			txt_505.setVisible(false);
			
			//装备名字 
			var  txt_jineng_name = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_jineng_name");
			txt_jineng_name.setString(textList[equipList[obj_equipment.id].name].chnStr);
			
			//装备等级
			var  txt_jineng_dengji = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_jineng_dengji");
			txt_jineng_dengji.setString("lv:"+obj_equipment.level);
			
			//装备于
			var txt_93 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_93");
			txt_93.setString("赵信");
			
			//装备源
			var txt_095 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_095");
			txt_jineng_dengji.setString("装备源");
			
			//有缘人
			var txt_096 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_096");
			txt_096.setString("杨青帝");
			var txt_098 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_098");
			txt_098.setString("杨文帝");
			var txt_100 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_100");
			txt_100.setString("杨随帝");
			var txt_097 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_097");
			txt_097.setString("杨武帝");
			var txt_099 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_099");
			txt_099.setString("杨汉帝");
			var txt_101 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_101");
			txt_101.setString("杨广帝");
			
			
			//装备生命
			var  txt_113 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_113");
			txt_113.setString(equipList[obj_equipment.id].hp);
			
			//装备强化后生命
			var  txt_116 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_116");
			txt_116.setString(100+obj_equipment.level*2);
			
			//装备强化后增加生命
			var  txt_115 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_115");
			txt_115.setString(obj_equipment.level*2);
			
			//装备攻击
			var  txt_120 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_120");
			txt_120.setString(equipList[obj_equipment.id].attack);
			
			//装备强化后攻击
			var  txt_123 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_123");
			txt_123.setString(100 + equipList[obj_equipment.id].attack*2);
			
			//装备强化后增加攻击
			var  txt_122 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_122");
			txt_122.setString(equipList[obj_equipment.id].attack*2);
			
			//强化所需晶币
			var  txt_131 = ccui.helper.seekWidgetByName(equipmentXiangqing,"txt_131");
			txt_131.setString(100+equipList[obj_equipment.id].attack*10);
			
			//强化
			var  btn_qianghua = ccui.helper.seekWidgetByName(equipmentXiangqing,"btn_qianghua");
			btn_qianghua.addTouchEventListener(this.strengthenEvent,this);
			
			//自动强化
			var  btn_zidong = ccui.helper.seekWidgetByName(equipmentXiangqing,"btn_zidong");
			btn_zidong.addTouchEventListener(this.autoStrenthenEvent,this);
			
			break;
		default:
			break;
		}
	},
	//删除数组中所有的元素
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
	//根据数组下表删除数组中的元素
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
	//删除数组中是某个值
	removeAtValueFromArray : function(valueParam,array){
		if(!array){
			var index  = -1;
			for ( var i in array) {
				if (array[i] == valueParam) {
					index = i;
				}
			}
			array = this.removeAtIndexFromArray(index, array);
		}
	}
});