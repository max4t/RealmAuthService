# Authentification microservice for a Realm Object Server


3 modules :
    - database in 'realm.js' => expose 'findByEmail'
    - logic in 'usecase.js' => check the user credentials
    - server in 'api.js' => sanatize the user input and send back code and json

'index.js' just wrap it all together with
'config.js' who fetch the config from the environment

the required env are :
    - REALM_HOST
    - REALM_PORT
    - REALM_USER
    - REALM_PASSWORD
    - REALM_PATH

tests are in 'test' for show. The dockerfile takes care of running them before
generating the container.

the server is exposed by defaut on 8080 with only POST /auth available.

