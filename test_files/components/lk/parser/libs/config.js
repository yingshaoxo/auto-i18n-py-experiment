/* 配置文件 */
// #ifdef MP-WEIXIN
const canIUse = wx.canIUse('editor'); // 高基礎庫標識，用於兼容
// #endif
module.exports = {
	// 過濾器函數
	filter: null,
	// 代碼高亮函數
	highlight: null,
	// 文本處理函數
	onText: null,
	// 實體編碼列表
	entities: {
		quot: '"',
		apos: "'",
		semi: ';',
		nbsp: '\xA0',
		ensp: '\u2002',
		emsp: '\u2003',
		ndash: '–',
		mdash: '—',
		middot: '·',
		lsquo: '‘',
		rsquo: '’',
		ldquo: '“',
		rdquo: '”',
		bull: '•',
		hellip: '…'
	},
	blankChar: makeMap(' ,\xA0,\t,\r,\n,\f'),
	// 塊級標籤，將被轉為 div
	blockTags: makeMap('address,article,aside,body,caption,center,cite,footer,header,html,nav,section' + (
		// #ifdef MP-WEIXIN
		canIUse ? '' :
		// #endif
		',pre')),
	// 將被移除的標籤
	ignoreTags: makeMap(
		'area,base,basefont,canvas,command,frame,input,isindex,keygen,link,map,meta,param,script,source,style,svg,textarea,title,track,use,wbr'
		// #ifdef MP-WEIXIN
		+ (canIUse ? ',rp' : '')
		// #endif
		// #ifndef APP-PLUS
		+ ',embed,iframe'
		// #endif
	),
	// 只能被 rich-text 顯示的標籤
	richOnlyTags: makeMap('a,colgroup,fieldset,legend,picture,table'
		// #ifdef MP-WEIXIN
		+ (canIUse ? ',bdi,bdo,caption,rt,ruby' : '')
		// #endif
	),
	// 自閉合的標籤
	selfClosingTags: makeMap(
		'area,base,basefont,br,col,circle,ellipse,embed,frame,hr,img,input,isindex,keygen,line,link,meta,param,path,polygon,rect,source,track,use,wbr'
	),
	// 信任的屬性
	trustAttrs: makeMap(
		'align,alt,app-id,author,autoplay,border,cellpadding,cellspacing,class,color,colspan,controls,data-src,dir,face,height,href,id,ignore,loop,media,muted,name,path,poster,rowspan,size,span,src,start,style,type,unit-id,width,xmlns'
	),
	// bool 型的屬性
	boolAttrs: makeMap('autoplay,controls,ignore,loop,muted'),
	// 信任的標籤
	trustTags: makeMap(
		'a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video'
		// #ifdef MP-WEIXIN
		+ (canIUse ? ',bdi,bdo,caption,pre,rt,ruby' : '')
		// #endif
		// #ifdef APP-PLUS
		+ ',embed,iframe'
		// #endif
	),
	// 默認的標籤樣式
	userAgentStyles: {
		address: 'font-style:italic',
		big: 'display:inline;font-size:1.2em',
		blockquote: 'background-color:#f6f6f6;border-left:3px solid #dbdbdb;color:#6c6c6c;padding:5px 0 5px 10px',
		caption: 'display:table-caption;text-align:center',
		center: 'text-align:center',
		cite: 'font-style:italic',
		dd: 'margin-left:40px',
		mark: 'background-color:yellow',
		pre: 'font-family:monospace;white-space:pre;overflow:scroll',
		s: 'text-decoration:line-through',
		small: 'display:inline;font-size:0.8em',
		u: 'text-decoration:underline'
	}
}

function makeMap(str) {
	var map = {},
		list = str.split(',');
	for (var i = list.length; i--;)
		map[list[i]] = true;
	return map;
}
