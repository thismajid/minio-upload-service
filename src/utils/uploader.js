import multer from 'fastify-multer';
import path from 'path';

const LIMIT = 100000;

class Uploader {
  config(type) {
    switch (type) {
      case 'file':
        return multer({
          storage: multer.diskStorage({
            destination: (_req, _file, cb) => {
              cb(null, 'uploads/');
            },
            filename: function (_req, _file, cb) {
              cb(null, `${Date.now()}${path.extname(_file.originalname)}`);
            },
          }),
          fileFilter: (_req, _file, cb) => {
            cb(null, true);
          },
          limits: { fileSize: LIMIT * 1024 * 1024 },
          preservePath: true,
        }).single('file');

      case 'files':
        return multer({
          storage: multer.diskStorage({
            destination: (_req, _file, cb) => {
              cb(null, 'uploads/');
            },
            filename: function (_req, _file, cb) {
              cb(null, `${Date.now()}${path.extname(_file.originalname)}`);
            },
          }),
          fileFilter: (_req, _file, cb) => {
            cb(null, true);
          },
          limits: { fileSize: LIMIT * 1024 * 1024 },
          preservePath: true,
        }).array('files', 15);
    }
  }
}

export default new Uploader();
