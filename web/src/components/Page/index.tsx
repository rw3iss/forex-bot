
import React, { useEffect, useState } from 'react';
import DataService from '../../services/DataService';
import TradingView from '../TradingView';
import './style.scss';

const POLL_INTERVAL = 5000;

function Page() {
    const [data, setData] = useState(undefined);

    const loadData = () => {
        DataService.loadData().then(data => setData(data));
    }

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, POLL_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="chart-page">
            <TradingView />
            {/* {data && <LineGraph data={data} />} */}
        </div>
    );
}

export default Page;