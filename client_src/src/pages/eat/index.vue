<template>
    <div class="main-layout">
        <div class="record-page" v-show="!isEditModel">
            <button class="eat-record-button" @click="recordEat()" >吃饭打卡</button>
            <button class="view-history-button" @click="getHistory()">查看记录</button>

            <div class="view-history-layout">
                <div class="record-item" v-for="record in historyRecordList" :key="record.time" :style="{backgroundImage: 'url(' + record.imgList[0] + ')'}">
                    <div class="record-item-wrap">
                        <p class="record-words">{{record.wordsToLynn}}</p>

                        <div class="date-info">
                            <p class="record-time">{{record.time}}</p>
                            <p class="record-position"><span><img :src="locationIconSrcWhite"></span>{{record.location}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        

        <div class="edit-layout" v-show="isEditModel">
            <div class="textarea-box">
                <textarea placeholder="给老公的留言~" v-model="recordContent.wordsToLynn"></textarea>
                <!-- <textarea placeholder="留言~" :value="recordContent.wordsToLynn"></textarea> -->
            </div>
            <div class="location-box">
                <span><img :src="locationIconSrc"></span>
                <!-- {{locationString === '' ? '正在获取老婆定位...' : locationString}} -->
                <span v-if="locationString === ''">正在获取老婆定位...</span>
                <span v-if="locationString !== ''">{{locationString}}</span>
            </div>
            <h4 class="eat-title">皂片<small>我有好好吃饭捏~</small></h4>
            
            <div class="record-img-preview-layout">
                <div class="img-item" v-for="(item, index) in recordContent.recordImgPreviewList" :key="item.src">
                    <div class="remove-img" @click="removeItem(index)"></div>
                    <img :src="item.src" alt=""  class="img-preview-item" >
                </div>

                <div class="img-item" @click="addImg()">
                    <div class="img-wrapper">
                        <img :src="addIconSrc" alt="" class="img-preview-item add-img-button" >
                    </div>
                </div>
            </div>

            <div class="submit-layout">
                <button class="submit-record" @click="submitRecord()">提交给老公</button>
                <!-- <button class="submit-record" @click="submitRecord()">提交</button> -->
                <button class="submit-return" type="success" @click="submitReturn()">返回</button>
            </div>
        </div>
    </div>
</template>

<script>

import Config from '../../config'
import { formatTime, showBusy, showSuccess, showModel } from '../../utils'

export default {
    created() {
        this.getLocation();
    },
    data() {
        return {
            addIconSrc: 'http://7xwgqm.com1.z0.glb.clouddn.com/add.png',
            locationIconSrc: 'http://7xwgqm.com1.z0.glb.clouddn.com/wxb%E5%AE%9A%E4%BD%8D.png',
            locationIconSrcWhite: 'http://7xwgqm.com1.z0.glb.clouddn.com/wxb%E5%AE%9A%E4%BD%8D%20%281%29.png',
            locationString: '',
            isEditModel: false,
            recordContent: {
                recordImgPreviewList: [],
                wordsToLynn: 'Dear 老公 :\n'
                // wordsToLynn: ''
            },
            historyRecordList: []
        }
    },
    methods: {
        getNewPhoto() {
            let _this = this;
            wx.chooseImage({
                sizeType: ['compressed'],
                success: function(tempFilePaths) {
                    _this.isEditModel = true;
                    // 拿到图片路径，进行预览，提交上传 。结束 提示语 打卡成功提示： 宝宝吃饱辣,已上传给老公审批！！
                    let imgPathList = tempFilePaths.tempFilePaths;
                    imgPathList.forEach(item => {
                        _this.recordContent.recordImgPreviewList.push({
                            src: item
                        });
                    })

                },
                fail: function() {

                }
            })
        },
        recordEat() {
            let _this = this;
            wx.vibrateShort()
            this.getNewPhoto();
        },
        removeItem(index) {
            this.recordContent.recordImgPreviewList.splice(index, 1);
        },
        addImg() {
            this.getNewPhoto();
        },
        getLocation() {
            let _this = this;
            console.log('getLocation');
            wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success: function(res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    console.log(latitude, longitude, 123);

                    _this._request({
                        url: Config.api.requestMap,
                        method: 'get',
                        data: {
                            location: latitude + ',' + longitude
                        },
                        success: (res) => {
                            console.log(res.data);
                            if (res.data.status === 'success') {
                                _this.locationString = res.data.location
                                console.log('change', _this.locationString)
                            }
                            
                        },
                        fail: (res) => {
                            console.log('定位失败，请老婆打开定位');
                        }
                    })
                },
                fail: () => {
                    console.log('fail')
                }
            })
        },
        _request(opts) {
            return wx.request(opts);
        },
        async submitRecord() {
            let _this = this
            let location = this.locationString;
            let wordsToLynn = this.recordContent.wordsToLynn;
            let imgList = this.recordContent.recordImgPreviewList;

            if (imgList.length === 0) {
                wx.vibrateLong()
                showModel('打卡失败', '老婆要拍照才能上传捏')
                return false
            }
            showBusy('打卡中')

            let result = await this.uploadImgList(imgList)

            if (result.status === 'success') {
                // showSuccess('图片上传成功')
            } else {
                wx.vibrateLong()
                showModel('图片上传失败', result.err)
                return false;
            } 

            let uploadFileList = []

            for (let item of result.data) {
                if (item.statusCode === 413) {
                    showModel('图片过大', item.data)
                    return false;
                }
                let data = JSON.parse(item.data).data.imgKey

                uploadFileList.push(Config.service.downLoadImgPath + data)
            }

            let requestData = {
                wordsToLynn: wordsToLynn,
                location: location,
                imgList: uploadFileList
            }

            this._request({
                url: Config.service.submitEatRecord,
                method: 'post',
                data: {
                    recordData: requestData
                },
                success: (res) => {
                    _this.submitSuccess(res)
                },
                fail: (err) => {    
                    _this.submitFail(err)
                }
            })

        },
        async uploadImgList(imgList) {
            let _this = this;
            return new Promise((_resolve, _reject) => {
                console.log('upload')
                let syncTaskQueue = [];
                let result;
                
                console.log(imgList)
                for (let i = 0; i < imgList.length; i++) {
                    syncTaskQueue.push(new Promise((resolve, reject) => {
                        _this.wxUploadImg(imgList[i].src, resolve, reject);
                    }));
                }
    
                Promise.all(syncTaskQueue)
                .then(results => {
                    console.log(results);
                    _resolve({
                        status: 'success',
                        data: results
                    });
                }).catch(err => {
                    console.log(err)
                    _reject({
                        status: 'failed'
                    })
                });

            });


        },
        wxUploadImg(imgTempPath, resolve, reject) {
            console.log('upload file11', imgTempPath)
            wx.uploadFile({
                url: Config.service.uploadImgPath,
                filePath: imgTempPath,
                name: 'file',
                // header: {
                //     "content-type": "multipart/form-data"
                // },
                //取一个独特的名字
                // name: new Date().getTime() + '',
                success: (res) => {
                    console.log(res);
                    resolve(res);
                },
                fail: (err) => {
                    console.log(err);
                    reject(err);
                }
            })
        },
        submitReturn() {
            this.isEditModel = false
        },
        submitSuccess(res) {
            console.log(res)
            wx.vibrateLong()
            if (res.data.status ==='success') {
                showSuccess('打卡成功')
                this.historyRecordList = []
                this.getHistory()
                this.isEditModel = false
            } else {
                showModel('打卡失败', 'err: ' + res.err)
            }
        },
        submitFail(err) {
            wx.vibrateLong()
            showModel('打卡失败', '上传出错')
        },
        getHistory() {
            let _this = this
            showBusy('正在获取记录')
            this._request({
                url: Config.service.getHistory,
                method: 'get',
                success: (res) => {
                    console.log(res.data)
                    if (res.data.status === 'success') {
                        showSuccess('获取成功')
                        _this.historyRecordList = []
    
                        res.data.data.result.forEach(item => {
                            _this.historyRecordList.push({
                                imgList: item.imglist.split(':||:'),
                                location: item.location,
                                wordsToLynn: item.wordstolynn,
                                time: item.time
                            })
                        })
                    } else {
                        showModel('获取失败', '请求出错，请重新获取')
                    }
                }
            })
        }
        
    }
}
</script>

