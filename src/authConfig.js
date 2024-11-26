export const msalConfig = {
    auth: {
        clientId: '7960ca6f-58ae-4dde-a86a-929ea7e83745',
        authority: 'https://login.microsoftonline.com/2704fe5d-4853-46d7-933b-33ee001a4da5',
        
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    }
};

export const loginRequest = {
   scopes:['calendars.read', 'user.read', 'openid', 'profile', 'people.read', 'Mail.Read', 'User.ReadBasic.All','Mail.Send'] 
};
