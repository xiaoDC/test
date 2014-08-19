var Sidebar = function( $ ){
	/* 获取 titlebar 的 UL 元素*/
	this.el = $('#titlebar_ul');     
	/* 默认将 UL 中所有的 li 元素对应的 menuContent 置为 关闭状态 */
	this.state = "allClosed";
}

Sidebar.prototype.addClick = function() {
	var self = this;
	/* 初始默认当前打开的li对应的元素为null */
	this.currentOpenedMenuContent = null;
	/* 获取sideBar的ul下的所有li元素*/
	this.menuList = $('.nav-content');
	/* 为所有的li元素添加点击事件*/
	for (var i = 0; i < this.menuList.length; i++) {
		this.menuList[i].onclick = function(e){
			alert('click');
			/* 获取当前点击的li对应的content元素*/
			var menuContentEl = $('#'+e.currentTarget.id + '-content');
			if( self.state === 'allClosed'){
				$(menuContentEl).css({'top':'39px','right':'-400px'});
				$( menuContentEl).addClass('content-move-left');
				self.state = 'hasOpened';
				self.currentOpenedMenuContent = menuContentEl;
			}else{
				$(self.currentOpenedMenuContent).css({'top':'39px','right':'-400px'});
				$(self.currentOpenedMenuContent).addClass('content-move-down');
				$(menuContentEl).css({'top':'39px','right':'0px'});
				$( menuContentEl).addClass('content-move-left');
				self.state = 'hasOpened';
				self.currentOpenedMenuContent = menuContentEl;
			}
		}
	}
};
