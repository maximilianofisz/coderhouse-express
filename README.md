# Coderhouse: Desafio con Express
## Requisitos
* Tener un servidor MySQL corriendo en localhost:3306
* Tener un usuario de administrador con credenciales "root":"root". Se puede modoficiar esto en los archivos siguientes para evitar la creacion de un nuevo usuario :)
* Ejecutar los siguentes scripts en orden:
    * createDB-maria.js
    * createTB-maria.js

## Iniciar el proyecto
```
npm run start
```
## Motor de plantilla seleccionado
Probablemente utilize el motor de plantillas Handlebars porque es el mas minimalista: El html del template es casi html nativo con excepcion de la logica y la posibilidad de acceso a los datos inyectados. En segundo lugar, pondria a EJS, que a pesar de que no me gusto su sintaxis, me intereso la posibilidad de inyectar javascript scripts nativamente.


## Archivos siendo utilizados
Hay muchos archivos que estan commentados o no en uso por si lo tuviera que usar para alguna correcion/cambio de ultimo momento. Para esta ultima entrega se utiliza:
* Carpeta db, con comandos para levantar la base necesaria
* Carpeta helpers con el helper de SQL
* Carpeta routes, solamente el router de 'Home'
* Carpeta scripts temporalmente, donde sirvo los recursos que consuman mis html
* Carpeta views, algunas vistas
* main.js

## Rutas habilitadas
* GET, POST / 
* POST /login
* GET /logout

## Definiciones
| Version de artefacto | Puerto |
| ----------- | ----------- |
| Handlebars | 8080 |

