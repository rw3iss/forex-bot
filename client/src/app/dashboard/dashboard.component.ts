import { Component, OnInit } from '@angular/core';
import { AppService }        from 'src/app/app.service';
import { RatesService } from '../services/rates.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

	public users = [];
	public rates = [];

	constructor(private appService: AppService, private rateService: RatesService) {
	}

	ngOnInit(): void {

		//const app = this.appService.getAppInstance();

		this.rateService.receiveRate().subscribe((message: string) => {
			console.log("Got rate", message);
			this.rates.push(message);
		});
	  
		this.rateService.getUsers().subscribe((users: any) => {
			console.log("Users", users);
		});

	}

}

