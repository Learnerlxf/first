var LayerWuzheView =cc.Layer.extend({
	_wuzheParent:null,//构造函数传过来的参数，表示选中的武者的父层
	_seatLayer:null,//点击底座时 传过来的底座对象，没有的话为NULL
	_isShow:false,//是否展示方式
	_chooseItemList:[],//要展示的人物列表
	_listView_bag:null,//人物显示listview
	_difLineData:null,//一个下阵，一个人物的条目
	_comLineData:null,//两个人物的条目
	_headSoldierBtn:null,//前排按钮
	_midSoldierBtn:null,//中排按钮
	_behindSoldierBtn:null,//后排按钮
	ctor:function (sender,seat,isShow) {//sender点击人物传过来的人物父层对象；seat点击底座时的底座对象;isShow是否为展示模式
		this._super();
		this._wuzheParent = sender;
		this._seatLayer = seat;
		this._isShow = isShow;
		
		//读取json文件
		this._difLineData = ccs.uiReader.widgetFromJsonFile("res/wuzhe_beibao_list.json");
		this._difLineData.retain();
		this._comLineData = ccs.uiReader.widgetFromJsonFile("res/wuzhe_beibao_list_02.json");
		this._comLineData.retain();;
		
		var layer = ccs.uiReader.widgetFromJsonFile("res/wuzhe_beibao.json");
		this.addChild(layer);
		//关闭
		var closeBtn = ccui.helper.seekWidgetByName(layer, "btn_51");
		closeBtn.addTouchEventListener(this.closeLayer,this);
		
		this._headSoldierBtn = ccui.helper.seekWidgetByName(layer, "btn_01");
		this._midSoldierBtn = ccui.helper.seekWidgetByName(layer,"btn_02");
		this._behindSoldierBtn = ccui.helper.seekWidgetByName(layer, "btn_03");
		
		//人物显示listview
		this._listView_bag = ccui.helper.seekWidgetByName(layer, "ListView_124");
		//左菜单
		for (var i = 1; i <= 3; i++) {	
			if (this._isShow) {
				switch (i) {
				case 1:
					this._headSoldierBtn.addTouchEventListener(this.menuSelect,this);
					btn.setTag(i);
					break;
				case 2:
					this._headSoldierBtn.addTouchEventListener(this.menuSelect,this);
					btn.setTag(i);
					break;
				case 3:
					this._headSoldierBtn.addTouchEventListener(this.menuSelect,this);
					btn.setTag(i);
					break;
				default:
					break;
				}//end switch
			}//end if			
		}//end for
		if (sender) {
			var button = ccui.Button.create();
			switch (sender.getTag()) {
			case 1:
				button.setTag(1);			
				break;
			case 2:
				button.setTag(1);
				break;
			case 3:
				button.setTag(2);
				break;
			case 4:
				button.setTag(2);
				break;
			case 5:
				button.setTag(3);
				break;
			case 6:
				button.setTag(3);
				break;

			default:
				break;
			}//end switch
			this.menuSelect(button, ccui.Widget.TOUCH_ENDED);			
		}//end if
		return true;
	},
	onEnter:function (){
		this._super();
	},
	onExit:function (){
		this._super();
		this._difLineData.release();
		this._comLineData.release();
	},
	menuSelect:function(sender,type){
		var index = 0;
		this._chooseItemList = this.removeAllFromArray(this._chooseItemList);//清空要显示的数据
		if (type == ccui.Widget.TOUCH_ENDED) {
			switch (sender.getTag()) {
			case 1://前排
				for ( var i in userCardInBattleList) {
					if (cardList[userCardInBattleList[i].cardId].stance == 1) {
						this._chooseItemList[index] = userCardInBattleList[i];	
						index++;
					}
				}
				cc.log("aaaaaaaaaaaaaaaaaaaaa"+this._chooseItemList.length);
				break;
			case 2://中排
				for ( var i in userCardInBattleList) {
					if (cardList[userCardInBattleList[i].cardId].stance == 2) {
						this._chooseItemList[index] = userCardInBattleList[i];
						index++;
					}
				}
				break;
			case 3://后排
				for ( var i in userCardInBattleList) {
					if (cardList[userCardInBattleList[i].cardId].stance == 3) {
						this._chooseItemList[index] = userCardInBattleList[i];
						index++;
					}
				}
				break;

			default:
				break;
			}//end switch
		this.updateItemList(this._chooseItemList);
		}//end if
	},
	updateItemList:function(itemList_parameter){
		cc.log("bbbbbbbbbbbbbbbbbb"+itemList_parameter.length);
		this._listView_bag.removeAllItems();
		var length;
		if (this._wuzheParent) {
			length = itemList_parameter.length+1;			
		}else {
			length = itemList_parameter.lengt;
		}
		cc.log("cccccccccccccccccc"+length);
		var line =  Math.floor(length/2) + 1;//行数
		var remainder = length % 2;//最后一行的元素个数
		
		for (var i  = 0; i  < line ; i ++) {//道具的每一行
			var dataOfLine;
			if (i == 0) {
				dataOfLine = this._difLineData.clone();
			}else {
				dataOfLine = this._comLineData.clone();
			}
			var items = dataOfLine.getChildByName("Panel_50");
			for (var j = 0; j < 2 ; j++) {//道具每行的每一符号		
				if ((line == (i+1))&& (remainder == j)) {//最后一行未填满的位置隐藏						
					for (var k = j; k < 2; k++) {
						var str = "Panel_"+(k+1);
						var item = items.getChildByName(str);
						item.setVisible(false);
					}
					break;
				}
				if (this._wuzheParent) {//从武者进来
					var str = "Panel_"+(j+1);
					var item = items.getChildByName(str);//item
					if (i == 0 && j == 0) {//item分两种情况，第一种是下阵操作
						var downHero = ccui.helper.seekWidgetByName(item, "btn_52");
						downHero.addTouchEventListener(this.selectedIconEvent,this);
						downHero.setTag(-1);
					}else {//第二种是换人操作
						var changeHero = ccui.helper.seekWidgetByName(item, "btn_touxiang5");
						changeHero.addTouchEventListener(this.selectedIconEvent,this);
						changeHero.setTag(i*2+j-1);
					}
					
				}else if (this._seatLayer) {//从底座进来
					var addHero = ccui.helper.seekWidgetByName(item, "btn_touxiang5");
					addHero.addTouchEventListener(this.selectedIconEvent,this);
					addHero.setTag(i*2+j);
				}else if (this._isShow) {//从全部按钮进来
					var showHero = ccui.helper.seekWidgetByName(item, "btn_touxiang5");	
				}
			}
			this._listView_bag.pushBackCustomItem(dataOfLine);
			cc.log("push times = "+i);
		}
	},
	selectedIconEvent:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {
			if (this._wuzheParent) {//下阵或者换人操作
				if (sender.getTag() == -1) {//下阵
					cc.log("down hero");
					delete userCardInBattleList[this._wuzheParent.getTag()];//下阵武者
					//放到背包 等等操作，暂时没做
					this.getParent().updateHeroLocation();
					this.closeLayer(null, ccui.Widget.TOUCH_ENDED);
				}else {//换人
					cc.log("change hero");					
				}				
			}else {//点击了底座，选人上阵

			}			
		}
		
	},
	
	closeLayer:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {
			this.removeFromParent();
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