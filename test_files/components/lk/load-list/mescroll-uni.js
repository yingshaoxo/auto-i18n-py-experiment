/* mescroll
 * version 1.2.5
 * 2020-03-15 wenju
 * http://www.mescroll.com
 */

export default function MeScroll(options, isScrollBody) {
	let me = this;
	me.version = '1.2.5'; // mescroll版本號
	me.options = options || {}; // 配置
	me.isScrollBody = isScrollBody || false; // 滾動區域是否為原生頁面滾動; 默認為scroll-view

	me.isDownScrolling = false; // 是否在執行下拉刷新的回調
	me.isUpScrolling = false; // 是否在執行上拉加載的回調
	let hasDownCallback = me.options.down && me.options.down.callback; // 是否配置了down的callback

	// 初始化下拉刷新
	me.initDownScroll();
	// 初始化上拉加載,則初始化
	me.initUpScroll();

	// 自動加載
	setTimeout(function() { // 待主線程執行完畢再執行,避免new MeScroll未初始化,在回調獲取不到mescroll的實例
		// 自動觸發下拉刷新 (只有配置了down的callback才自動觸發下拉刷新)
		if (me.optDown.use && me.optDown.auto && hasDownCallback) {
			if (me.optDown.autoShowLoading) {
				me.triggerDownScroll(); // 顯示下拉進度,執行下拉回調
			} else {
				me.optDown.callback && me.optDown.callback(me); // 不顯示下拉進度,直接執行下拉回調
			}
		}
		// 自動觸髮上拉加載
		setTimeout(function(){ // 延時確保先執行down的callback,再執行up的callback,因為部分小程序emit是異步,會導致isUpAutoLoad判斷有誤
			me.optUp.use && me.optUp.auto && !me.isUpAutoLoad && me.triggerUpScroll();
		},100)
	}, 30); // 需讓me.optDown.inited龢me.optUp.inited先執行
}

/* 配置參數:下拉刷新 */
MeScroll.prototype.extendDownScroll = function(optDown) {
	// 下拉刷新的配置
	MeScroll.extend(optDown, {
		use: true, // 是否啟用下拉刷新; 默認true
		auto: true, // 是否在初始化完畢之後自動執行下拉刷新的回調; 默認true
		native: false, // 是否使用系統自帶的下拉刷新; 默認false; 僅mescroll-body生效 (值為true時,還需在pages配置enablePullDownRefresh:true;詳請參考mescroll-native的案例)
		autoShowLoading: false, // 如果設置auto=true(在初始化完畢之後自動執行下拉刷新的回調),那麼是否顯示下拉刷新的進度; 默認false
		isLock: false, // 是否鎖定下拉刷新,默認false;
		offset: 80, // 在列表頂部,下拉大於80px,鬆手即可觸發下拉刷新的回調
		startTop: 100, // scroll-view滚动到頂部時,此時的scroll-top不一定為0, 此值用於控制最大的誤差
		fps: 80, // 下拉節流 (值越大每秒刷新頻率越高)
		inOffsetRate: 1, // 在列表頂部,下拉的距離小於offset時,改變下拉區域高度比例;值小於1且越接近0,高度變化越小,表現為越往下越難拉
		outOffsetRate: 0.2, // 在列表頂部,下拉的距離大於offset時,改變下拉區域高度比例;值小於1且越接近0,高度變化越小,表現為越往下越難拉
		bottomOffset: 20, // 當手指touchmove位置在距離body底部20px范围内的時候結束上拉刷新,避免Webview嵌套導致touchend事件不執行
		minAngle: 45, // 向下滑動最少偏移的角度,取值區間  [0,90];默認45度,即向下滑動的角度大於45度則觸發下拉;而小於45度,將不觸發下拉,避免與左右滑動的輪播等組件衝突;
		textInOffset: '下拉刷新', // 下拉的距離在offset範圍內的提示文本
		textOutOffset: '釋放更新', // 下拉的距離大於offset範圍的提示文本
		textLoading: '加載中 ...', // 加載中的提示文本
		bgColor: "transparent", // 背景顏色 (建議在pages.json中再設置一下backgroundColorTop)
		textColor: "gray", // 文本顏色 (當bgColor配置了顏色,而textColor未配置時,則textColor会默認為白色)
		inited: null, // 下拉刷新初始化完畢的回調
		inOffset: null, // 下拉的距離進入offset範圍內那一刻的回調
		outOffset: null, // 下拉的距離大於offset那一刻的回調
		onMoving: null, // 下拉過程中的回調,滑動過程一直在執行; rate下拉区域當前高度与指定距離的比值(inOffset: rate<1; outOffset: rate>=1); downHight當前下拉區域的高度
		beforeLoading: null, // 準備觸發下拉刷新的回調: 如果return true,將不觸發showLoading龢callback回調; 常用來完全自定義下拉刷新, 參考案例【淘寶 v6.8.0】
		showLoading: null, // 显示下拉刷新进度的回調
		afterLoading: null, // 准备結束下拉的回調. 返回結束下拉的延時执行時间,默認0ms; 常用於結束下拉之前再顯示另外一小段動畫,才去隱藏下拉刷新的場景, 參考案例【dotJump】
		endDownScroll: null, // 結束下拉刷新的回調
		callback: function(mescroll) {
			// 下拉刷新的回調;默認重置上拉加載列表為第一頁
			mescroll.resetUpScroll();
		}
	})
}

