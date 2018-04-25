<template>
  <div class="container">
		<div class="main-background"></div>

		<div class="side-nav-layout">
			<!-- <a href="" class="nav-link" v-for="item in navs" :key="item.tabName">
				{{item.tabName}}
			</a> -->
			<img :src="item.iconImg" alt="" v-for="item in navs" :key="item.tabName" class="appIcon" @click="bindViewTap(item.url)">
		</div>

		<div class="main-container-layout">

			<div class="main-container">
				<div class="userinfo" @click="bindViewTap('logs')">
					<img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
					<div class="userinfo-nickname">
					<card :text="userInfo.nickName"></card>
					</div>
				</div>
			</div>

			<div class="usermotto">
				<div class="current-time-layout">
					{{currentTime}}
				</div>
				<div class="user-motto">
					<card :text="motto"></card>
					<card :text="getMeetDay"></card>
				</div>
			</div>

		</div>
    
      
    <!-- <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form> -->

  </div>
</template>

<script>
import card from "@/components/card";
import { formatTime } from "@/utils/index";

export default {
	data() {
		let iconSrcList = [
			'http://7xwgqm.com1.z0.glb.clouddn.com/shake.png',
			'http://7xwgqm.com1.z0.glb.clouddn.com/clock%20%281%29.png',
			'http://7xwgqm.com1.z0.glb.clouddn.com/brush.png'
		]

		return {
			motto: "Hello 樊星辰",
			userInfo: {},
			currentTime: formatTime(new Date()),
			// backgroundSrc: [
			// 	'http://7xwgqm.com1.z0.glb.clouddn.com/XINGFU.jpeg',
			// 	'http://7xwgqm.com1.z0.glb.clouddn.com/%E6%A8%8A%E6%98%9F%E8%BE%B0_2018-2-4_1.png'
			// ]
		
			navs: [
				{
					tabName: "EAT",
					iconImg: iconSrcList[0],
					url: 'eat'
				},
				{
					tabName: "POTATO",
					iconImg: iconSrcList[1],
					url: 'potato'
				},
				{
					tabName: "TIPS",
					iconImg: iconSrcList[2],
					url: 'tips'
				}
			]
		};
	},

	components: {
		card
	},

	computed: {
		// getCurrentTime () {
		//   return formatTime(new Date());
		// }
		getMeetDay() {
			let content = Math.floor(
				(new Date().getTime() - new Date("2017/12/17").getTime()) /
				(60 * 60 * 24 * 1000)
			);
			return "We have met " + content + " days";
		}
	},

	methods: {
		bindViewTap(_url) {
			let url = `../${_url}/${_url}`;
			console.log(url);
			wx.vibrateShort()
			wx.navigateTo({ url });
		},

		getUserInfo() {
		// 调用登录接口
			wx.login({
				success: () => {
					wx.getUserInfo({
						success: res => {
							this.userInfo = res.userInfo;
						}
					});
				}
			});
		},

		getUserLocation() {
			wx.getLocation({
				type: "wgs84",
				success: res => {
					var latitude = res.latitude; // 经度
					var longitude = res.longitude; // 纬度

					console.log(res);
				}
			});
		},

		clickHandle(msg, ev) {
			console.log("clickHandle:", msg, ev);
		},

		getCurrentTime() {
			setInterval(() => {
				this.currentTime = formatTime(new Date());
			}, 1000);
		}
	},

	created() {
		// 调用应用实例的方法获取全局数据
			this.getUserInfo();
			this.getCurrentTime();
			// this.getUserLocation();
	}
};
</script>

<style scoped>
.appIcon {
	height: 100rpx;
	width: 100rpx;
	margin: 20rpx;
	transition: all .3s ease;
}
.appIcon:hover {
	transform: scale(1.2)
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: rgb(50, 50, 50);
  font-size: 40rpx;
}

.usermotto {
  margin-top: 50rpx;
  text-align: center;
  font-size: 26rpx;
}

.form-control {
  display: block;
  padding: 0 12rpx;
  margin-bottom: 5rpx;
  border: 1rpx solid #ccc;
}

.current-time-layout {
  font-size: 26rpx;
  margin-bottom: 20rpx;
}

.main-background {
  /* width: 100%;
	height: 100%; */
  /* background-image: url("http://7xwgqm.com1.z0.glb.clouddn.com/%E6%A8%8A%E6%98%9F%E8%BE%B0_2018-2-4_1.png"); */

	background-image: url("http://7xwgqm.com1.z0.glb.clouddn.com/fxc.JPG");
  background-size: cover;
  -webkit-filter: blur(10rpx); /* Chrome, Opera */
  -moz-filter: blur(10rpx);
  -ms-filter: blur(10rpx);
  filter: blur(10rpx);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.container {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.main-container-layout {
  /* width: 100%; */
  height: 100%;
  padding-top: 200rpx;
  flex: 1;
  background: rgba(245, 245, 245, 0.5);
  z-index: 99;
  box-sizing: border-box;
  /* padding: 200rpx; */
}
.side-nav-layout {
  width: 150rpx;
  height: 100%;
  padding-top: 100rpx;
  background: rgba(66, 66, 66, 0.8);
  z-index: 100;
  box-shadow: 3rpx 3rpx 10rpx rgb(60, 60, 60);
  box-sizing: border-box;
}

.side-nav-layout .nav-link {
  padding: 10rpx;
  border-radius: 0 10rpx 10rpx 0;
  background: rgba(66, 66, 66, 0.6);
  margin-top: 100rpx;
  color: rgb(235, 235, 235);
  margin-right: -6rpx;
  border-bottom: 2rpx solid rgba(0, 0, 0, 0.3);
  text-align: center;
  text-decoration: none;
}
</style>
