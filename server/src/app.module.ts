import {HttpModule, Module} from '@nestjs/common';
import { RatesModule } from './rates/rates.module';
import {ScheduleModule}     from '@nestjs/schedule';
import {TypeOrmModule}      from '@nestjs/typeorm';
import {AppController}      from './app.controller';
import {RateController}     from './rates/rate.controller';
import {RateService}        from './rates/rate.service';
import {RateGateway}        from './rates/rate.gateway';
import {AppService}         from './app.service';
import {RateRepository}     from "./rates/rate.repository";
import {Rate}               from "./rates/rate.entity";

@Module({
			imports: [
				HttpModule,
				ScheduleModule.forRoot(),
				TypeOrmModule.forRoot({
					type:                'mysql',
					host:                'localhost',
					port:                3306,
					//username:            'mysql',
					//password:            'mysql',
					username:            'root',
					password:            'root',
					database:            'forex',
					entities:            ["dist/**/*.entity{.ts,.js}"],
					synchronize:         true,
					keepConnectionAlive: true
				}),

				TypeOrmModule.forFeature([
					RateRepository,
					Rate
				]),

				RatesModule],

			controllers: [AppController, RateController],
			providers:   [AppService, RateService, RateGateway],
		})
export class AppModule {
}