/* 配置參數:上拉加載 */
MeScroll.prototype.extendUpScroll = function(optUp) {
	// 上拉加載的配置
	MeScroll.extend(optUp, {
		use: true, // 是否启用上拉加載; 默認true
		auto: true, // 是否在初始化完毕之后自动执行上拉加載的回調; 默認true
		isLock: false, // 是否鎖定上拉加載,默認false;
		isBoth: true, // 上拉加載時,如果滑动到列表顶部是否可以同時觸發下拉刷新;默認true,两者可同時觸發;
		isBounce: false, // 默認禁止橡皮筋的回彈效果, 必讀事項: http://www.mescroll.com/qa.html?v=190725#q25
		callback: null, // 上拉加載的回調;function(page,mescroll){ }
		page: {
			num: 0, // 當前頁码,默認0,回調之前会加1,即callback(page)會從1開始
			size: 10, // 每頁數據的數量
			time: null // 加载第一頁数据服务器返回的時间; 防止用户翻頁時,後臺新增了數據從而導致下一頁數據重複;
		},
		noMoreSize: 5, // 如果列表已無數據,可設置列表的總數量要大於等於5條才顯示無更多數據;避免列表數據過少(比如只有一條數據),顯示無更多數據會不好看
		offset: 80, // 距底部多远時,觸發upCallback
		textLoading: '加載中 ...', // 加載中的提示文本
		textNoMore: '-- END --', // 沒有更多數據的提示文本
		bgColor: "transparent", // 背景顏色 (建議在pages.json中再設置一下backgroundColorBottom)
		textColor: "gray", // 文本顏色 (當bgColor配置了顏色,而textColor未配置時,則textColor会默認為白色)
		inited: null, // 初始化完毕的回調
		showLoading: null, // 显示加載中的回調
		showNoMore: null, // 顯示無更多數據的回調
		hideUpScroll: null, // 隱藏上拉加載的回調
		errDistance: 60, // endErr的時候需往上滑动一段距离,使其往下滑动時再次觸發onReachBottom,僅mescroll-body生效
		toTop: {
			// 回到頂部按鈕,需配置src才顯示
			src: null, // 圖片路徑,默認null (絕對路徑或網絡圖)
			offset: 1000, // 列表滚动多少距离才顯示回到頂部按鈕,默認1000
			duration: 300, // 回到頂部的动画時长,默認300ms (當值為0或300則使用系统自带回到頂部,更流暢; 其他值則通过step模擬,部分機型可能不夠流暢,所以非特殊情況不建議修改此項)
			btnClick: null, // 点击按鈕的回調
			onShow: null, // 是否显示的回調
			zIndex: 9990, // fixed定位z-index值
			left: null, // 到左邊的距離, 默認null. 此项有值時,right不生效. (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字則默認單位rpx)
			right: 20, // 到右邊的距離, 默認20 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字則默認單位rpx)
			bottom: 120, // 到底部的距離, 默認120 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字則默認單位rpx)
			safearea: false, // bottom的偏移量是否加上底部安全區的距離, 默認false, 需要適配iPhoneX時使用 (具體的界面如果不配置此項,則取本vue的safearea值)
			width: 72, // 回到頂部圖標的寬度, 默認72 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字則默認單位rpx)
			radius: "50%" // 圓角, 默認"50%" (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字則默認單位rpx)
		},
		empty: {
			use: true, // 是否顯示空布局
			icon: null, // 圖標路徑
			tip: '~ 暫無相關數據 ~', // 提示
			btnText: '', // 按鈕
			btnClick: null, // 点击按鈕的回調
			onShow: null, // 是否显示的回調
			fixed: false, // 是否使用fixed定位,默認false; 配置fixed為true,以下的top龢zIndex才生效 (transform會使fixed失效,最终会降级為absolute)
			top: "100rpx", // fixed定位的top值 (完整的單位值,如 "10%"; "100rpx")
			zIndex: 99 // fixed定位z-index值
		},
		onScroll: false // 是否監聽滾動事件
	})
}

/* 配置參數 */
MeScroll.extend = function(userOption, defaultOption) {
	if (!userOption) return defaultOption;
	for (let key in defaultOption) {
		if (userOption[key] == null) {
			let def = defaultOption[key];
			if (def != null && typeof def === 'object') {
				userOption[key] = MeScroll.extend({}, def); // 深度匹配
			} else {
				userOption[key] = def;
			}
		} else if (typeof userOption[key] === 'object') {
			MeScroll.extend(userOption[key], defaultOption[key]); // 深度匹配
		}
	}
	return userOption;
}

