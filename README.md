## Express Experiments (SriBox)

This is a test for using codesandbox.io as a shared development environment
for learning to write an appserver with database and authentication support.

### Code Entry Points

The server's entry point is `app.js`, which sets up a minimal Express http server.

The client's entry point is defined in the handlebars template `views/index.hbs`,
which itself loads some terrible console terminal utilities from another project.

### Code File Organization

```
app.js        main application entry point, run by codesandbox through npm start
data/         data files that are used by the server
modules/      modules that are require'd by the server
public/       website and client-side code
routes/       used by the http server to handle different requests
  index.js    imported by app.js to define / route handling
  users.js    imported by app.js to define /users route handline
views/        Handlebars (hbs) view templates define used by Express template res.render()
  layouts/    Handlebars layouts hold views (like an app shell with a content block)
  index.hbs   main website index, served by an Express route to / (see routes/index.js
              which calls res.render() with it, using the template engine registered
              to .hbs extensions)
```
