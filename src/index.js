import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import {registerLicense} from '@syncfusion/ej2-base';

registerLicense("Mgo+DSMBMAY9C3t2UlhhQlVMfV5AQmFMYVF2R2dJflx6cVNMY1RBNQtUQF1hTX9SdEBjXn9WdHFXRGhZ")
const msalInstance = new PublicClientApplication(msalConfig);
console.log(msalInstance.getAllAccounts());
ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
