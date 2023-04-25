import cron from 'node-cron';
import passwordExipiration from '../services/isPasswordExpired';
import 'dotenv/config';

const schedulingJob = () => {
  const task = cron.schedule(process.env.JOB_SCHEDULING_TIME, passwordExipiration);
  task.start();
};
export default schedulingJob;
