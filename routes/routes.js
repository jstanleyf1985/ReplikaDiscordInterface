const replikaRoutes = require('./replikadata');

const appRouter = (app, FS) => {
  app.get('/', (req, res) => {
    res.send('Welcome to the development api-server');
  });

  replikaRoutes(app, FS);
}

module.exports = appRouter;