
Component({
	data: {
		active: 3,
		list: [
						{
							icon: 'home-o',
							text: '主页',
							url: '/pages/index/index'
						},
						{
							icon: 'search',
							text: '地图',
							url: '/pages/map/map'
						},
						{
							icon: 'setting-o',
							text: '我的',
							url: '/pages/myPage/myPage'
						}
					]
	},
	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});

