import { Sequelize } from 'sequelize';
import config from '../config/config';
 
export const sequelzie = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
      host: config.development.host,
      dialect: 'mysql',
      timezone: '+09:00' //? MySQL 내부의 디폴트 시간 UTC를 한국 시간으로 바꿔주기 위해
  }
);
