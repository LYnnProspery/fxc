/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//dev
// var host = 'https://bcubkqku.qcloud.la';

var host = 'https://228070574.fxclyp.club';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 吃饭打卡
        submitEatRecord: `${host}/weapp/eat/submit`,

        getHistory: `${host}/weapp/eat/gethistory`,

        //
        //上传图片
        uploadImgPath: `${host}/weapp/upload`,

        // downLoadImgPath: `https://miss-1252083442.cosbj.myqcloud.com/
        downLoadImgPath: 'https://miss-1252083442.cos.ap-beijing.myqcloud.com/'
    },
    api: {
        //test
        test: `${host}/weapp/test`,

        //request map api
        requestMap: `${host}/weapp/eat/map`,
        //map aip
        getLocationInfo: 'https://apis.map.qq.com/ws/geocoder/v1/?location='
    }
};

module.exports = config;