/* 简单判斷是否配置了顏色 (非透明,非白色) */
MeScroll.prototype.hasColor = function(color) {
	if(!color) return false;
	let c = color.toLowerCase();
	return c != "#fff" && c != "#ffffff" && c != "transparent" && c != "white"
}

/* -------初始化下拉刷新------- */
MeScroll.prototype.initDownScroll = function() {
	let me = this;
	// 配置參數
	me.optDown = me.options.down || {};
	if(!me.optDown.textColor && me.hasColor(me.optDown.bgColor)) me.optDown.textColor = "#fff"; // 當bgColor有值且textColor未設置,則textColor默認白色
	me.extendDownScroll(me.optDown);
	
	// 如果是mescroll-body且配置了native,則禁止自定義的下拉刷新
	if(me.isScrollBody && me.optDown.native){
		me.optDown.use = false
	}else{
		me.optDown.native = false // 僅mescroll-body支持,mescroll-uni不支持
	}
	
	me.downHight = 0; // 下拉區域的高度

	// 在頁面中加入下拉布局
	if (me.optDown.use && me.optDown.inited) {
		// 初始化完毕的回調
		setTimeout(function() { // 待主線程執行完畢再執行,避免new MeScroll未初始化,在回調獲取不到mescroll的實例
			me.optDown.inited(me);
		}, 0)
	}
}

/* 列表touchstart事件 */
MeScroll.prototype.touchstartEvent = function(e) {
	if (!this.optDown.use) return;

	this.startPoint = this.getPoint(e); // 記錄起點
	this.startTop = this.getScrollTop(); // 記錄此時的滚动條位置
	this.lastPoint = this.startPoint; // 重置上次move的點
	this.maxTouchmoveY = this.getBodyHeight() - this.optDown.bottomOffset; // 手指觸摸的最大範圍(寫在touchstart避免body获取高度為0的情況)
	this.inTouchend = false; // 標記不是touchend
}

/* 列表touchmove事件 */
MeScroll.prototype.touchmoveEvent = function(e) {
	// #ifdef H5
	window.isPreventDefault = false // 標記不需要阻止window事件
	// #endif
	
	if (!this.optDown.use) return;
	if (!this.startPoint) return;
	let me = this;

	// 節流
	let t = new Date().getTime();
	if (me.moveTime && t - me.moveTime < me.moveTimeDiff) { // 小於節流時间,則不處理
		return;
	} else {
		me.moveTime = t
		if(!me.moveTimeDiff) me.moveTimeDiff = 1000 / me.optDown.fps
	}

	let scrollTop = me.getScrollTop(); // 當前滚动條的距离
	let curPoint = me.getPoint(e); // 當前点

	let moveY = curPoint.y - me.startPoint.y; // 龢起点比,移動的距離,大於0向下拉,小於0向上拉

	// 向下拉 && 在頂部
	// mescroll-body,直接判定在頂部即可
	// scroll-view在滚动時不会觸發touchmove,當触顶/底/左/右時,才会觸發touchmove
	// scroll-view滚动到頂部時,scrollTop不一定為0; 在iOS的APP中scrollTop可能為负数,不一定龢startTop相等
	if (moveY > 0 && (
			(me.isScrollBody && scrollTop <= 0)
			||
			(!me.isScrollBody && (scrollTop <= 0 || (scrollTop <= me.optDown.startTop && scrollTop === me.startTop)) )
		)) {
		// 可下拉的條件
		if (!me.inTouchend && !me.isDownScrolling && !me.optDown.isLock && (!me.isUpScrolling || (me.isUpScrolling &&
				me.optUp.isBoth))) {

			// 下拉的角度是否在配置的範圍內
			let angle = me.getAngle(me.lastPoint, curPoint); // 兩點之間的角度,區間 [0,90]
			if (angle < me.optDown.minAngle) return; // 如果小於配置的角度,則不往下执行下拉刷新

			// 如果手指的位置超過配置的距離,則提前結束下拉,避免Webview嵌套導致touchend无法觸發
			if (me.maxTouchmoveY > 0 && curPoint.y >= me.maxTouchmoveY) {
				me.inTouchend = true; // 標記執行touchend
				me.touchendEvent(); // 提前觸發touchend
				return;
			}
			
			// #ifdef H5
			window.isPreventDefault = true // 標記阻止window事件
			// #endif
			me.preventDefault(e); // 阻止默認事件

			let diff = curPoint.y - me.lastPoint.y; // 龢上次比,移動的距離 (大於0向下,小於0向上)

			// 下拉距離  < 指定距離
			if (me.downHight < me.optDown.offset) {
				if (me.movetype !== 1) {
					me.movetype = 1; // 加入標記,保證只執行一次
					me.optDown.inOffset && me.optDown.inOffset(me); // 进入指定距離範圍內那一刻的回調,只執行一次
					me.isMoveDown = true; // 標記下拉區域高度改變,在touchend重置回來
				}
				me.downHight += diff * me.optDown.inOffsetRate; // 越往下,高度變化越小

				// 指定距離  <= 下拉距離
			} else {
				if (me.movetype !== 2) {
					me.movetype = 2; // 加入標記,保證只執行一次
					me.optDown.outOffset && me.optDown.outOffset(me); // 下拉超过指定距離那一刻的回調,只執行一次
					me.isMoveDown = true; // 標記下拉區域高度改變,在touchend重置回來
				}
				if (diff > 0) { // 向下拉
					me.downHight += Math.round(diff * me.optDown.outOffsetRate); // 越往下,高度變化越小
				} else { // 向上收
					me.downHight += diff; // 向上收回高度,則向上滑多少收多少高度
				}
			}

			let rate = me.downHight / me.optDown.offset; // 下拉区域當前高度与指定距離的比值
			me.optDown.onMoving && me.optDown.onMoving(me, rate, me.downHight); // 下拉過程中的回調,一直在執行
		}
	}

	me.lastPoint = curPoint; // 記錄本次移动的點
}

