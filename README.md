
The Elevate PWA is developed using the Ionic framework. This document provides instructions on setting up the development environment.

Contents
---------------------

 * [Dependencies](#dependencies)
 * [Setting up the CLI](#setting-up-the-cli)
 * [Setting up the Project](#setting-up-the-project)
 * [Building the Application](#building-the-application)
 * [Debugging the Application](#debugging-the-application)

Dependencies
------------

| Requirement       | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| Ionic CLI         | Version 7.1.1 (/usr/local/lib/node_modules/@ionic/cli)                                                                  |
| Ionic Framework   | @ionic/angular 7.0.0 @angular-devkit/build-angular : 17.0.0 @angular-devkit/schematics : 17.0.0 @angular/cli : 17.0.0 @ionic/angular-toolkit : 11.0.1 |
| Capacitor         | Capacitor CLI : 6.0.0 @capacitor/core : 6.0.0                     |
| System            | [nodejs](https://nodejs.org/) : v18.20.3 npm: 10.7.0           |

Additional information
----------------------

* [Ionic Framework](https://ionicframework.com/docs/)

Setting up the CLI
------------------

1. Install the Ionic framework.

    ```
    npm install -g ionic
    ```

2. Install the Ionic client.

    ```
    npm install -g @ionic/cli
    ```



Setting up the Project
----------------------

1. Clone the [repository](https://github.com/ELEVATE-Project/observation-survey-projects-pwa).
2. Go to the project folder and run `npm i`.

Building the Application
------------------------

1. Run the project on your local system using the following command:

    ```
    ionic serve
    ```

Debugging the Application
-------------------------

1. Open the running app in the browser.
2. Start inspecting using Chrome dev tools or any alternatives.