import { ms_per_minute } from '../constant';

export const toMinute = (date: Date) => Math.floor(date.getTime() / ms_per_minute);