/* 列表touchend事件 */
MeScroll.prototype.touchendEvent = function(e) {
	if (!this.optDown.use) return;
	// 如果下拉區域高度已改變,則需重置回來
	if (this.isMoveDown) {
		if (this.downHight >= this.optDown.offset) {
			// 符合觸發刷新的條件
			this.triggerDownScroll();
		} else {
			// 不符合的話 則重置
			this.downHight = 0;
			this.optDown.endDownScroll && this.optDown.endDownScroll(this);
		}
		this.movetype = 0;
		this.isMoveDown = false;
	} else if (!this.isScrollBody && this.getScrollTop() === this.startTop) { // scroll-view到頂/左/右/底的滑動事件
		let isScrollUp = this.getPoint(e).y - this.startPoint.y < 0; // 龢起点比,移動的距離,大於0向下拉,小於0向上拉
		// 上滑
		if (isScrollUp) {
			// 需檢查滑動的角度
			let angle = this.getAngle(this.getPoint(e), this.startPoint); // 兩點之間的角度,區間 [0,90]
			if (angle > 80) {
				// 检查并觸發上拉
				this.triggerUpScroll(true);
			}
		}
	}
}

/* 根據點擊滑動事件獲取第一個手指的坐標 */
MeScroll.prototype.getPoint = function(e) {
	if (!e) {
		return {
			x: 0,
			y: 0
		}
	}
	if (e.touches && e.touches[0]) {
		return {
			x: e.touches[0].pageX,
			y: e.touches[0].pageY
		}
	} else if (e.changedTouches && e.changedTouches[0]) {
		return {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}
	} else {
		return {
			x: e.clientX,
			y: e.clientY
		}
	}
}

/* 计算兩點之間的角度: 區間 [0,90]*/
MeScroll.prototype.getAngle = function(p1, p2) {
	let x = Math.abs(p1.x - p2.x);
	let y = Math.abs(p1.y - p2.y);
	let z = Math.sqrt(x * x + y * y);
	let angle = 0;
	if (z !== 0) {
		angle = Math.asin(y / z) / Math.PI * 180;
	}
	return angle
}

/* 觸發下拉刷新 */
MeScroll.prototype.triggerDownScroll = function() {
	if (this.optDown.beforeLoading && this.optDown.beforeLoading(this)) {
		//return true則处于完全自定義状态
	} else {
		this.showDownScroll(); // 下拉刷新中...
		this.optDown.callback && this.optDown.callback(this); // 执行回調,聯網加載數據
	}
}

/* 顯示下拉進度布局 */
MeScroll.prototype.showDownScroll = function() {
	this.isDownScrolling = true; // 標記下拉中
	if (this.optDown.native) {
		uni.startPullDownRefresh(); // 系統自帶的下拉刷新
		this.optDown.showLoading && this.optDown.showLoading(this, 0); // 仍觸發showLoading,因為上拉加載用到
	} else{
		this.downHight = this.optDown.offset; // 更新下拉區域高度
		this.optDown.showLoading && this.optDown.showLoading(this, this.downHight); // 下拉刷新中...
	}
}

/* 显示系統自帶的下拉刷新時需要处理的业务 */
MeScroll.prototype.onPullDownRefresh = function() {
	this.isDownScrolling = true; // 標記下拉中
	this.optDown.showLoading && this.optDown.showLoading(this, 0); // 仍觸發showLoading,因為上拉加載用到
	this.optDown.callback && this.optDown.callback(this); // 执行回調,聯網加載數據
}

/* 結束下拉刷新 */
MeScroll.prototype.endDownScroll = function() {
	if (this.optDown.native) { // 結束原生下拉刷新
		this.isDownScrolling = false;
		this.optDown.endDownScroll && this.optDown.endDownScroll(this);
		uni.stopPullDownRefresh();
		return
	}
	let me = this;
	// 結束下拉刷新的方法
	let endScroll = function() {
		me.downHight = 0;
		me.isDownScrolling = false;
		me.optDown.endDownScroll && me.optDown.endDownScroll(me);
		!me.isScrollBody && me.setScrollHeight(0) // scroll-view重置滾動區域,使数据不满屏時仍可检查觸發翻頁
	}
	// 結束下拉刷新時的回調
	let delay = 0;
	if (me.optDown.afterLoading) delay = me.optDown.afterLoading(me); // 結束下拉刷新的延時,單位ms
	if (typeof delay === 'number' && delay > 0) {
		setTimeout(endScroll, delay);
	} else {
		endScroll();
	}
}

