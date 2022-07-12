// 全局配置
// mescroll-body 龢 mescroll-uni 通用
const GlobalOption = {
	down: {
		// 其他down的配置參數也可以寫,這裡只展示了常用的配置:
		textInOffset: '下拉刷新', // 下拉的距離在offset範圍內的提示文本
		textOutOffset: '釋放更新', // 下拉的距離大於offset範圍的提示文本
		textLoading: '加載中 ...', // 加載中的提示文本
		offset: 80, // 在列表頂部,下拉大於80px,鬆手即可觸發下拉刷新的回調
		native: true // 是否使用系統自帶的下拉刷新; 默認false; 僅在mescroll-body生效 (值為true時,還需在pages配置enablePullDownRefresh:true;詳請參考mescroll-native的案例)
	},
	up: {
		// 其他up的配置參數也可以寫,這裡只展示了常用的配置:
		textLoading: '加載中 ...', // 加載中的提示文本
		textNoMore: '沒有更多了', // 沒有更多數據的提示文本
		offset: 80, // 距底部多远時,觸發upCallback
		isBounce: false, // 默認禁止橡皮筋的回彈效果, 必讀事項: http://www.mescroll.com/qa.html?v=190725#q25
		toTop: {
			// 回到頂部按鈕,需配置src才顯示
			src: "", // 圖片路徑 (建議放入static目錄, 如 /static/img/mescroll-totop.png )
			offset: 1000, // 列表滚动多少距离才顯示回到頂部按鈕,默認1000px
			right: 20, // 到右邊的距離, 默認20 (支持"20rpx", "20px", "20%"格式的值, 純數字則默認單位rpx)
			bottom: 120, // 到底部的距離, 默認120 (支持"20rpx", "20px", "20%"格式的值, 純數字則默認單位rpx)
			width: 72 // 回到頂部圖標的寬度, 默認72 (支持"20rpx", "20px", "20%"格式的值, 純數字則默認單位rpx)
		},
		empty: {
			use: true, // 是否顯示空布局
			icon: null, // 圖標路徑 (建議放入static目錄, 如 /static/img/mescroll-empty.png )
			tip: '暫無相關數據' // 提示
		}
	}
}

export default GlobalOption
