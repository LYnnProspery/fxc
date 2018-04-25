const mysql = require('mysql')
const config = require('../config')

let coSql = async (sql, params) => {
    return new Promise((resolve, reject) => {
        let pool = mysql.createPool(config.recordDbOpts)
        
        if (params) {
            pool.query(sql, params, (err, results, fields) => {
                if (err) {
                    console.log('query err', err)
                    reject({
                        status: 'failed',
                        err: err
                    })
                    return false
                }
    
                console.log('query success', err)
                resolve({
                    status: 'success',
                    data: {
                        results,
                        fields
                    }
                })
    
            })
        } else {
            pool.query(sql, (err, result) => {
                if (err) {
                    console.log('query err', err)
                    reject({
                        status: 'failed',
                        err: err
                    })
                    return false
                }
    
                console.log('query success', result)
                resolve({
                    status: 'success',
                    data: {
                        result
                    }
                })
            })
        }
    })
}

module.exports = {
    coSql
}