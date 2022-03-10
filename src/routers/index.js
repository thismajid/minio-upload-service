import StorageController from '../controllers/storage.controller';

import Uploader from '../utils/uploader';

const singleUpload = Uploader.config('file');
const multipleUpload = Uploader.config('files');

// Routes
export default (fastify, _opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/api/files/uploads/single',
    preHandler: [singleUpload],
    handler: StorageController.uploader,
  });

  fastify.route({
    method: 'POST',
    url: '/api/files/uploads/multiple',
    preHandler: [multipleUpload],
    handler: StorageController.uploader,
  });

  fastify.route({
    method: 'GET',
    url: '/api/files',
    handler: StorageController.showFile,
  });

  fastify.route({
    method: 'DELETE',
    url: '/api/files',
    handler: StorageController.deleteFile,
  });

  //   fastify.route({
  //     method: 'POST',
  //     url: '/profile/',
  //     preHandler: [uploadProfile, Hook.authorization],
  //     handler: Storage.create,
  //   });

  done();
};
