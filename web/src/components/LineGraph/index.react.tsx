import React from 'react';
import { Line } from 'react-chartjs-2';

const LineGraph = ({ data }) => {
    const { currencyData, supportRegions, slopeTrends } = data;

    // Convert currencyData to Chart.js data format
    const chartData = {
        labels: currencyData.map(data => data.time),
        datasets: [
            {
                id: 1,
                label: "Currency Data",
                data: currencyData.map((d) => d.price),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
                lineTension: 0
            },
            {
                id: 2,
                label: "Slope Trends",
                data: slopeTrends.map((d) => d.endPrice),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
                lineTension: 0,
                showLine: true,
                spanGaps: true
            },
            {
                id: 3,
                label: "Stability Regions",
                data: supportRegions.map((d) => d.minPrice),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                pointRadius: 0,
                fill: true,
                lineTension: 0
            }
        ]
    };

    // Draw stability regions as boxes on the graph
    const chartOptions = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        annotation: {
            annotations: [
                {
                    type: 'box',
                    drawTime: 'beforeDatasetsDraw',
                    yScaleID: 'y-axis-0',
                    yMin: 0,
                    yMax: 100,
                    xScaleID: 'x-axis-0',
                    xMin: new Date('2022-11-01'),
                    xMax: new Date('2022-11-02'),
                    backgroundColor: 'rgba(255, 0, 0, 0.5)'
                },
                {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: new Date('2022-11-01'),
                    borderColor: 'red',
                    borderWidth: 2
                },
                {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: 50,
                    borderColor: 'red',
                    borderWidth: 2
                }
            ]
        }
        // annotation: {
        //     annotations: [
        //         {
        //             type: 'box',
        //             drawTime: 'beforeDatasetsDraw',
        //             xScaleID: 'x-axis-0',
        //             yScaleID: 'y-axis-0',
        //             xMin: supportRegions.startTime,
        //             xMax: supportRegions.endTime,
        //             yMin: supportRegions.startPrice,
        //             yMax: supportRegions.endPrice,
        //             backgroundColor: 'rgba(255, 0, 0, 0.5)'
        //         },
        //         {
        //             type: 'line',
        //             drawTime: 'beforeDatasetsDraw',
        //             xScaleID: 'x-axis-0',
        //             yScaleID: 'y-axis-0',
        //             x1: slopeTrends.startTime,
        //             y1: slopeTrends.startPrice,
        //             x2: slopeTrends.endTime,
        //             y2: slopeTrends.endPrice,
        //             backgroundColor: 'rgba(255, 0, 0, 0.5)'
        //         }
        //     ]
        // }
    };

    return (
        <div>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default LineGraph;