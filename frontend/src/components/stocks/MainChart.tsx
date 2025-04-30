"use client";

import {ReactElement, useRef, useEffect} from "react";
import {CandlestickData} from "@/types/stocks";
import {
    ColorType,
    createChart,
    TimeChartOptions,
    DeepPartial,
    CandlestickSeries,
} from "lightweight-charts";
import {getCssVariable} from "@/utils/util";

interface Props {
    CandlestickData: CandlestickData[];
    period: string;
}

const MainChart = ({CandlestickData}: Props): ReactElement<Props> => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const chartOptions: DeepPartial<TimeChartOptions> = {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                textColor: "white",
                background: {
                    type: ColorType.Solid,
                    color: "transparent",
                },
            },
        };

        const chart = createChart(chartContainerRef.current, chartOptions);

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: getCssVariable("--color-stock-green"),
            downColor: getCssVariable("--color-stock-red"),
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        candlestickSeries.setData(CandlestickData);
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [CandlestickData]);

    return (

        <div ref={chartContainerRef} className="w-full h-full relative" />

);
};

export default MainChart;
