module.exports = {
  // TODO: change for STAGE and PROD environments
  port: 3030,
  database: 'mongodb://localhost/streaming_test_db',
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
            "maxLogSize": 10485760,
          }
        ]
      }
    ]
  }
};
