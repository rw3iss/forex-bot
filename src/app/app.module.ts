import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { NotFoundComponent }       from './not-found/not-found.component';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		NotFoundComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
