import dayjs from 'dayjs';

const utcToLocalTime = (utcTime) => {
  const timezoneOffset = dayjs().utcOffset(); // 以 Taipei 時間來說，此值會為 480
  const localTime = dayjs(utcTime).add(timezoneOffset, 'minute');
  return localTime;
};

export default utcToLocalTime;
