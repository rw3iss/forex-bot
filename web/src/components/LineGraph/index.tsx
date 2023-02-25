import getSMA from "app/utils/getSMA";
import getSlopeChanges from "app/utils/getSlopeChanges";
import getSupportRegions from "app/utils/getSupportRegions";
import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import React, { useEffect, useRef, useState } from "react";

Chart.register(Tooltip, LinearScale, LineElement, CategoryScale, PointElement, LineController);

const DATE_FORMAT = "M/D hh:mm:ss a";
const MAX_X_VALUES = 50;

const formatTime = (t) => t;// moment.unix(t).format(DATE_FORMAT);

function LineGraph({ data }) {
    let { currencyData }:
        { currencyData: Array<any> } = data; //, supportRegions: Array<any>, slopeTrends: Array<any> } = data;
    const chartRef = useRef(null);
    const [chart, setChart] = useState(undefined);

    // if (currencyData.length > MAX_X_VALUES) {
    //     console.log(`LIMIT ${currencyData.length} DATA VALUES TO ${MAX_X_VALUES} LATEST VALUES.`);
    //     currencyData = currencyData.slice(currencyData.length - MAX_X_VALUES, currencyData.length - 1);
    // }

    // stable region:
    // startIndex: startIndex,
    // endIndex: endIndex,
    // startTime: regionStartTime,
    // endTime: regionEndTime,
    // startPrice: currencyData[startIndex].price,
    // endPrice: currencyData[endIndex].price

    // slope trend:
    // startTime: currencyData[i].time,
    // startPrice: currencyData[i].price,
    // endTime: currencyData[currencyData.length - 1].time,
    // endPrice: currencyData[currencyData.length - 1].price,
    // direction: 'negative'

    const currencyChartData = {
        label: "Currency Data",
        data: currencyData.map(d => d.price),
        backgroundColor: "rgba(200, 240, 100, 0.8)",
        borderColor: "rgba(100, 200, 180, 1)",
        borderWidth: 2,
    };

    // SLOPES

    const slopeData = getSlopeChanges(currencyData);
    const slopeDataset = [...slopeData.map(data => ({ x: data.startTime, y: data.startPrice }))];
    if (slopeData.length) slopeDataset.push({ x: slopeData[slopeData.length - 1].endTime, y: slopeData[slopeData.length - 1].endPrice });
    const slopeTrendChartData = {
        label: "Slope Trends",
        data: slopeDataset,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(150, 200, 240, 1)",
        borderWidth: 3
    };

    // SUPPORT REGIONS
    const supportRegions = getSupportRegions(currencyData, .2);

    const SMAs = getSMA(currencyData, 10);
    console.log(`SMAs`, SMAs, currencyData)

    const config: any = {
        type: "line",
        data: {
            labels: currencyData.map(data => formatTime(data.time)),
            datasets: [
                slopeTrendChartData,
                currencyChartData
            ]
        },
        options: {}
    };

    useEffect(() => {
        if (chart) {
            console.log(`UPDATE CHART`, data)
            removeData(chart);
            addData(chart);
        } else {
            const chartCanvas = chartRef.current;
            setChart(new Chart(chartCanvas, config));
        }
    }, [data]);

    // for updating: //
    function addData(chart) {
        chart.data.labels = currencyData.map(data => formatTime(data.time));
        chart.data.datasets = [
            slopeTrendChartData,
            currencyChartData
        ];
        chart.update('none');
    }

    function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach(dataset => dataset.data.pop());
        chart.update();
    }
    ////


    const options: any = {
        // scales: {
        //     y: {
        //         beginAtZero: true
        //     }
        // },
        plugins: {
            annotation: {
                annotations: [
                    ...supportRegions.map(r => {
                        console.log(`SR`, r)
                        return {
                            type: 'box',
                            drawTime: 'beforeDatasetsDraw',
                            xScaleID: 'x-axis-0',
                            yScaleID: 'y-axis-0',
                            xMin: r.startTime,
                            xMax: r.endTime,
                            yMin: r.minPrice,
                            yMax: r.maxPrice,
                            backgroundColor: 'rgba(50, 100, 200, 0.8)',
                        }
                    })
                ]
            }
        }
    }

    return <canvas ref={chartRef} />;
}

export default LineGraph;