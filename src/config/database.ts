import { ConnectionOptions } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()
const databaseConfig: ConnectionOptions = {
	type: 'mariadb',
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USERNAME,
	password: process.env.DB_PWD,
	database: process.env.DATABASE_NAME,
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	synchronize: false,
	migrationsRun: true,
	logging: process.env.NODE_ENV !== 'production',
	migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: '../migrations',
	},
}

export = databaseConfig
