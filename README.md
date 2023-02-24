# Coderhouse: Desafio con Express
## Iniciar el proyecto
Para iniciar el proyecto se puede ejecutar alguno o ambos de los siguientes comandos:
```
pm2 start pm2Start.config.js
npm run start
```
## Configurar 

* Para modificar la cantidad de instancias, puertos u otras configs, se puede modificar los archivos pm2Start.config.js.

* La configuracion de nginx se puede modificar desde default.conf seguido de hacer un rebuild del dockerfile. (Probablemente sea necesario que cambies una IP por la tuya si usas Docker)

## Variables de enterno
Se requiren las siguientes variables de entorno completas con los valores pertinentes para el correcto funcionamiento. Adjunto ejemplo:
````
STATE=READY
ENV=PROD
PORT=9000
ADMIN_MAIL_ADDRESS="{{ethereal address}}"
ADMIN_MAIL_PASSWORD="{{ethereal password}}"
MONGOURL="mongodb+srv://{{user}}:{{pass}}@cluster0.4fvrhxv.mongodb.net/test?retryWrites=true&w=majority"
TWILIO_SID="{{SID}}"
TWILIO_TOKEN="{{TOKEN}}"
TWILIO_FROM_SMS="+19254744769"
TWILIO_FROM_WPP="+14155238886"
SESSION_TTL=600
````


## Motor de plantilla seleccionado
Probablemente utilize el motor de plantillas Handlebars porque es el mas minimalista: El html del template es casi html nativo con excepcion de la logica y la posibilidad de acceso a los datos inyectados. En segundo lugar, pondria a EJS, que a pesar de que no me gusto su sintaxis, me intereso la posibilidad de inyectar javascript scripts nativamente.


## Definiciones
| Version de artefacto | Puerto |
| ----------- | ----------- |
| Handlebars | Configurable al iniciar contenedor |

## Testing 
Para ejecutar los tests posibles (Axios y Mocha-Chai-Supertest) se deben ejecutar los siguientes comandos:
```
node /test/axios/test.js
npm run mochaTest
```

