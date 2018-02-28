### weather-api 

This project uses Google Cloud Function (https://cloud.google.com/functions/) utilizing serverless model.

We need Google Cloud SDK (https://cloud.google.com/sdk/docs/) to deploy the application on Cloud. And we can use Google cloud local emulator (https://cloud.google.com/functions/docs/emulator) run the cloud functions locally.

Use `npm run deploy-function-<function>-<environment>` e.g. `deploy-function-forecasts-local` to deploy the function

`functions list commad will return you the list of functions deployed locally`

```
┌────────┬───────────┬─────────┬───────────────────────────────────────────────────────────────┐
│ Status │ Name      │ Trigger │ Resource                                                      │
├────────┼───────────┼─────────┼───────────────────────────────────────────────────────────────┤
│ READY  │ forecasts │ HTTP    │ http://localhost:8010/weather-app-micro/us-central1/forecasts │
├────────┼───────────┼─────────┼───────────────────────────────────────────────────────────────┤
│ READY  │ maps      │ HTTP    │ http://localhost:8010/weather-app-micro/us-central1/maps      │
└────────┴───────────┴─────────┴───────────────────────────────────────────────────────────────┘
```
To get the list of functions deployed on cloud use the following link: https://console.cloud.google.com/functions/list?project=weather-app-micro