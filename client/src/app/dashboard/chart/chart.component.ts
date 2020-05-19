import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createChart }                                             from 'lightweight-charts';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: [ './chart.component.scss' ]
})
export class ChartComponent implements OnInit, AfterViewInit {

	@ViewChild('chartContainer', { static: true, read: ElementRef }) chartContainer;

	constructor() {
	}

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		console.log("chart init", this.chartContainer);
		const chart = createChart(document.body, {
			width: document.body.clientWidth,
			height: document.body.clientHeight - 80
		});
		const lineSeries = chart.addLineSeries();
		lineSeries.setData([
			{ time: '2019-04-11', value: 80.01 },
			{ time: '2019-04-12', value: 96.63 },
			{ time: '2019-04-13', value: 76.64 },
			{ time: '2019-04-14', value: 81.89 },
			{ time: '2019-04-15', value: 74.43 },
			{ time: '2019-04-16', value: 80.01 },
			{ time: '2019-04-17', value: 96.63 },
			{ time: '2019-04-18', value: 76.64 },
			{ time: '2019-04-19', value: 81.89 },
			{ time: '2019-04-20', value: 74.43 },
		]);
	}

}
