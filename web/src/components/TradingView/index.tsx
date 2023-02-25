import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingView() {
    const onLoadScriptRef = useRef();

    useEffect(
        () => {
            onLoadScriptRef.current = createWidget;

            if (!tvScriptLoadingPromise) {
                tvScriptLoadingPromise = new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.id = 'tradingview-widget-loading-script';
                    script.src = 'https://s3.tradingview.com/tv.js';
                    script.type = 'text/javascript';
                    script.onload = resolve;

                    document.head.appendChild(script);
                });
            }

            tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

            return () => onLoadScriptRef.current = null;

            function createWidget() {
                if (document.getElementById('tradingview_b73b9') && 'TradingView' in window) {
                    new window.TradingView.widget({
                        autosize: true,
                        symbol: "FX:EURUSD",
                        timezone: "Etc/UTC",
                        theme: "dark",
                        style: "1",
                        locale: "en",
                        toolbar_bg: "#f1f3f6",
                        enable_publishing: false,
                        withdateranges: true,
                        range: "6M",
                        hide_side_toolbar: false,
                        allow_symbol_change: true,
                        watchlist: ["FX:USDJPY", "FX:USDCAD", "FX:AUDUSD", "FX:EURJPY", "FX:GBPUSD", "FX:EURUSD"],
                        details: true,
                        studies: ["STD;CCI", "STD;WMA", "STD;PSAR"],
                        show_popup_button: true,
                        popup_width: "1000",
                        popup_height: "650",
                        container_id: "tradingview_b73b9"
                    });
                }
            }
        },
        []
    );

    return (
        <div className='tradingview-widget-container'>
            <div id='tradingview_b73b9' />
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/symbols/EURUSD/?exchange=FX" rel="noopener" target="_blank"><span className="blue-text">EUR USD chart</span></a> by TradingView
            </div>
        </div>
    );
}
