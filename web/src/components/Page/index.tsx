
import React, { useEffect, useState } from 'react';
import DBService from '../../services/DBService';
import TradingView from '../TradingView';
import './style.scss';

const POLL_INTERVAL = 5000;

function Page() {
    const [data, setData] = useState(undefined);

    const loadData = () => {
        DBService.loadData().then(data => setData(data));
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