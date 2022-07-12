<!-- 下拉刷新區域 -->
<template>
	<view v-if="mOption.use" class="mescroll-downwarp" :style="{'background-color':mescroll.optDown.bgColor,'color':mescroll.optDown.textColor}">
		<view class="downwarp-content">
			<view class="downwarp-progress" :class="{'mescroll-rotate': isDownLoading}" :style="{'border-color':mescroll.optDown.textColor, 'transform':downRotate}"></view>
			<view class="downwarp-tip">{{downText}}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		option: Object , // down的配置項
		type: Number, // 下拉狀態（inOffset：1， outOffset：2， showLoading：3， endDownScroll：4）
		rate: Number // 下拉比率 (inOffset: rate<1; outOffset: rate>=1)
	},
	computed: {
		// 支付寶小程序需寫成計算屬性,prop定義default仍報錯
		mOption(){
			return this.option || {}
		},
		// 是否在加載中
		isDownLoading(){
			return this.type === 3
		},
		// 旋轉的角度
		downRotate(){
			return 'rotate(' + 360 * this.rate + 'deg)'
		},
		// 文本提示
		downText(){
			switch (this.type){
				case 1: return this.mOption.textInOffset;
				case 2: return this.mOption.textOutOffset;
				case 3: return this.mOption.textLoading;
				case 4: return this.mOption.textLoading;
				default: return this.mOption.textInOffset;
			}
		}
	}
};
</script>

<style scoped>
@import "./mescroll-down.css";
</style>
