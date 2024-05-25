import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database:
    process.env.NODE_ENV === 'development' ? 'db.sqlite' : 'test.sqlite',
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],

  // TypeOrm 자동 동기화, migration 작업을 위해 중지
  synchronize: false,

  // dist/migrations에 있는 파일들을 실행
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