/* 鎖定下拉刷新:isLock=ture,null鎖定;isLock=false解鎖 */
MeScroll.prototype.lockDownScroll = function(isLock) {
	if (isLock == null) isLock = true;
	this.optDown.isLock = isLock;
}

/* 鎖定上拉加載:isLock=ture,null鎖定;isLock=false解鎖 */
MeScroll.prototype.lockUpScroll = function(isLock) {
	if (isLock == null) isLock = true;
	this.optUp.isLock = isLock;
}

/* -------初始化上拉加載------- */
MeScroll.prototype.initUpScroll = function() {
	let me = this;
	// 配置參數
	me.optUp = me.options.up || {use: false}
	if(!me.optUp.textColor && me.hasColor(me.optUp.bgColor)) me.optUp.textColor = "#fff"; // 當bgColor有值且textColor未設置,則textColor默認白色
	me.extendUpScroll(me.optUp);

	if (!me.optUp.isBounce) me.setBounce(false); // 不允許bounce時,需禁止window的touchmove事件

	if (me.optUp.use === false) return; // 配置不使用上拉加載時,則不初始化上拉布局
	me.optUp.hasNext = true; // 如果使用上拉,則默認有下一頁
	me.startNum = me.optUp.page.num + 1; // 記錄page開始的頁码

	// 初始化完毕的回調
	if (me.optUp.inited) {
		setTimeout(function() { // 待主線程執行完畢再執行,避免new MeScroll未初始化,在回調獲取不到mescroll的實例
			me.optUp.inited(me);
		}, 0)
	}
}

/*滾動到底部的事件 (僅mescroll-body生效)*/
MeScroll.prototype.onReachBottom = function() {
	if (this.isScrollBody && !this.isUpScrolling) { // 只能支持下拉刷新的時候同時可以觸發上拉加載,否則滚动到底部就需要上滑一点才能觸發onReachBottom
		if (!this.optUp.isLock && this.optUp.hasNext) {
			this.triggerUpScroll();
		}
	}
}

/*列表滾動事件 (僅mescroll-body生效)*/
MeScroll.prototype.onPageScroll = function(e) {
	if (!this.isScrollBody) return;
	
	// 更新滾動條的位置 (主要用于判斷下拉刷新時,滚动條是否在頂部)
	this.setScrollTop(e.scrollTop);

	// 顶部按鈕的显示隐藏
	if (e.scrollTop >= this.optUp.toTop.offset) {
		this.showTopBtn();
	} else {
		this.hideTopBtn();
	}
}

/*列表滾動事件*/
MeScroll.prototype.scroll = function(e, onScroll) {
	// 更新滾動條的位置
	this.setScrollTop(e.scrollTop);
	// 更新滾動內容高度
	this.setScrollHeight(e.scrollHeight);

	// 向上滑還是向下滑動
	if (this.preScrollY == null) this.preScrollY = 0;
	this.isScrollUp = e.scrollTop - this.preScrollY > 0;
	this.preScrollY = e.scrollTop;

	// 上滑 && 检查并觸發上拉
	this.isScrollUp && this.triggerUpScroll(true);

	// 顶部按鈕的显示隐藏
	if (e.scrollTop >= this.optUp.toTop.offset) {
		this.showTopBtn();
	} else {
		this.hideTopBtn();
	}

	// 滑動監聽
	this.optUp.onScroll && onScroll && onScroll()
}

/* 觸發上拉加載 */
MeScroll.prototype.triggerUpScroll = function(isCheck) {
	if (!this.isUpScrolling && this.optUp.use && this.optUp.callback) {
		// 是否校驗在底部; 默認不校驗
		if (isCheck === true) {
			let canUp = false;
			// 還有下一頁 && 没有鎖定 && 不在下拉中
			if (this.optUp.hasNext && !this.optUp.isLock && !this.isDownScrolling) {
				if (this.getScrollBottom() <= this.optUp.offset) { // 到底部
					canUp = true; // 標記可上拉
				}
			}
			if (canUp === false) return;
		}
		this.showUpScroll(); // 上拉加載中...
		this.optUp.page.num++; // 預先加一頁,如果失败則减回
		this.isUpAutoLoad = true; // 標記上拉已經自動執行過,避免初始化時多次觸發上拉回調
		this.num = this.optUp.page.num; // 把最新的頁數賦值在mescroll上,避免對page的影響
		this.size = this.optUp.page.size; // 把最新的頁碼賦值在mescroll上,避免對page的影響
		this.time = this.optUp.page.time; // 把最新的頁碼賦值在mescroll上,避免對page的影響
		this.optUp.callback(this); // 执行回調,聯網加載數據
	}
}