<style scoped>
    .record-words {
        margin: 20rpx;
        padding: 20rpx
    }
    .record-position img {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx
    }
    .record-item-wrap {
        background: rgba(66,66,66,.4);
        height: 100%;
        position: relative;
        box-sizing: border-box;
    }
    .date-info {
        position: absolute;
        bottom: 0;
        right: 0;
        text-align: right
    }
    .record-item-wrap p {
        font-size: 36rpx;
        font-weight: 200;
        color: rgb(245,245,245)
    }
    .record-item {
        width: 100%;
        height: 400rpx;
        background-size: cover;
        background-position: center;
        margin-top: 20rpx;
    }
    .record-page {
        width: 100%;
    }
    .record-page .view-history-button {
        width: 80%;
        margin: auto auto;
    }
    .location-box {
        margin-top: 20rpx;
        height: 70rpx;
        box-sizing: border-box;
    }

    .location-box span {
        font-size: 34rpx;
        color: rgb(100, 100, 100);
        font-weight: 200;
        display: inline-block;
        height: 70rpx;
        line-height: 70rpx;
        padding-top: -10rpx;
        /* position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-50%) translateY(-50%); */
    }
    .location-box img{
        width: 40rpx;
        height: 40rpx;
        opacity: 0.8;
        margin-right: 10rpx;
        display: inline-block;
    }
    .main-layout {
        margin-bottom: 100px;
        height:100%;
        padding-bottom:200rpx;
        /* height: 1200rpx; */
    }
    .conatiner {
        height: 100%;
        border: solid
    }
    .eat-record-button {
        width:200rpx;
        height:200rpx;
        margin:100rpx auto;
        border-radius:50%;
        -webkit-box-shadow:0 0 1rpx 1rpx #ccc;
        box-shadow:0 0 30rpx 5rpx #ccc;
        background:rgba(91,194,72,.7);
        font-size:35rpx;
        line-height:100px;
        transition: all .3s ease;
    }
    .eat-record-button:hover {
        transform: scale(1.2)
    }
    .record-img-preview-layout {
        display: flex;
        flex-wrap: wrap;
    }
    .img-item {
        margin: 5px;
        position: relative;
    }
    .remove-img {
        position:absolute;
        width:30rpx;
        height:30rpx;
        top:-5rpx;
        right:-5rpx;
        border-radius:50%;
        background-image:url(http://7xwgqm.com1.z0.glb.clouddn.com/close1.png);
        background-size:cover;
        z-index:99;
        opacity:0.7;
        box-shadow:1px 1px 10px #000;
    }
    .img-preview-item {
        width: 216rpx;
        height: 384rpx;
        border: 2px solid #ccc;
        border-radius: 10px;
        overflow: hidden;
    }
    .img-wrapper {
        width:216rpx;
        border:2px solid #ccc;
        height:384rpx;
        position:relative;
        border-radius: 10px;
    }
    .add-img-button {
        width:100rpx;
        height:100rpx;
        opacity:0.3;
        position:absolute;
        left:50%;
        top:50%;
        margin-left:-55rpx;
        margin-top:-55rpx;
        border: none;
        border-radius: 10px;
        overflow: hidden;
    }
    .edit-layout {
        margin:60rpx;
    }
    .textarea-box {
        border:1px solid #ccc;
        border-radius:20rpx;
        padding: 20rpx
    }
    .textarea-box textarea {
        width:100%;
        font-size: 32rpx;
        color: rgb(66, 66, 66);
    }
    .eat-title {
        font-size: 40rpx;
        color: rgb(66, 66, 66);
        font-weight: 200;
        margin-top: 20px;
    }
    small {
        display: inline;
        margin-left: 10px;
        font-size: 20rpx;
    }
    .submit-record {
        margin: 20px 20px 10px;
        background: #4ec922;
        color: #ffffffec;
    }
    .submit-return {
        margin: 10px 20px 20px 20px;
    }
</style>


