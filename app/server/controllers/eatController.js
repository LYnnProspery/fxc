const request = require('request');
const Config = require('../config.js');
const mysql = require('mysql')
const dbController = require('./dbController')
const moment = require('moment')

const coReqeust = async (opts) => {
  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      resolve({
        res,
        body
      });
    });
  })
};


let getLocation = async (ctx) => {
  let locationString = ctx.request.query.location;

  let _res = await coReqeust({
    url: Config.api.map + '?location=' + locationString + '&key=' + Config.api.mapKey,
    method: 'get'
  });

  let res = JSON.parse(_res.body);

  if (res.status === 0 && res.message === 'query ok') {
    ctx.body = {
      status: 'success',
      location: res.result.address
    };
  } else {
    ctx.body = {
      status: 'failed',
      info: res
    }
  }


}

let submitEatRecord = async (ctx) => {
  let data = ctx.request.body.recordData;
  console.log(data)

  let sqlStatements = Config.sqlStatements
  let result = await dbController.coSql(sqlStatements.addRecord.sql, [
    data.imgList.join(':||:'),
    data.location,
    data.wordsToLynn,
    new Date()
    // moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  ])

  if (result.status === 'success') {
    console.log('insert success', result)

    ctx.body = {
      status: 'success'
    }
  } else {
    console.log('insert error', result.err)
    ctx.body = {
      status: 'failed',
      error: result.err
    }
  }
}

let getHistoryRecord = async (ctx) => {
  let sqlStatements = Config.sqlStatements
  let result = await dbController.coSql(sqlStatements.getHistoryRecord.sql)

  if (result.status === 'success') {
    console.log('get success', result)

    result.data.result.forEach(item => {
      item.time = moment(item.time).calendar()
    })

    ctx.body = {
      status: 'success',
      data: result.data
    }
  } else {
    console.log('get error', result.err)
    ctx.body = {
      status: 'failed',
      error: result.err
    }
  }
}

module.exports = {
  getLocation,
  submitEatRecord,
  getHistoryRecord
}