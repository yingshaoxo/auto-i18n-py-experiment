/**
 * mescroll-body寫在子組件時,需通過mescroll的mixins補充子組件缺少的生命週期:
 * 當一個頁面只有一個mescroll-body寫在子組件時, 則使用mescroll-comp.js (參考 mescroll-comp 案例)
 * 當一個頁面有多個mescroll-body寫在子組件時, 則使用mescroll-more.js (參考 mescroll-more 案例)
 */
const MescrollMoreMixin = {
	data() {
		return {
			tabIndex: 0 // 當前tab下標
		}
	},
	// 因為子組件無onPageScroll龢onReachBottom的頁面生命週期，需在頁面傳遞進到子組件
	onPageScroll(e) {
		let mescroll = this.getMescroll(this.tabIndex);
		mescroll && mescroll.onPageScroll(e);
	},
	onReachBottom() {
		let mescroll = this.getMescroll(this.tabIndex);
		mescroll && mescroll.onReachBottom();
	},
	// 當down的native: true時, 還需傳遞此方法進到子組件
	onPullDownRefresh(){
		let mescroll = this.getMescroll(this.tabIndex);
		mescroll && mescroll.onPullDownRefresh();
	},
	methods:{
		// 根据下標获取对应子组件的mescroll
		getMescroll(i){
			if(!this.mescrollItems) this.mescrollItems = [];
			if(!this.mescrollItems[i]) {
				// v-for中的refs
				let vForItem = this.$refs["mescrollItem"];
				if(vForItem){
					this.mescrollItems[i] = vForItem[i]
				}else{
					// 普通的refs,不可重複
					this.mescrollItems[i] = this.$refs["mescrollItem"+i];
				}
			}
			let item = this.mescrollItems[i]
			return item ? item.mescroll : null
		},
		// 切換tab,恢復滾動條位置
		tabChange(i){
			let mescroll = this.getMescroll(i);
			if(mescroll){
				// 延時(比$nextTick靠譜一些),確保元素已渲染
				setTimeout(()=>{
					mescroll.scrollTo(mescroll.getScrollTop(),0)
				},30)
			}
		}
	}
}

export default MescrollMoreMixin;
