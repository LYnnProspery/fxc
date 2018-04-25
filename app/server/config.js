const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx0bfe7a505d4d3079',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    // dev
    // mysql: {
    //     host: 'localhost',
    //     port: 3306,
    //     user: 'root',
    //     db: 'cAuth',
    //     pass: 'wx0bfe7a505d4d3079',
    //     char: 'utf8mb4'
    // },

    //production
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'UlLAII7Q',
        char: 'utf8mb4'
    },

    //dev
    // recordDb: {
    //     host: 'localhost',
    //     port: 3306,
    //     user: 'root',
    //     db: 'eat_record',
    //     pass: 'wx0bfe7a505d4d3079',
    //     char: 'utf8mb4'
    // },

    // production
    recordDb: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      db: 'eat_record',
      pass: 'UlLAII7Q',
      char: 'utf8mb4'
    },

    sqlStatements: {
        addRecord: {
            sql: 'INSERT INTO record(id,imglist,location,wordstolynn,time) VALUES(0,?,?,?,?)'
        },
        getHistoryRecord: {
            sql: 'SELECT * from record ORDER BY time DESC'
        }
    },

    recordDbOpts: {
        connectionLimit : 10,
        host            : 'localhost',
        user            : 'root',
        password: 'UlLAII7Q',
        database        : 'eat_record'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-beijing',
        // Bucket 名称       
        fileBucket: 'miss',
        // 文件夹
        // uploadFolder: 'https://miss-1252083442.cos.ap-beijing.myqcloud.com',
        SecretId: 'AKID85nHVVVYFhusb5dODsJWWIrCI9k5uzc0',

        SecretKey: 'HK7fjZ9TY4MOCk25sQjmZ7OPB1d1A4j9',

        // region: 'ap-guangzhou',
        // // Bucket 名称
        // fileBucket: 'qcloudtest',

        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    api: {
      map: 'https://apis.map.qq.com/ws/geocoder/v1/',
      mapKey: 'FH2BZ-C7F3F-MPBJE-NYYF5-HISZ2-3TFRF'
    }
}

module.exports = CONF
