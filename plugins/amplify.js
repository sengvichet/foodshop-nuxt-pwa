import Vue from 'vue'
import Amplify from "aws-amplify";

Amplify.configure({

  Storage: {
    region: process.env.s3.REGION,
    bucket: process.env.s3.BUCKET,
    identityPoolId: (process.env.stage == 'prod') ? process.env.cognito.PROD_IDENTITY_POOL_ID : process.env.cognito.DEV_IDENTITY_POOL_ID
  },
  Auth: {
    mandatorySignIn: false,
    region: (process.env.stage == 'prod') ? process.env.cognito.PROD_REGION : process.env.cognito.DEV_REGION,
    userPoolId: (process.env.stage == 'prod') ? process.env.cognito.PROD_USER_POOL_ID : process.env.cognito.DEV_USER_POOL_ID,
    identityPoolId: (process.env.stage == 'prod') ? process.env.cognito.PROD_IDENTITY_POOL_ID : process.env.cognito.DEV_IDENTITY_POOL_ID,
    userPoolWebClientId: (process.env.stage == 'prod') ? process.env.cognito.PROD_APP_CLIENT_ID : process.env.cognito.DEV_APP_CLIENT_ID
  },
  API: {
    endpoints: [{
      name: "metamat",
      endpoint: (process.env.stage == 'prod') ? process.env.apiGateway.PROD_URL : process.env.apiGateway.DEV_URL,
      region: process.env.apiGateway.REGION
    }, ]
  }
})

Vue.use(Amplify)

export default ({
  app
}, inject) => {
  app.amplify = new Amplify({})
}