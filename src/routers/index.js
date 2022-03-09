// // Controllers
// import StorageController from './../controllers/raychat';

// // middlewares
// import StorageMidd from './../middlewares/schema';

// // Hookes
// import Hooks from './../helpers/hooks';

// // Helpers
// import Upload from './../helpers/upload';

import multer from 'fastify-multer';
import multerMinIOStorage from 'multer-minio-storage';

import Storage from '../controllers/storage';

const storage = new Storage();

// import Uploader from '../utils/uploader';

// const Upload = new Uploader();

// const upload = Upload.config();

// import MinioHelper from '../utils/minio';

// const uploader = new Uploader();

// const singleUploader = uploader.singleUpload();

import Uploader from '../utils/uploader';

const singleUpload = Uploader.config('file');
const multipleUpload = Uploader.config('files');

// Routes
export default (fastify, _opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/api/uploads/single',
    preHandler: [singleUpload],
    handler: storage.singleUpload,
  });

  fastify.route({
    method: 'POST',
    url: '/api/uploads/multiple',
    preHandler: [multipleUpload],
    handler: storage.singleUpload,
  });

  //   fastify.route({
  //     method: 'POST',
  //     url: '/profile/',
  //     preHandler: [uploadProfile, Hook.authorization],
  //     handler: Storage.create,
  //   });

  done();
};
