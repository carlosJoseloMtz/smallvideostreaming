var localConfig = require('./local.js');
module.exports = {
  // TODO: change for STAGE and PROD environments
  port: 3030,
  database: localConfig.database,
  logger: {
    "appenders": [
      {
        "type": "clustered",
        "appenders": [
          {
            "type": "dateFile",
            "filename": "log/access.log",
            "pattern": "-yyyy-MM-dd",
            "category": "http"
          },
          {
            "type": "file",
            "filename": "log/app.log",
            "level": "debug",
            "maxLogSize": 10485760,
          }
        ]
      }
    ]
  }
};
