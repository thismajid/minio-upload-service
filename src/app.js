import MinioHelper from './utils/minio';

class App {
  constructor(app) {
    this.port = process.env.PORT;
    this.app = app;
  }

  async settings() {
    this.app.setErrorHandler((error, request, reply) => {
      if (error) {
        request.log.error(error);
        reply.send(error);
      }
    });
    this.app.addContentTypeParser('*', (_req, done) => done());
    this.app.register(require('./routers'), { logLevel: 'info' });
    return this.app;
  }

  serve() {
    this.settings();
    this.app.listen(this.port, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server ready at http://localhost:${this.port}`);
      this.minio();
    });
  }

  minio() {
    const Minio = new MinioHelper();
    Minio.connection();
  }
}

export default App;