/* 显示上拉加載中 */
MeScroll.prototype.showUpScroll = function() {
	this.isUpScrolling = true; // 标记上拉加載中
	this.optUp.showLoading && this.optUp.showLoading(this); // 回調
}

/* 顯示上拉無更多數據 */
MeScroll.prototype.showNoMore = function() {
	this.optUp.hasNext = false; // 標記無更多數據
	this.optUp.showNoMore && this.optUp.showNoMore(this); // 回調
}

/* 隱藏上拉區域**/
MeScroll.prototype.hideUpScroll = function() {
	this.optUp.hideUpScroll && this.optUp.hideUpScroll(this); // 回調
}

/* 結束上拉加載 */
MeScroll.prototype.endUpScroll = function(isShowNoMore) {
	if (isShowNoMore != null) { // isShowNoMore=null,不處理下拉狀態,下拉刷新的時候调用
		if (isShowNoMore) {
			this.showNoMore(); // isShowNoMore=true,顯示無更多數據
		} else {
			this.hideUpScroll(); // isShowNoMore=false,隱藏上拉加載
		}
	}
	this.isUpScrolling = false; // 标记結束上拉加載
}

/* 重置上拉加載列表為第一頁
 *isShowLoading 是否顯示進度布局;
 * 1.默認null,不傳參,則显示上拉加載的进度布局
 * 2.傳參true, 則顯示下拉刷新的進度布局
 * 3.傳參false,則不显示上拉龢下拉的进度 (常用於靜默更新列表數據)
 */
MeScroll.prototype.resetUpScroll = function(isShowLoading) {
	if (this.optUp && this.optUp.use) {
		let page = this.optUp.page;
		this.prePageNum = page.num; // 緩存重置前的頁碼,加載失敗可退回
		this.prePageTime = page.time; // 缓存重置前的時间,加載失敗可退回
		page.num = this.startNum; // 重置為第一頁
		page.time = null; // 重置時间為空
		if (!this.isDownScrolling && isShowLoading !== false) { // 如果不是下拉刷新觸發的resetUpScroll並且不配置列表靜默更新,則显示进度;
			if (isShowLoading == null) {
				this.removeEmpty(); // 移除空布局
				this.showUpScroll(); // 不傳參,默認显示上拉加載的进度布局
			} else {
				this.showDownScroll(); // 傳true,顯示下拉刷新的進度布局,不清空列表
			}
		}
		this.isUpAutoLoad = true; // 標記上拉已經自動執行過,避免初始化時多次觸發上拉回調
		this.num = page.num; // 把最新的頁數賦值在mescroll上,避免對page的影響
		this.size = page.size; // 把最新的頁碼賦值在mescroll上,避免對page的影響
		this.time = page.time; // 把最新的頁碼賦值在mescroll上,避免對page的影響
		this.optUp.callback && this.optUp.callback(this); // 执行上拉回調
	}
}

/* 設置page.num的值 */
MeScroll.prototype.setPageNum = function(num) {
	this.optUp.page.num = num - 1;
}

/* 設置page.size的值 */
MeScroll.prototype.setPageSize = function(size) {
	this.optUp.page.size = size;
}

/* 联网回調成功,結束下拉刷新龢上拉加載
 * dataSize: 當前頁的数据量(必傳)
 * totalPage: 總頁數(必傳)
 * systime: 服务器時间 (可空)
 */
MeScroll.prototype.endByPage = function(dataSize, totalPage, systime) {
	let hasNext;
	if (this.optUp.use && totalPage != null) hasNext = this.optUp.page.num < totalPage; // 是否還有下一頁
	this.endSuccess(dataSize, hasNext, systime);
}

/* 联网回調成功,結束下拉刷新龢上拉加載
 * dataSize: 當前頁的数据量(必傳)
 * totalSize: 列表所有數據總數量(必傳)
 * systime: 服务器時间 (可空)
 */
MeScroll.prototype.endBySize = function(dataSize, totalSize, systime) {
	let hasNext;
	if (this.optUp.use && totalSize != null) {
		let loadSize = (this.optUp.page.num - 1) * this.optUp.page.size + dataSize; // 已加載的數據總數
		hasNext = loadSize < totalSize; // 是否還有下一頁
	}
	this.endSuccess(dataSize, hasNext, systime);
}

/* 联网回調成功,結束下拉刷新龢上拉加載
 * dataSize: 當前頁的数据个数(不是所有頁的数据总龢),用于上拉加載判斷是否還有下一頁.如果不傳,則会判斷還有下一頁
 * hasNext: 是否還有下一頁,布爾類型;用來解決這個小問題:比如列表共有20條數據,每頁加載10條,共2頁.如果只根據dataSize判斷,則需翻到第三頁才会知道无更多数据,如果傳了hasNext,則翻到第二頁即可顯示無更多數據.
 * systime: 服务器時间(可空);用來解決這個小問題:當准备翻下一頁時,数据库新增了几條記錄,此時翻下一頁,前面的几條數據会龢上一頁的重复;这里傳入了systime,那麼upCallback的page.time就會有值,把page.time傳给服务器,让后台过滤新加入的那几條記錄
 */
