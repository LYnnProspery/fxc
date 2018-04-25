const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')

// const mysql = require('mysql')
// let connection = mysql.createConnection({
//     host: config.recordDb.host,
//     user: config.recordDb.user,
//     password: config.recordDb.pass,
//     database: config.recordDb.db
// })

// connection.connect()

// var  sql = 'SELECT * FROM record';
// //查
// connection.query(sql,function (err, result) {
//         if(err){
//           console.log('[SELECT ERROR] - ',err.message);
//           return;
//         }
 
//        console.log('--------------------------SELECT----------------------------');
//        console.log(result);
//        console.log('------------------------------------------------------------\n\n');  
// });





// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
const eatRouter = require('./routes/eatRouter.js')

app.use(eatRouter.routes())
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
