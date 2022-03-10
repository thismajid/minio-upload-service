import { CronJob } from 'cron';
import fs from 'fs';
import path from 'path';

const DIRECTORY = '../../uploads/';

class CronJobs {
  deleteFileCron() {
    return new CronJob(
      '2 * * * * *',
      () => {
        fs.readdir(path.join(__dirname, DIRECTORY), (err, files) => {
          if (!err && files.length > 1) {
            files.splice(files.indexOf('not_deleted.txt'), 1);
            setTimeout(() => {
              for (let file of files) {
                fs.unlinkSync(path.join(__dirname, `${DIRECTORY}${file}`));
              }
            }, 10000);
          }
        });
      },
      null,
      true
    );
  }
}

export default new CronJobs();