MeScroll.prototype.endSuccess = function(dataSize, hasNext, systime) {
	let me = this;
	// 結束下拉刷新
	if (me.isDownScrolling) me.endDownScroll();

	// 結束上拉加載
	if (me.optUp.use) {
		let isShowNoMore; // 是否已無更多數據
		if (dataSize != null) {
			let pageNum = me.optUp.page.num; // 當前頁码
			let pageSize = me.optUp.page.size; // 每頁长度
			// 如果是第一頁
			if (pageNum === 1) {
				if (systime) me.optUp.page.time = systime; // 設置加载列表数据第一頁的時间
			}
			if (dataSize < pageSize || hasNext === false) {
				// 返回的数据不满一頁時,則说明已无更多数据
				me.optUp.hasNext = false;
				if (dataSize === 0 && pageNum === 1) {
					// 如果第一頁无任何数据且配置了空布局
					isShowNoMore = false;
					me.showEmpty();
				} else {
					// 總列表數少於配置的數量,則不顯示無更多數據
					let allDataSize = (pageNum - 1) * pageSize + dataSize;
					if (allDataSize < me.optUp.noMoreSize) {
						isShowNoMore = false;
					} else {
						isShowNoMore = true;
					}
					me.removeEmpty(); // 移除空布局
				}
			} else {
				// 還有下一頁
				isShowNoMore = false;
				me.optUp.hasNext = true;
				me.removeEmpty(); // 移除空布局
			}
		}

		// 隱藏上拉
		me.endUpScroll(isShowNoMore);
	}
}

/* 回調失败,結束下拉刷新龢上拉加載 */
MeScroll.prototype.endErr = function(errDistance) {
	// 結束下拉,回調失败重置回原来的頁码龢時间
	if (this.isDownScrolling) {
		let page = this.optUp.page;
		if (page && this.prePageNum) {
			page.num = this.prePageNum;
			page.time = this.prePageTime;
		}
		this.endDownScroll();
	}
	// 結束上拉,回調失败重置回原来的頁码
	if (this.isUpScrolling) {
		this.optUp.page.num--;
		this.endUpScroll(false);
		// 如果是mescroll-body,則需往回滚一定距离
		if(this.isScrollBody && errDistance !== 0){ // 不處理0
			if(!errDistance) errDistance = this.optUp.errDistance; // 不傳,則取默認
			this.scrollTo(this.getScrollTop() - errDistance, 0) // 往上回滾的距離
		}
	}
}

/* 顯示空布局 */
MeScroll.prototype.showEmpty = function() {
	this.optUp.empty.use && this.optUp.empty.onShow && this.optUp.empty.onShow(true)
}

/* 移除空布局 */
MeScroll.prototype.removeEmpty = function() {
	this.optUp.empty.use && this.optUp.empty.onShow && this.optUp.empty.onShow(false)
}

/* 显示回到頂部的按鈕 */
MeScroll.prototype.showTopBtn = function() {
	if (!this.topBtnShow) {
		this.topBtnShow = true;
		this.optUp.toTop.onShow && this.optUp.toTop.onShow(true);
	}
}

/* 隐藏回到頂部的按鈕 */
MeScroll.prototype.hideTopBtn = function() {
	if (this.topBtnShow) {
		this.topBtnShow = false;
		this.optUp.toTop.onShow && this.optUp.toTop.onShow(false);
	}
}

/* 获取滚动條的位置 */
MeScroll.prototype.getScrollTop = function() {
	return this.scrollTop || 0
}

/* 記錄滚动條的位置 */
MeScroll.prototype.setScrollTop = function(y) {
	this.scrollTop = y;
}

/* 滾動到指定位置 */
MeScroll.prototype.scrollTo = function(y, t) {
	this.myScrollTo && this.myScrollTo(y, t) // scrollview需自定義回到頂部方法
}

/* 自定義scrollTo */
MeScroll.prototype.resetScrollTo = function(myScrollTo) {
	this.myScrollTo = myScrollTo
}

/* 滚动條到底部的距離 */
MeScroll.prototype.getScrollBottom = function() {
	return this.getScrollHeight() - this.getClientHeight() - this.getScrollTop()
}

/* 計步器
 star: 開始值
 end: 結束值
 callback(step,timer): 回調step值,計步器timer,可自行通過window.clearInterval(timer)结束計步器;
 t: 计步時长,傳0則直接回調end值;不傳則默認300ms
 rate: 週期;不傳則默認30ms計步一次
 * */
MeScroll.prototype.getStep = function(star, end, callback, t, rate) {
	let diff = end - star; // 差值
	if (t === 0 || diff === 0) {
		callback && callback(end);
		return;
	}
	t = t || 300; // 時长 300ms
	rate = rate || 30; // 週期 30ms
	let count = t / rate; // 次數
	let step = diff / count; // 步長
	let i = 0; // 計數
	let timer = setInterval(function() {
		if (i < count - 1) {
			star += step;
			callback && callback(star, timer);
			i++;
		} else {
			callback && callback(end, timer); // 最后一次直接設置end,避免計算誤差
			clearInterval(timer);
		}
	}, rate);
}

