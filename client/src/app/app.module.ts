import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { NotFoundComponent }       from './not-found/not-found.component';
import { ChartComponent } from './dashboard/chart/chart.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RatesService } from './services/rates.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		NotFoundComponent,
		ChartComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		SocketIoModule.forRoot(config)
	],
	providers: [RatesService],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
