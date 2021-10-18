const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(), //导出本地文件时需要把这行删掉,会污染输出结果;
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level} ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()]
});

module.exports = logger;
