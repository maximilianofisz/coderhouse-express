# Coderhouse: Desafio con Express
## Iniciar el proyecto
```
npm run start
```
## Motor de plantilla seleccionado
Probablemente utilize el motor de plantillas Handlebars porque es el mas minimalista: El html del template es casi html nativo con excepcion de la logica y la posibilidad de acceso a los datos inyectados. En segundo lugar, pondria a EJS, que a pesar de que no me gusto su sintaxis, me intereso la posibilidad de inyectar javascript scripts nativamente.

<br/><br/>

## Autorizacion
Para poder acceder a las rutas de administrador, es necesario agregar en nuestra request un header con los siguientes datos:
```
isadmin : true
```


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