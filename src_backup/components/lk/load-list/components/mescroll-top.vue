<!-- 回到頂部的按鈕 -->
<template>
	<image
		v-if="mOption.src"
		class="mescroll-totop"
		:class="[value ? 'mescroll-totop-in' : 'mescroll-totop-out', {'mescroll-safe-bottom': mOption.safearea}]"
		:style="{'z-index':mOption.zIndex, 'left': left, 'right': right, 'bottom':addUnit(mOption.bottom), 'width':addUnit(mOption.width), 'border-radius':addUnit(mOption.radius)}"
		:src="mOption.src"
		mode="widthFix"
		@click="toTopClick"
	/>
</template>

<script>
export default {
	props: {
		// up.toTop的配置項
		option: Object,
		// 是否顯示
		value: false
	},
	computed: {
		// 支付寶小程序需寫成計算屬性,prop定義default仍報錯
		mOption(){
			return this.option || {}
		},
		// 優先顯示左邊
		left(){
			return this.mOption.left ? this.addUnit(this.mOption.left) : 'auto';
		},
		// 右邊距離 (優先顯示左邊)
		right() {
			return this.mOption.left ? 'auto' : this.addUnit(this.mOption.right);
		}
	},
	methods: {
		addUnit(num){
			if(!num) return 0;
			if(typeof num === 'number') return num + 'rpx';
			return num
		},
		toTopClick() {
			this.$emit('input', false); // 使v-model生效
			this.$emit('click'); // 派發點擊事件
		}
	}
};
</script>

<style lang="scss" scoped>
/* 回到頂部的按鈕 */
.mescroll-totop {
	z-index: 9990;
	position: fixed !important; /* 加上important避免編譯到H5,在多mescroll中定位失效 */
	right: 20rpx;
	bottom: 120rpx;
	width: 72rpx;
	height: auto;
	border-radius: 50%;
	opacity: 0;
	transition: opacity 0.5s; /* 過渡 */
	margin-bottom: var(--window-bottom); /* css變量 */
}

 /* 適配 iPhoneX */
.mescroll-safe-bottom{
	margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom)); /* window-bottom + 適配 iPhoneX */
	margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
}

/* 顯示 -- 淡入 */
.mescroll-totop-in {
	opacity: 1;
}

/* 隱藏 -- 淡出且不接收事件*/
.mescroll-totop-out {
	opacity: 0;
	pointer-events: none;
}
</style>
