var LayerZhenrong = cc.Layer.extend({
	itemTag:0, //当前选择的是哪一个 页签（0表示详情，1表示技能，2表示突破，3，表示飞升）
	layer:null,//阵容界面
	carid:null, //当前选择的 上阵卡牌ID	
	carLev:null,//当前主动技能等级
	smallCarLev:null,//当前被动技能等级
	deadSkillLev:null,//当前死亡技能等级
	skillDesc:null, //技能介绍框
	selectItemUi:[], //详情 技能  突破飞升 是个界面
	selectItemUiState:[],//详情 技能  突破飞升4个按钮状态界面
	showlayer:null,//显示层
	cardTag:1, //当前选择的是哪一张卡牌头像的顺序tag
	selectItemEqueState:null, //装备 衣服，首饰3个选中框的状态
	baglistLayer:null,//背包层
	cardInfolayer:null,//卡牌属性层
	cuitiInfolayer:null,//萃体层
	changestate:[], //装备框选中状态
	equipListView:null,//背包列表控件
	_chooseEquipList:[],//当前选择的背包装备的分类数据
	equipTips:null,//装备的tips
	equipItemTag:0,//当前点击的是武器草还是衣服槽位或者首饰槽Tag
	_preItem:null,//上一次选择的背包物品框
	headState:[],//头像选中状态框
	ctor:function (itemTag) {
		//////////////////////////////
		// 1. super init first
		this._super();
		this.itemTag = itemTag;//  this.itemTag 值为 0-3，表示显示哪一个页签内容
		var size = cc.director.getWinSize();

		this.layer = ccs.uiReader.widgetFromJsonFile("res/zhenrong.json"); //阵容界面
		this.addChild(this.layer);

		this.skillDesc = ccs.uiReader.widgetFromJsonFile("res/item_skilldesc.json"); //技能介绍框
		this.addChild(this.skillDesc);
		this.skillDesc.setVisible(false);

		this.selectItemUi[0] = ccs.uiReader.widgetFromJsonFile("res/zhenrong_xiangqing.json");//详情界面		
		this.selectItemUi[0].retain();
//		this.selectItemUi[1] =  ccs.uiReader.widgetFromJsonFile("res/zhenrong_jineng.json");//技能界面
//		this.selectItemUi[1].retain();
//		this.selectItemUi[2] =  ccs.uiReader.widgetFromJsonFile("res/zhengrong_tupo.json");//突破界面
//		this.selectItemUi[2].retain();
		
		this.showlayer = ccui.helper.seekWidgetByName(this.layer,"showLayer");
		
		var btn_buzhen = ccui.helper.seekWidgetByName(this.selectItemUi[0], "btn_buzhen");//布阵按钮
		btn_buzhen.addTouchEventListener(this.buzhenEvent,this);

		var btn_cuiti = ccui.helper.seekWidgetByName(this.selectItemUi[0], "btn_cuiti");//萃体按钮
		btn_cuiti.addTouchEventListener(this.cuitiEvent,this);

		var btn_guanbi = ccui.helper.seekWidgetByName(this.layer, "btn_guanbi");//大界面关闭按钮
		btn_guanbi.addTouchEventListener(this.closeEvent, this);		

		//获取玩家已经上阵的卡牌 userCardInBattleList
		var roleImageState;
		for(var i =1;i<5;i++){//设置所有头像不可点击
			roleImageState = ccui.helper.seekWidgetByName(this.layer, "btn_touxiang"+i);//详情角色头像显示
			roleImageState.setTouchEnabled(false);
			roleImageState.loadTextures("res/bg/bg_touxiangkuang.png","","" );
		}
		
		
		var roleImage;
		log.i("userCardInBattleList",userCardInBattleList.length);
		
		var index = 1;
		for(var i in userCardInBattleList){
			
			roleImage = ccui.helper.seekWidgetByName(this.layer, "btn_touxiang"+index);//详情角色头像显示
			
			//把小头像设置给button
			//roleImage.setTag(i);
			if(userCardInBattleList[i].cardId !=0){
				
				roleImage.loadTextures("res/card/small/"+ cardList[ userCardInBattleList[i].cardId ].icon+".png","","" );		
				roleImage.setTag(i);
				roleImage.setTouchEnabled(true);
				roleImage.addTouchEventListener(this.touchHead,this);
				index++;
			}
		}	
		
		
		 //监听详情界面的三个 技能按钮
		var btnskill;
		for (var i =1;i<4;i++){ 
			btnskill = ccui.helper.seekWidgetByName(this.selectItemUi[0], "btn_icon3"+i)
			btnskill.setTag(i);
			btnskill.addTouchEventListener(this.btnSkillEvent,this);
		} 
		
		var back =  ccui.helper.seekWidgetByName(this.skillDesc, "btn_guanbi1");  //技能 介绍关闭按钮
		back.addTouchEventListener(this.closedEvent,this);
		
		
		//详情 技能 突破飞升  按钮监听
		var btn_item;
		for(var i =0;i<4;i++ ){
			btn_item= ccui.helper.seekWidgetByName(this.layer, "btn_biaoqian0"+(i+1)+"_1"); 
			btn_item.setTag(i+4);
			btn_item.addTouchEventListener(this.btn_itemEvent,this);
			this.selectItemUiState[i]=ccui.helper.seekWidgetByName(this.layer, "btn_biaoqian0"+(i+1)+"_2");//详情 技能 突破飞升  按钮状态
		}
		
		this.touchHeadSetData(1);//默认设置界面数据
		
		for(var i =1;i<4;i++ ){ //3个装备槽的监听
			btn_itemEque= ccui.helper.seekWidgetByName(this.selectItemUi[0], "btn_zhuangbei"+i); 
			btn_itemEque.setTag(i);
			btn_itemEque.addTouchEventListener(this.btn_itemEqueEvent,this);//点击详情界面装备 武器.衣服.首饰回调
			//this.selectItemEqueState[i]= ccui.helper.seekWidgetByName(this.selectItemUi[0], "pic_50"+i);//装备选中框
		}
		
		for(var i =1;i<4;i++){ //3个装备槽选中状态框
			this.changestate[i] = ccui.helper.seekWidgetByName(this.selectItemUi[0],"pic_"+(500+i));				
		}
		
//		for(var i =1;i<6;i++){ //头像选中状态框
//			this.headState[i]= ccui.helper.seekWidgetByName(this.selectItemUi[0],"pic_"+(500+i));
//			this.headState[i].setVisible(false);
//		}	
		
		this.cuitiInfolayer = ccui.helper.seekWidgetByName(this.selectItemUi[0], "Panel_cuiti");//萃体层
		this.selectItem(this.itemTag); //默认显示哪一个 界面
		//this.selectHeadState(1);默认头像选中1
		
		
		return true;
	},
	
	//头像选中状态
	selectHeadState:function(tag){
		for(var i in userCardInBattleList){
			if(i ==tag){
				this.headState[tag].setVisible(true);
			}
			this.headState[i].setVisible(false);
		}
	
	},
	
	
	 //详情，飞升，技能 是个按钮回调
	btn_itemEvent:function(sender, type){
		var tag = sender.getTag();	

		if (type == ccui.Widget.TOUCH_ENDED ) {	
			log.i("mmm",tag);
			this.itemTag = tag-4;
			this.selectItem(this.itemTag);
		}
	},
	
	//大页签的切换（详情，及技能 突破飞升 界面切换）
	selectItem:function(tag){
		//点击加载json 资源文件
		 if(this.itemTag ==1){
			if(this.selectItemUi[1] == null){//加载技能界面				
				this.selectItemUi[1] =  ccs.uiReader.widgetFromJsonFile("res/zhenrong_jineng.json");//技能界面
				this.selectItemUi[1].retain();
			}			
		}
		else if(this.itemTag ==2){ //加载突破界面
			if(this.selectItemUi[2] == null){
				this.selectItemUi[2] =  ccs.uiReader.widgetFromJsonFile("res/zhengrong_tupo.json");//突破界面
				this.selectItemUi[2].retain();
			}
		}
		else if(this.itemTag ==3){ //加载 飞升界面
			if(this.selectItemUi[3] == null){
				this.selectItemUi[3] =  ccs.uiReader.widgetFromJsonFile("res/zhengrong_feisheng.json");//飞升界面
				this.selectItemUi[3].retain();
			}
		}
		
		//显示哪一个界面		
		for(var i in this.selectItemUi){
			log.i("i:",i);
			log.i("tag:",tag);			
				
			if( i == tag ){			
				this.showlayer.addChild(this.selectItemUi[i]);				
				this.selectItemUiState[i].setVisible(true);	
				this.touchHeadSetData(1);//默认设置界面数据
			 
			}
			else
			{
				
				this.selectItemUiState[i].setVisible(false);
				log.i("this.selectItemUi[i]",this.selectItemUi[i]);				
				this.showlayer.removeChild(this.selectItemUi[i]);//					
				
			}			
		}		
		//设定详情装备框状态
		this.setEquipState();
		this.setNomalVisible();//默认显示卡牌信息界面
		
	},
	
		//设定详情装备框取消状态
	setEquipState:function(){
		if(this.changestate != null){			
			for( var i in this.changestate ){ 
				if(this.changestate[i].isVisible())
				{
					this.changestate[i].setVisible(false);
				}		
			}
		}
				
	},

	//阵容界面技能介绍关闭按钮回调
	closedEvent:function(sender, type){ 
		if (type == ccui.Widget.TOUCH_ENDED ) {	
			this.skillDesc.setVisible(false);	
			
		}

	},


	// 详情上阵卡牌技能介绍弹框回调
	btnSkillEvent:function(sender, type){
		var tag = sender.getTag();

		var skillname = ccui.helper.seekWidgetByName(this.skillDesc, "txt_jineng_131");//技能名称
		var skillLev =  ccui.helper.seekWidgetByName(this.skillDesc, "txt_jineng_132");//技能等级
		var skillDesc  = ccui.helper.seekWidgetByName(this.skillDesc, "txt_jineng138");//技能描述
		this.skillDesc.setVisible(true);
		
		
		if(tag == NatureType.Small)
		{ //被动技能			
			skillname.setString( textList[ skillListBig[ cardList[ this.carid ].activeSkillId ].name ].chnStr );			
			skillLev.setString( this.carLev );
			skillDesc.setString( textList[ skillListBig[cardList[ this.carid ].activeSkillId ].desc ].chnStr);
		}
		else if(tag == NatureType.Big)
		{ //主动技能		
			skillname.setString( textList[ skillListSmall[ cardList[ this.carid ].passiveSkillId ].name ].chnStr );
			skillLev.setString(smallCarLev);
			skillDesc.setString( textList[ skillListSmall[cardList[ this.carid ].passiveSkillId ].desc ].chnStr);
		}
		else if(tag == NatureType.Dead)
		{	//死亡技能
			skillname.setString( textList[ skillListDead[ cardList[ this.carid ].deadSkillId ].name ].chnStr );
			skillLev.setString( deadSkillLev );
			skillDesc.setString( textList[ skillListDead[cardList[ this.carid ].deadSkillId ].desc ].chnStr );
		}

	},

	//点击5个卡牌头像回调
	touchHead:function(sender, type){ 
		
		var tag = sender.getTag();
		this.cardTag = tag; 
		if (type == ccui.Widget.TOUCH_ENDED ) {	
			this.touchHeadSetData(tag);	
		}
		//检查设定装备选中框状态
		this.setEquipState();
		this.setNomalVisible();//默认显示卡牌信息界面

	},

	//触摸头像时候调用的设置数据方法
	touchHeadSetData:function(tag){  
		if(this.itemTag == 0){	//当前是 详情界面
			this.setSelectData(tag);//该卡牌设置对应详情
			this.setNomalVisible();

		}
		else if(this.itemTag == 1){ //当前是技能界面
			this.setSkillData(tag);	//设置卡牌技能对应的详情
			this.cardTag = tag;
			this.setSkillDesc(this.cardTag);//设置大技能的 默认介绍
		}
		else if(this.itemTag == 2 ){ //设置卡牌图突破对应的数据
			//this.cardTag = tag;
			this.setBreakthrougtData(this.cardTag);
			
		}
		else if(this.itemTag == 3 ){ //设置卡牌图飞升对应的数据
			this.setSoaringData(this.cardTag);
		}
		//this.selectHeadState(tag);//头像状态
	},

	//点击详情界面的 武器 衣服和首饰 回调
	btn_itemEqueEvent:function(sender, type){
		if (type == ccui.Widget.TOUCH_ENDED ){
			var tag = sender.getTag();
			this.equipItemTag  = tag; //this.equipItemTag 当前点击的是武器标签还是服装或者是首饰的标记
			this._preItem = null;//清空上一次背包 item选中的框
			this.cardInfolayer 	= ccui.helper.seekWidgetByName(this.selectItemUi[0], "cardInfoLayer");//卡牌详细信息层
			this.baglistLayer 	= ccui.helper.seekWidgetByName(this.selectItemUi[0], "baglistLayer");//武器.衣服.首饰 背包层	
			
			var btn_closeBag 	= ccui.helper.seekWidgetByName(this.baglistLayer, "btn_closeBag");//关闭按钮
			btn_closeBag.addTouchEventListener(this.closeBagEvent,this);	
			

			for( var i in this.changestate ){ //设定装备框选中状态
				if( i == tag){	
					this.changestate[i].setVisible(true);
				}else{					
					this.changestate[i].setVisible(false);
				}
			}	


			if (type == ccui.Widget.TOUCH_ENDED ) {	
				
				if(tag == EquipType.Weapons){  //点击的是武器槽位					
					if(userCardInBattleList[this.cardTag].equipSeqID1 != 0){//装备武器槽 不为0	 表示已经装备武器
						//equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type						
						this.setEquipTipsData(  userCardInBattleList[this.cardTag].equipSeqID1 );	
					}
					else{//没有装备武器
						this.getBagEquip(tag);
					}

				}
				else if(tag == EquipType.Clothing){ //点击的是衣服槽位
					if(userCardInBattleList[this.cardTag].equipSeqID2 != 0){//装备衣服槽 不为0	
						//equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type
						this.setEquipTipsData(  userCardInBattleList[this.cardTag].equipSeqID2 );
					}
					else{	//没有装备衣服
						this.getBagEquip(tag);
					}

				}
				else if(tag ==  EquipType.Jewelry){//点击的是首饰槽位
					if(userCardInBattleList[this.cardTag].equipSeqID3 != 0){//装备首饰槽 不为0	
						//equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type
						this.setEquipTipsData(  userCardInBattleList[this.cardTag].equipSeqID3 );
					}
					else{//没有装备首饰
						this.getBagEquip(tag);							

					}
				}				

			}
		}
	},

	setEquipTipsData:function( equipSeqId ){ //参数传递了装备中的装备扩展ID

		this.equipTips 		= ccui.helper.seekWidgetByName(this.selectItemUi[0], "Panel_equipTipsLayer");//装备Tips界面
		var btn_closeQuipTips	= ccui.helper.seekWidgetByName(this.equipTips, "btn_closed");//关闭按钮
		btn_closeQuipTips.addTouchEventListener(this.closeQuipTipsEvent,this);

		var btn_replaceEquip = ccui.helper.seekWidgetByName(this.equipTips, "btn_199");//更换按钮（更换装备） 
		btn_replaceEquip.addTouchEventListener(this.replaceEquipEvent,this);
		
		
		var name 		= equipList[userEquipInCardList[ equipSeqId ].id].name;//装备名字文字ID
		var Lev 		= userEquipInCardList[ equipSeqId ].level; //装备等级
		var iconNum		= equipList[userEquipInCardList[ equipSeqId ].id].iconIndex;//装备图标
		
		var equipName 	= ccui.helper.seekWidgetByName(this.equipTips, "txt_jineng_name");
		var equipLev 	= ccui.helper.seekWidgetByName(this.equipTips, "txt_jineng_dengji");
		var equipIcon		= ccui.helper.seekWidgetByName(this.equipTips, "btn_icon");		
		
		equipName.setString(textList[name].chnStr);
		equipLev.setString("LV."+Lev);
		equipIcon.loadTextures("res/icon/equlicon/"+iconNum+".png","","");
		
		this.showEquipTipsLayer();//显示装备Tips 层
	
	},
	
	//tips装备更换按钮回调
	replaceEquipEvent:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED ){
			if(this.equipItemTag != 0){	//this.equipItemTag 表示当前选择的是装备槽位中的武器,衣服 ,还是首饰槽位			
				this.getBagEquip(this.equipItemTag);
			}
		}
		
	},
	

	
	//获取背包的武器 装备首饰武器
	getBagEquip:function(tag){//参数 ：表示是点击的武器还是衣服或者首饰

		this.equipListView = ccui.helper.seekWidgetByName(this.baglistLayer,"ListView_198_0");				
		//this.equipListView.removeAllItems();//清空列表
		this._chooseEquipList = this.removeAllFromArray(this._chooseEquipList); 

		if( tag == EquipType.Weapons){//表示武器
			for ( var i in userEquipInBagList) {
				if (equipList[userEquipInBagList[i].id].type == 1) {//武器类装备
					this._chooseEquipList.push(userEquipInBagList[i]);
				}
			}			
		}else if( tag == EquipType.Clothing) {//表示衣服			
			for ( var i in userEquipInBagList) {
				if (equipList[userEquipInBagList[i].id].type == 2) {//类装备
					this._chooseEquipList.push(userEquipInBagList[i]);
				}
			}
		}
		else if( tag == EquipType.Jewelry) { //表示首饰
			for ( var i in userEquipInBagList) {
				if (equipList[userEquipInBagList[i].id].type == 3) {//武器类装备
					this._chooseEquipList.push(userEquipInBagList[i]);
				}
			}
		}
		log.i("_chooseEquipList",this._chooseEquipList.length);
		
		this.setEquipmentData(this._chooseEquipList);
		
		
		
//		this.setNomalVisible();//默认显示卡牌信息界面
//		if(this.baglistLayer.isVisible() == false){ //判断是都背包换装界面显示
//			this.baglistLayer.setVisible(true);	
//			this.cardInfolayer.setVisible(false);	
//		}
		this.showBagLayer();//显示背包界面
		
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
	
	

	
	
	
	//设置背包装备数据显示
	setEquipmentData:function(itemList_parameter){ 
		log.i("itemList_parameter",itemList_parameter.length);
		this.equipListView.removeAllItems();
		var line =  Math.floor(itemList_parameter.length / 5) + 1;//行数
		var remainder = itemList_parameter.length % 5;//最后一行的元素个数

		var itembag = ccs.uiReader.widgetFromJsonFile("res/item_bag.json"); //道具框标签
		//itembag.retain();
		for (var i  = 0; i  < line ; i ++) {//装备的每一行
			
			var items 		= itembag.getChildByName("item_bag_0");			
			//var dataOfLine 	= itembag.clone();
			
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
				icon.loadTextures(FILEPATH_ICON+"icon_jingli.png","","");

				//装备数量
				var shuzi = item.getChildByName("txt_shuzhi");
				shuzi.setVisible(false);
				
				//装备品阶框 quality
				var pic_pinzhi = item.getChildByName("pic_pinzhi");
				pic_pinzhi.setVisible(true);

				switch (equipList[this._chooseEquipList[i*5+j].id].quality) {
				case 1:
					pic_pinzhi.loadTexture(FILE_OTHER+"pic_fenhongkuang.png");
					break;
				case 2:
					pic_pinzhi.loadTexture(FILE_OTHER+"pic_hongsekuang.png");
					break;
				case 3:
					pic_pinzhi.loadTexture(FILE_OTHER+"pic_huisekuang.png");
					break;
				default:
					pic_pinzhi.loadTexture(FILE_OTHER+"pic_jinsekuang.png");
				break;
				}

				//等级标签：lv
				var txt_502 = item.getChildByName("txt_502");
				txt_502.setVisible(true);
				var txt_503 = item.getChildByName("txt_503");
				txt_503.setString(this._chooseEquipList[i*5+j].level);

				//缘
				var txt_504 = item.getChildByName("txt_504");
				txt_504.setVisible(true);
				//
				var txt_505 = item.getChildByName("pic_505");
				txt_505.setVisible(true);
			}
			this.equipListView.pushBackCustomItem(itembag);
			this.setBagItemClickState(0);
		}		
		
		this.showBagLayer();

	}, 
	
	//点击背包中的物品回调
	selectedIconEvent:function(sender,type){
		if(type == ccui.Widget.TOUCH_ENDED){			
			var tag = sender.getTag();
			this.setBagItemClickState(tag);
			
			
		}
	},
	
	
	//设置背包的物品选中状态框
	setBagItemClickState:function( tag){
		log.i("controlEquipment","equipment num="+this._chooseEquipList.length);		

		/*选中装备后加边框*/			
		var select_items = this.equipListView.getItem(this.equipListView.getCurSelectedIndex());
		var remainder = ( tag % 5)+1;
		var str = "item"+remainder;
		var select_item = (select_items.getChildByName("item_bag_0")).getChildByName(str);
		if (this._preItem !=null && this._preItem != select_item) {			
			var pre_pic = this._preItem.getChildByName("pic_501");//选中标记
			pre_pic.setVisible(false);
		}
		var cur_pic = select_item.getChildByName("pic_501");//选中标记
		cur_pic.setVisible(true);
		this._preItem = select_item;	
	},
	
	
	
	
	
	//关闭装备tips 界面
	closeQuipTipsEvent:function(sender,type){
		
		this.setNomalVisible();//默认显示卡牌信息界面
		
	},
	
	
	//关闭背包界面
	closeBagEvent:function(sender,type){
		
		this.setNomalVisible();//显示卡牌信息层
		//重新设定详情装备框状态
		this.setEquipState();
	},
	//设置卡牌的详情数据
	setSelectData:function( tag){ 
		this.carid = userCardInBattleList[tag].cardId ;//当前选择的 上阵卡牌ID
		this.carLev = userCardInBattleList[tag].cardLevel; //当前选择卡牌的等级
		this.smallCarLev  = userCardInBattleList[tag].smallSkillLev;//当前选择卡牌小技能 等级
		this.deadSkillLev  = userCardInBattleList[tag].deadSkillLev;

		var card = cardList[ userCardInBattleList[tag].cardId ];
		var  name  = ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_wanjia_name"); //姓名
		var textid = card.name; //文本id
		name.setString(textList[textid].chnStr);
		
		var cardQuality=[];		//品阶星级	
		for(var i =1;i<6;i++){
			cardQuality[i] = ccui.helper.seekWidgetByName(this.selectItemUi[0], "xingxing_0"+i); 
			//cardQuality[i].setVisible(false);
		}			
		
		var quality = userCardInBattleList[tag].quality;	
		log.i("quality",quality);
		if(quality < 6){
			for(var i =1;i<=quality;i++){
				cardQuality[i].setVisible(true);
			}
		}
		else if(quality ==6){ //6星 为5 个月亮
			for(var i =1;i<=5;i++){
				cardQuality[i].loadTexture("res/other/daxing_1.png");
				cardQuality[i].setVisible(true);
			}
			
		}
		else if(quality ==7){// 7 星 为5 个钻石
			cardQuality[i].setVisible(true);
			cardQuality[i].loadTexture("res/other/daxing_1.png");
		}		

		var level    = ccui.helper.seekWidgetByName(this.selectItemUi[0], "AtlasLabel_dengji"); //等级数字标签
		var cardLevel =  userCardInBattleList[tag].cardLevel ;//获取等级		
		level.setString(cardLevel);

		var  userjob  = ccui.helper.seekWidgetByName(this.selectItemUi[0], "pic_wanjia_leixing"); //职业
		var proType = card.proType ;// 职业
		//log.i("proType",proType);		
		userjob.loadTexture(FILEPATH_ICON+""+proType+".png");
		//基础信息
		var cardLev =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_dengji_shuzhi");		
		cardLev.setString(userCardInBattleList[tag].cardLevel); //等级

		var cardrealm =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_jingjie_2");//境界		
		cardrealm.setString( textList[ cardRealmList[ userCardInBattleList[tag].realm ].name ].chnStr );
		
		var race =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_zhongzu_2");//种族	
		race.setString( textList[ card.race ].chnStr);
		
		var exp =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_jingyan_shuzhi");//卡牌经验	
		exp.setString(  userCardInBattleList[tag].cardExp);
		//卡牌属性
		var hp =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_shengming_shuzhi");//生命	
		hp.setString(  userCardInBattleList[tag].hp);
		
		var actkSpeed =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_gongsu_shuzhi");//攻击速度	
		actkSpeed.setString( userCardInBattleList[tag].atkSpeed );
		
		var actk =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_wugong_shuzhi");//物理攻击	
		actk.setString( userCardInBattleList[tag].atk );
		
		var def =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_wufang_shuzhi");//物理防御
		def.setString( userCardInBattleList[tag].def );
		
		var magicActk =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_mogong_shuzhi");//魔法攻击	
		magicActk.setString( userCardInBattleList[tag].magicAtk );
		
		var magicDef =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_mofang_shuzhi");//魔法防御
		magicDef.setString( userCardInBattleList[tag].magicDef );
		
		var baoji =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_baoji_shuzhi");//暴击
		baoji.setString( userCardInBattleList[tag].baoji );
		
		var baokang =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_fangbao_shuzhi");//防暴
		baokang.setString( userCardInBattleList[tag].baokang );

		var hit =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_mingzhong_shuzhi_0");//命中
		hit.setString( userCardInBattleList[tag].hit );
		
		var dodge =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_shanbi_shuzhi");//闪避
		dodge.setString( userCardInBattleList[tag].dodge );
		//技能信息
		//log.i("dajinengid",userCardInBattleList[tag].activeSkillId);	
		
		var skillname=  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_jineng_032");//大技能名称		
		skillname.setString( textList[ skillListBig[ card.activeSkillId ].name ].chnStr );

		var skillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_032");//大技能等级
		skillLev.setString( userCardInBattleList[tag].skillLev );

		var smallSkillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_jineng_033");//小技能名称
		smallSkillLev.setString(textList[ skillListSmall[ card.passiveSkillId ].name ].chnStr );

		var skillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_033");//小技能等级
		skillLev.setString( userCardInBattleList[tag].smallSkillLev );
		log.i("dead",userCardInBattleList[tag].deadSkillId );	

		 
		if (userCardInBattleList[tag].deadSkillId != 0){
			var deadSkillname =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_jineng_034");//死亡技能名称
			deadSkillname.setString( textList[ skillListDead[ userCardInBattleList[tag].deadSkillId ].name ].chnStr );

			var deadSkillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "txt_034");//死亡技能等级
			deadSkillLev.setString( userCardInBattleList[tag].deadSkillLev );

			var btn_deadSkill =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "pic_jineng_3");//死亡技能节点
			btn_deadSkill.setVisible(true);
		}
		else{
			var btn_deadSkill =  ccui.helper.seekWidgetByName(this.selectItemUi[0], "pic_jineng_3");//死亡技能节点
			btn_deadSkill.setVisible(false);
		}

		var cardDesc = ccui.helper.seekWidgetByName(this.selectItemUi[0],"txt_wuzhechuanshuo_miaoshu");//上阵卡牌描述
		cardDesc.setString(textList[ cardList[ userCardInBattleList[tag].cardId].desc].chnStr );
		
		//卡牌身上的装备槽显示
		var equ1 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_zhuangbei1"); //装备漕1	(武器槽)	
		var equ2 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_zhuangbei2"); //装备漕2（衣服槽）
		var equ3 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_zhuangbei3"); //装备漕2（首饰槽）
		
		
		equ1.loadTextures(FILEPATH_ICON+"equlicon/pic_zhuangbeiwei_wuqi.png","","");
		equ2.loadTextures(FILEPATH_ICON+"equlicon/pic_zhuangbeiwei_yifu.png","","");
		equ3.loadTextures(FILEPATH_ICON+"equlicon/pic_zhuangbeiwei_shoushi.png","","");		
	
		
		if( userCardInBattleList[tag].equipSeqID1 != 0 ){
			//log.i("ddddd",userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id);
			//log.i( "equ", equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].iconIndex );
			if(equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type == 1){//武器	
				//设置武器图片
				equ1.loadTextures(FILEPATH_ICON+"equlicon/"+equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].iconIndex+".png","","");
				//设置武器品质框
				var qualityUi =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"pic_pinzhi1"); //设置武器品质框			
				var quality = equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].quality;//武器【品质】数据				
				switch(quality){					
					case EquipQuality.Gray:
							qualityUi.loadTexture(FILE_OTHER+"pic_huisekuang.png");					
							break;
					case EquipQuality.Green:
							qualityUi.loadTexture(FILE_OTHER+"pic_lvsekuang.png");
							break;
					case EquipQuality.Bule:
							qualityUi.loadTexture(FILE_OTHER+"pic_lansekuang.png");
							break;
					case EquipQuality.Purple:
							qualityUi.loadTexture(FILE_OTHER+"pic_zisekuang.png");
							break;
					case EquipQuality.Gloden:
							qualityUi.loadTexture(FILE_OTHER+"pic_jinsekuang.png");
							break;
					case EquipQuality.Pink:
							qualityUi.loadTexture(FILE_OTHER+"pic_fenhongkuang.png");
							break;
					case EquipQuality.Red:
							qualityUi.loadTexture(FILE_OTHER+"pic_hongsekuang.png");
							break;				
				}
			}
		}			
		
		if( userCardInBattleList[tag].equipSeqID2 != 0 ){	
			if(equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type == 2){//衣服
				//设置衣服图片
				equ2.loadTextures(FILEPATH_ICON+"equlicon/"+equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID2 ].id ].iconIndex+".png","","");
				var qualityUi =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"pic_pinzhi2"); //设置品衣服质框
				var quality = equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID2 ].id ].quality;//衣服【品质】数据	
				switch(quality){					
				case 1:
					qualityUi.loadTexture(FILE_OTHER+"pic_huisekuang.png");					
					break;
				case 2:
					qualityUi.loadTexture(FILE_OTHER+"pic_lvsekuang.png");
					break;
				case 3:
					qualityUi.loadTexture(FILE_OTHER+"pic_lansekuang.png");
					break;
				case 4:
					qualityUi.loadTexture(FILE_OTHER+"pic_zisekuang.png");
					break;
				case 5:
					qualityUi.loadTexture(FILE_OTHER+"pic_jinsekuang.png");
					break;
				case 6:
					qualityUi.loadTexture(FILE_OTHER+"pic_fenhongkuang.png");
					break;
				case 7:
					qualityUi.loadTexture(FILE_OTHER+"pic_hongsekuang.png");
					break;				
				}
			}
		}
		
		if( userCardInBattleList[tag].equipSeqID3 != 0 ){	
			if(equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID1 ].id ].type == 3){ //首饰
				equ3.loadTextures(FILEPATH_ICON+"equlicon/"+equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID3 ].id ].iconIndex+".png","","");
				var qualityUi =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"pic_pinzhi3"); //设置品首饰品质框
				var quality = equipList[ userEquipInCardList[ userCardInBattleList[tag].equipSeqID3 ].id ].quality;//衣服【品质】数据	
				switch(quality){					
				case 1:
					qualityUi.loadTexture(FILE_OTHER+"pic_huisekuang.png");				
					break;
				case 2:
					qualityUi.loadTexture(FILE_OTHER+"pic_lvsekuang.png");
					break;
				case 3:
					qualityUi.loadTexture(FILE_OTHER+"pic_lansekuang.png");
					break;
				case 4:
					qualityUi.loadTexture(FILE_OTHER+"pic_zisekuang.png");
					break;
				case 5:
					qualityUi.loadTexture(FILE_OTHER+"pic_jinsekuang.png");
					break;
				case 6:
					qualityUi.loadTexture(FILE_OTHER+"pic_fenhongkuang.png");
					break;
				case 7:
					qualityUi.loadTexture(FILE_OTHER+"pic_hongsekuang.png");
					break;				
				}
			}
		}
		
		
		//卡牌已经装备的武魂显示	
		equ1 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_wuhun1"); //武魂漕1		
		equ2 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_wuhun2"); //武魂漕2
		equ3 =  ccui.helper.seekWidgetByName(this.selectItemUi[0],"btn_wuhun3"); //武魂漕3
		
		equ1.loadTextures(FILE_OTHER+"pic_zhuangbeiwei_wuhun.png", "", "");
		equ2.loadTextures(FILE_OTHER+"pic_zhuangbeiwei_wuhun.png", "", "");
		equ3.loadTextures(FILE_OTHER+"pic_zhuangbeiwei_wuhun.png", "", "");
		
		if( userCardInBattleList[tag].soulSeqID1 != 0 ){
			equ1.loadTextures(FILEPATH_ICON+"soulicon/"+soulList[ userSoulInCardList[ userCardInBattleList[tag].soulSeqID1 ].id ].iconIndex+".png","","");
		}
		if( userCardInBattleList[tag].soulSeqID2 != 0 ){
			equ2.loadTextures(FILEPATH_ICON+"soulicon/"+soulList[ userSoulInCardList[ userCardInBattleList[tag].soulSeqID2 ].id ].iconIndex+".png","","");
		}
		if( userCardInBattleList[tag].soulSeqID3 != 0 ){
			equ3.loadTextures(FILEPATH_ICON+"soulicon/"+soulList[ userSoulInCardList[ userCardInBattleList[tag].soulSeqID3 ].id ].iconIndex+".png","","");
		}
		
		//卡牌骨骼预览
		var layerTemp;
		var sprite;
		layerTemp = ccui.helper.seekWidgetByName(this.selectItemUi[0], "Panel_guge");
		for(var i in userCardInBattleList)
		{    
			if(i == tag ){				
				var card = userCardInBattleList[i];
				var baseCard = cardList[card.cardId];
				var point = userCardInBattleList[i].point;
			
				sprite = new AnimationCard(baseCard.imageIndex),	
				
				layerTemp.removeAllChildren();
				log.i("panel_card"+i);    		
				sprite.armature.x = layerTemp.getSize().width/2;
				sprite.armature.y = 0;	
				sprite.playStandby();
				
				layerTemp.addChild(sprite.armature,99);

			//layerTemp.addTouchEventListener(this.HeroEvent,this);
			}	
		}
		
	},
	
	//设置技能界面的数据
	setSkillData:function(tag){
		this.carid = userCardInBattleList[tag].cardId ;//当前选择的 上阵卡牌ID
		this.carLev = userCardInBattleList[tag].cardLevel; //当前选择卡牌的等级
		this.smallCarLev  = userCardInBattleList[tag].smallSkillLev;//当前选择卡牌小技能 等级
		this.deadSkillLev  = userCardInBattleList[tag].deadSkillLev;//死亡技能等级
		var card = cardList[ userCardInBattleList[tag].cardId ];
		
		var skillname=  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_263");//大技能名称
		skillname.setString( textList[ skillListBig[ card.activeSkillId ].name ].chnStr );		
		
		var skillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_263_2");//大技能等级
		skillLev.setString( userCardInBattleList[tag].skillLev );
		
		var smallSkillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_284");//小技能名称
		smallSkillLev.setString(textList[ skillListSmall[ card.passiveSkillId ].name ].chnStr );

		var skillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_284_2");//小技能等级
		skillLev.setString( userCardInBattleList[tag].smallSkillLev );


		var btn_deadSkill; //死亡技能
		if (userCardInBattleList[tag].deadSkillId != 0){

			btn_deadSkill =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "btn_290");//死亡技能节点
			btn_deadSkill.setVisible(true);
		}
		else{
			btn_deadSkill =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "btn_290");//死亡技能节点
			//btn_deadSkill.setVisible(false);
		}

		var skillbtn;
		for(var i = 1;i<3;i++){ //主动技能 被动技能监听
			skillbtn = 	ccui.helper.seekWidgetByName(this.selectItemUi[1], "btn_"+(254+i));
			skillbtn.setTag(10+i);
			skillbtn.addTouchEventListener(this.btnSetSkillinfoEvent,this); //监听按钮
		}

		this.setSkillDesc(this.cardTag);//默认设置大技能的 数据

	},


	// 技能界面 技能大按钮回调
	btnSetSkillinfoEvent:function(sender,type){
		var tag  = sender.getTag();		
		switch (type) {		
			case ccui.Widget.TOUCH_ENDED:				
				if(tag == 11){ //大技能回调				
					this.setSkillDesc(this.cardTag);//设置大技能的介绍	
				}
				else if(tag == 12){//小技能回调					
					//log.i("setSmallSkillDesc",this.cardTag  );
					this.setSmallSkillDesc(this.cardTag);//设置小技能的介绍 this.cardTag是 当前选择的人卡牌 索引【1-5】
				}
				break;
		}
	},
	
	setSkillDesc: function( cardTag ){ //设置技能界面的 主动技能介绍
		
		var btnNode;		
		var skillLev;
		var skilldesc;
		var skillLevDesc;
		log.i("cardTag",this.cardTag);
		btnNode = ccui.helper.seekWidgetByName( this.selectItemUi[1], "txt_376");//大技能名字
		btnNode.setString( textList[ skillListBig[ cardList[ userCardInBattleList[cardTag].cardId ].activeSkillId ].name ].chnStr );
		
		skillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_375_1");//大技能等级		
		skillLev.setString( userCardInBattleList[cardTag].skillLev);
		
		skilldesc=  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_393_1");//大技能描述
		skilldesc.setString( textList[ skillListBig[ cardList[ userCardInBattleList[cardTag].cardId ].activeSkillId ].desc ].chnStr);
		
		//skillLevDesc = ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_393_1");//当前技能等级描述		
		//skillLevDesc.setString(	textList[ skillProList[ cardList[ userCardInBattleList[cardTag].cardId ].activeSkillId ].attackValue ].chnStr);
	},
	
	setSmallSkillDesc:function( cardTag ){ //设置小技能介绍
		var btnsmallNode;		
		var smallSkillLev;
		var smallskilldesc;
		var smallskillLevDesc;
		btnsmallNode = ccui.helper.seekWidgetByName( this.selectItemUi[1], "txt_376");//小技能名字
		btnsmallNode.setString( textList[ skillListSmall[ cardList[ userCardInBattleList[cardTag].cardId ].passiveSkillId ].name ].chnStr );
		
		smallSkillLev =  ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_375_1");//小技能等级		
		smallSkillLev.setString( userCardInBattleList[cardTag].smallSkillLev);
		
		smallskilldesc = ccui.helper.seekWidgetByName(this.selectItemUi[1], "txt_393_1");//小技能描述
		smallskilldesc.setString( textList[ skillListSmall[ cardList[ userCardInBattleList[cardTag].cardId ].passiveSkillId ].desc ].chnStr);
		
		
		
	},
	
	
	
	//设置突破界面数据
	setBreakthrougtData:function(cardTag){
		log.i("cardTag",cardTag);
		var cardrealm =  ccui.helper.seekWidgetByName(this.selectItemUi[2], "txt_608");//境界		
		cardrealm.setString( textList[ cardRealmList[ userCardInBattleList[cardTag].realm ].name ].chnStr );

		var headicon1 =  ccui.helper.seekWidgetByName(this.selectItemUi[2], "btn_touxiang5");//头像1	
		headicon1.loadTextures("res/card/small/"+ cardList[ userCardInBattleList[cardTag].cardId ].icon+".png","","" );

		var headicon2 =  ccui.helper.seekWidgetByName(this.selectItemUi[2], "btn_touxiang6");//头像2	
		log.i("fffff",userCardInBattleList[cardTag].cardId);
		headicon2.loadTextures("res/card/small/"+ cardList[ userCardInBattleList[cardTag].cardId ].icon+".png","","" );


	},
	
	//社设置飞升数据
	setSoaringData:function( cardTag ){
		var cardrealm =  ccui.helper.seekWidgetByName(this.selectItemUi[3], "txt_708");//品阶	
		log.i("qqqqqqqq",userCardInBattleList[ cardTag].cardId);
		//cardrealm.setString( textList[ cardProList[ (userCardInBattleList[ cardTag].cardId) ][ userCardInBattleList[ cardTag].quality ] ].chnStr );
		
	
		

		var headicon1 =  ccui.helper.seekWidgetByName(this.selectItemUi[3], "btn_touxiang5");//头像1	
		
		headicon1.loadTextures("res/card/small/"+ cardList[ userCardInBattleList[cardTag].cardId ].icon+".png","","" );

		var headicon2 =  ccui.helper.seekWidgetByName(this.selectItemUi[3], "btn_touxiang6");//头像2	
		headicon2.loadTextures("res/card/small/"+ cardList[ userCardInBattleList[cardTag].cardId ].icon+".png","","" );
	},
	
	//萃体按钮回调
	cuitiEvent:function(sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {	
			log.i("cardTag",this.cardTag);
			this.setCuitiData(this.cardTag);//设置萃体数据
			this.showCuitiLayer();//显示萃体层
		}
	},
	
	//设置垂体数据
	setCuitiData:function(cardTag){ //参数：上阵卡牌索引
		var attribute  = userCardInBattleList[cardTag].attribute; //卡牌的萃体点
		var cardAttribute = ccui.helper.seekWidgetByName(this.cuitiInfolayer, "txt_shuzhi");//总的萃体点
		cardAttribute.setString(userCardInBattleList[cardTag].attribute);
		
		var hp = ccui.helper.seekWidgetByName(this.cuitiInfolayer, "txt_shengming_02");//血
		hp.setString(userCardInBattleList[cardTag].hp);
		
		var attack = ccui.helper.seekWidgetByName(this.cuitiInfolayer, "txt_gongji_02");//攻击
		attack.setString(userCardInBattleList[cardTag].atk);
		
		var def = ccui.helper.seekWidgetByName(this.cuitiInfolayer, "txt_fangyu_02");//防御
		def.setString(userCardInBattleList[cardTag].def);
		
		
	},
	
	//默认显示卡牌信息界面
	setNomalVisible:function(){
		
		if(this.cardInfolayer!= null){
			this.cardInfolayer.setVisible(true);
		}
		else {			
			this.cardInfolayer 	= ccui.helper.seekWidgetByName(this.selectItemUi[0], "cardInfoLayer");
		}
						
		if(this.equipTips != null&&this.equipTips.isVisible()){			
			this.equipTips.setVisible(false);
		}
		if(this.baglistLayer != null&&this.baglistLayer.isVisible()){
			this.baglistLayer.setVisible(false);
		}
		if (this.cuitiInfolayer != null&&this.cuitiInfolayer.isVisible()){
			this.cuitiInfolayer.setVisible(false);
		}
	},
	
	//显示背包层
	showBagLayer:function(){
		
		this.baglistLayer.setVisible(true);	//显示背包界面		
		if (this.cardInfolayer !=null&&this.cardInfolayer.isVisible()){			
			this.cardInfolayer.setVisible(false);
		}
		if(this.equipTips != null&&this.equipTips.isVisible()){	
			this.equipTips.setVisible(false);
		}
		if(this.cuitiInfolayer != null&&this.cuitiInfolayer.isVisible()){			
			this.cuitiInfolayer.setVisible(false);
		}

	},
	
	//显示装备Tips界面
	showEquipTipsLayer:function(){
		
		this.equipTips.setVisible(true);	//显示装备Tips界面		
		if (this.cardInfolayer !=null&&this.cardInfolayer.isVisible()){			
			this.cardInfolayer.setVisible(false);
		}
		if(this.baglistLayer != null&&this.baglistLayer.isVisible()){	
			this.baglistLayer.setVisible(false);
		}
		if(this.cuitiInfolayer != null&&this.cuitiInfolayer.isVisible()){			
			this.cuitiInfolayer.setVisible(false);
		}
	},
	
	
	//显示萃体层
	showCuitiLayer:function(){
		this.cuitiInfolayer.setVisible(true);	//显示萃体界面		
		if (this.cardInfolayer != null&&this.cardInfolayer.isVisible()){			
			this.cardInfolayer.setVisible(false);
		}
		if(this.equipTips != null&&this.equipTips.isVisible()){	
			this.equipTips.setVisible(false);
		}
		if(this.baglistLayer != null&&this.baglistLayer.isVisible()){			
			this.baglistLayer.setVisible(false);
		}
	},
	
	//布阵按钮回调
	buzhenEvent : function (sender,type){
		if (type == ccui.Widget.TOUCH_ENDED) {
		
			log.i("buzhen_touch_end");
			var layer = new LayerBuzhen();
			this.addChild(layer,101);
		}
	},
	
	//关闭布阵界面
	closeEvent : function (sender,type){
		log.i("close_touch");
		if (type ==ccui.Widget.TOUCH_ENDED) {
			
			this.removeFromParent();		
			
		}
	},
	
	onEnter:function (){
		this._super();

		log.i("LayerZhenrong_OnEnter");
	},

	onExit:function (){
		this._super();
		delete this;
		log.i("LayerZhenrong_OnExit");

		for(var i in this.selectItemUi){			
			this.selectItemUi[i].release();
		}
		this.selectItemUi.length = 0;
	}
	

});