import MinioHelper from '../utils/minio.util';

const Minio = new MinioHelper();

class StorageController {
  uploader(request, reply) {
    try {
      const requestUrl = request.url.includes('single') ? 'single' : 'multiple';
      const { END_POINT_MINIO: endPoint, PORT_MINIO: port } = process.env;
      Minio.putObject(requestUrl === 'single' ? [request.file] : request.files);
      const files = [];
      if (requestUrl === 'single') {
        files.push(
          `http://${endPoint}:${port}/storage/${request.file.filename}`
        );
      } else {
        request.files.forEach((file) => {
          files.push(`http://${endPoint}:${port}/storage/${file.filename}`);
        });
      }
      return reply.send({
        status: 'success',
        msg: `${files.length} file uploaded`,
        files,
      });
    } catch (err) {
      console.log(err);
      return reply.send({ status: 'error', msg: 'invalid request' });
    }
  }

  showFile(request, reply) {
    try {
      const bucketName = request.query.folder || 'storage';
      Minio.getObject(reply, bucketName, request.query.file);
    } catch (err) {
      console.log(err);
      return reply.send({ status: 'error', msg: 'invalid request' });
    }
  }

  deleteFile(request, reply) {
    try {
      const bucketName = request.query.folder || 'storage';
      Minio.removeObject(bucketName, request.query.file);
      return reply.send({
        status: 'success',
        msg: `file: ${request.query.file} deleted successfully`,
      });
    } catch (err) {
      console.log(err);
      return reply.send({ status: 'error', msg: 'invalid request' });
    }
  }
}

export default new StorageController();
