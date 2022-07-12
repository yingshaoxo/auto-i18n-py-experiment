/**
 * mescroll-more-item的mixins, 僅在多個 mescroll-body 寫在子組件時使用 (參考 mescroll-more 案例)
 */
const MescrollMoreItemMixin = {
	props:{
		i: Number, // 每個tab頁的專屬下標
		index: { // 當前tab的下標
			type: Number,
			default(){
				return 0
			}
		}
	},
	data() {
		return {
			downOption:{
				auto:false // 不自動加載
			},
			upOption:{
				auto:false // 不自動加載
			},
			isInit: false // 當前tab是否已初始化
		}
	},
	watch:{
		// 監聽下標的變化
		index(val){
			if (this.i === val && !this.isInit) {
				this.isInit = true; // 標記為true
				this.mescroll && this.mescroll.triggerDownScroll();
			}
		}
	},
	methods: {
		// mescroll組件初始化的回調,可獲取到mescroll對象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
			this.mescrollInitByRef && this.mescrollInitByRef(); // 兼容字節跳動小程序 (mescroll-mixins.js)
			// 自动加载當前tab的數據
			if(this.i === this.index){
				this.isInit = true; // 標記為true
				this.mescroll.triggerDownScroll();
			}
		},
	}
}

export default MescrollMoreItemMixin;
