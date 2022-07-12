/**
 * mescroll-body寫在子組件時,需通過mescroll的mixins補充子組件缺少的生命週期:
 * 當一個頁面只有一個mescroll-body寫在子組件時, 則使用mescroll-comp.js (參考 mescroll-comp 案例)
 * 當一個頁面有多個mescroll-body寫在子組件時, 則使用mescroll-more.js (參考 mescroll-more 案例)
 */
const MescrollCompMixin = {
	// 因為子組件無onPageScroll龢onReachBottom的頁面生命週期，需在頁面傳遞進到子組件
	onPageScroll(e) {
		let item = this.$refs["mescrollItem"];
		if(item && item.mescroll) item.mescroll.onPageScroll(e);
	},
	onReachBottom() {
		let item = this.$refs["mescrollItem"];
		if(item && item.mescroll) item.mescroll.onReachBottom();
	},
	// 當down的native: true時, 還需傳遞此方法進到子組件
	onPullDownRefresh(){
		let item = this.$refs["mescrollItem"];
		if(item && item.mescroll) item.mescroll.onPullDownRefresh();
	}
}

export default MescrollCompMixin;