/* 滾動容器的高度 */
MeScroll.prototype.getClientHeight = function(isReal) {
	let h = this.clientHeight || 0
	if (h === 0 && isReal !== true) { // 未獲取到容器的高度,可临時取body的高度 (可能會有誤差)
		h = this.getBodyHeight()
	}
	return h
}
MeScroll.prototype.setClientHeight = function(h) {
	this.clientHeight = h;
}

/* 滾動內容的高度 */
MeScroll.prototype.getScrollHeight = function() {
	return this.scrollHeight || 0;
}
MeScroll.prototype.setScrollHeight = function(h) {
	this.scrollHeight = h;
}

/* body的高度 */
MeScroll.prototype.getBodyHeight = function() {
	return this.bodyHeight || 0;
}
MeScroll.prototype.setBodyHeight = function(h) {
	this.bodyHeight = h;
}

/* 阻止瀏攬器默認滾動事件 */
MeScroll.prototype.preventDefault = function(e) {
	// 小程序不支持e.preventDefault
	// app的bounce只能通過配置pages.json的style.app-plus.bounce為"none"來禁止
	// cancelable:是否可以被禁用; defaultPrevented:是否已經被禁用
	if (e && e.cancelable && !e.defaultPrevented) e.preventDefault()
}

/* 是否允許下拉回彈(橡皮筋效果); true或null為允許; false禁止bounce */
MeScroll.prototype.setBounce = function(isBounce) {
	// #ifdef H5
	if (isBounce === false) {
		this.optUp.isBounce = false; // 禁止
		// 标记當前頁使用了mescroll (需延時,確保page已切換)
		setTimeout(function() {
			let uniPageDom = document.getElementsByTagName('uni-page')[0];
			uniPageDom && uniPageDom.setAttribute('use_mescroll', true)
		}, 30);
		// 避免重複添加事件
		if (window.isSetBounce) return;
		window.isSetBounce = true;
		// 需禁止window的touchmove事件才能有效的阻止bounce
		window.bounceTouchmove = function(e) {
			if(!window.isPreventDefault) return; // 根据标记判斷是否阻止
			
			let el = e.target;
			// 當前touch的元素及父元素是否要攔截touchmove事件
			let isPrevent = true;
			while (el !== document.body && el !== document) {
				if (el.tagName === 'UNI-PAGE') { // 只扫描當前頁
					if (!el.getAttribute('use_mescroll')) {
						isPrevent = false; // 如果當前頁没有使用mescroll,則不阻止
					}
					break;
				}
				let cls = el.classList;
				if (cls) {
					if (cls.contains('mescroll-touch')) { // 採用scroll-view 此處不能過濾mescroll-uni,否則下拉仍然有回弹
						isPrevent = false; // mescroll-touch無需攔截touchmove事件
						break;
					} else if (cls.contains('mescroll-touch-x') || cls.contains('mescroll-touch-y')) {
						// 如果配置了水平或者垂直滑動
						let curX = e.touches ? e.touches[0].pageX : e.clientX; // 當前第一个手指距离列表顶部的距离x
						let curY = e.touches ? e.touches[0].pageY : e.clientY; // 當前第一个手指距离列表顶部的距离y
						if (!this.preWinX) this.preWinX = curX; // 設置上次移動的距離x
						if (!this.preWinY) this.preWinY = curY; // 設置上次移動的距離y
						// 计算兩點之間的角度
						let x = Math.abs(this.preWinX - curX);
						let y = Math.abs(this.preWinY - curY);
						let z = Math.sqrt(x * x + y * y);
						this.preWinX = curX; // 記錄本次curX的值
						this.preWinY = curY; // 記錄本次curY的值
						if (z !== 0) {
							let angle = Math.asin(y / z) / Math.PI * 180; // 角度區間 [0,90]
							if ((angle <= 45 && cls.contains('mescroll-touch-x')) || (angle > 45 && cls.contains('mescroll-touch-y'))) {
								isPrevent = false; // 水平滑動或者垂直滑動,不攔截touchmove事件
								break;
							}
						}
					}
				}
				el = el.parentNode; // 繼續檢查其父元素
			}
			// 攔截touchmove事件:是否可以被禁用&&是否已經被禁用 (這裡不使用me.preventDefault(e)的方法,因為某些情况下会报找不到方法的异常)
			if (isPrevent && e.cancelable && !e.defaultPrevented && typeof e.preventDefault === "function") e.preventDefault();
		}
		window.addEventListener('touchmove', window.bounceTouchmove, {
			passive: false
		});
	} else {
		this.optUp.isBounce = true; // 允許
		if (window.bounceTouchmove) {
			window.removeEventListener('touchmove', window.bounceTouchmove);
			window.bounceTouchmove = null;
			window.isSetBounce = false;
		}
	}
	// #endif
}
