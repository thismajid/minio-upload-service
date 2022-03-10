import * as Minio from 'minio';
import path from 'path';

class MinioHelper {
  constructor() {
    const {
      END_POINT_MINIO: endPoint,
      PORT_MINIO: port,
      ACCESS_KEY_MINIO: accessKey,
      SECRET_KEY_MINIO: secretKey,
    } = process.env;
    this.client = new Minio.Client({
      endPoint,
      port: +port,
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  connection() {
    this.listBuckets()
      .then((buckets) => {
        const findBucket = buckets.find((bucket) => bucket.name === 'storage');
        if (findBucket) {
          console.log('🚀 Minio is running');
          return;
        }
        this.makeBucket('storage', 'region')
          .then((_res) => console.log('🚀 Minio is running'))
          .catch((err) => console.error('Minio Error', err.message));
      })
      .catch((err) => console.error('Minio Error', err.message));
  }

  makeBucket(name, region) {
    return new Promise((resolve, reject) => {
      this.client.makeBucket(name, region, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  listBuckets() {
    return new Promise((resolve, reject) => {
      this.client.listBuckets((err, bucketStream) => {
        if (err) {
          reject(err);
        }
        resolve(bucketStream);
      });
    });
  }

  bucketExists(name) {
    return new Promise((resolve, reject) => {
      this.client.bucketExists(name, (err, exists) => {
        if (err) {
          reject(err);
        }
        resolve(exists);
      });
    });
  }

  removeBucket(name) {
    return new Promise((resolve, reject) => {
      this.client.removeBucket(name, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  listObjects(name) {
    const stream = this.client.listObjects(name, '', true);
    stream.on('data', (obj) => obj);
    stream.on('error', (err) => err);
  }

  getObject(response, bucketName, objectName) {
    this.client.getObject(bucketName, objectName, (err, dataStream) => {
      if (err) {
        return console.log(err);
      }
      dataStream.on('data', (chunk) => {
        response.raw.write(chunk);
      });
      dataStream.on('end', () => {
        response.raw.end();
      });
      dataStream.on('error', (err) => {
        console.error({ err });
      });
    });
  }

  createBucketIfNotExist(bucketName) {
    this.listBuckets()
      .then((buckets) => {
        const findBucket = buckets.find((bucket) => bucket.name === bucketName);
        if (!findBucket) {
          this.makeBucket(bucketName, 'region').catch((err) =>
            console.error('Minio Error', err.message)
          );
        }
      })
      .catch((err) => console.error('Minio Error', err.message));
  }

  putObject(files) {
    for (let file of files) {
      const fileBucket = file.mimetype.split('/')[0];
      this.createBucketIfNotExist(fileBucket);
      this.client.fPutObject(
        fileBucket,
        file.filename,
        path.join(__dirname, `../../${file.path}`),
        {
          'Content-Type': file.mimetype,
        },
        function (err, objInfo) {
          if (err) {
            return console.log(err);
          }
          console.log('Success', objInfo.etag, objInfo.versionId);
        }
      );
    }
  }

  removeObject(bucketName, objectName) {
    this.client.removeObject(bucketName, objectName, (err, _response) => {
      if (err) {
        throw Error('minio delete file error');
      }
      return true;
    });
  }
}

export default MinioHelper;
