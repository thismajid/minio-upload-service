import MinioHelper from '../utils/minio';

const Minio = new MinioHelper();

class Storage {
  singleUpload(req, res) {
    try {
      const { END_POINT_MINIO: endPoint, PORT_MINIO: port } = process.env;
      const single_file = `http://${endPoint}:${port}/storage/${req.file.filename}`;
      Minio.putObject('storage', [req.file]);
      return res.send({
        status: 'success',
        msg: '001 file uploaded',
        single_file,
      });
    } catch (err) {
      return res.send({ status: 'error', msg: 'invalid request' });
    }
  }
}

export default Storage;
