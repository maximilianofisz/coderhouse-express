# Coderhouse: Desafio con Express
## Requisitos
* Tener un servidor MySQL corriendo en localhost:3306
* Tener un usuario de administrador con credenciales "root":"root". Se puede modoficiar esto en los archivos siguientes para evitar la creacion de un nuevo usuario :)
* Ejecutar los siguentes scripts en orden:
    * createDB-maria.js
    * createTB-maria.js
    * createTB-sqlite.js

## Iniciar el proyecto
```
npm run start
```
## Motor de plantilla seleccionado
Probablemente utilize el motor de plantillas Handlebars porque es el mas minimalista: El html del template es casi html nativo con excepcion de la logica y la posibilidad de acceso a los datos inyectados. En segundo lugar, pondria a EJS, que a pesar de que no me gusto su sintaxis, me intereso la posibilidad de inyectar javascript scripts nativamente.

<br/><br/>

<!-- ## Autorizacion
Para poder acceder a las rutas de administrador, es necesario agregar en nuestra request un header con los siguientes datos:
```
isadmin : true
``` -->


<br/><br/>

## Definiciones
| Version de artefacto | Puerto |
| ----------- | ----------- |
| Handlebars | 8080 |
| Pug | 8081 |
| Ejs | 8082 |

<br/><br/>

## Plantillas alternativas
En este repositorio tambien tengo el source code (desactualizado) del proyecto pero utilizando PUG y EJS en vez de Handlebars. Se pueden iniciar con:

### Iniciar con Pug:
```
npm run start-pug
```
### Iniciar con EJS:
```
npm run start-ejs
```