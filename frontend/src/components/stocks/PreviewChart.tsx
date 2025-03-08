"use client";

import { ReactElement, useRef, useEffect } from "react";
import { CandlestickData } from "@/types/stocks";
import {
  ColorType,
  createChart,
  TimeChartOptions,
  DeepPartial,
  BaselineSeries,
  CrosshairMode,
} from "lightweight-charts";
import { getCssVariable } from "@/util/util";

interface Props {
  id: string;
  CandlestickData: CandlestickData[];
}

const PreviewChart = ({ id, CandlestickData }: Props): ReactElement<Props> => {
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
          color: getCssVariable("--color-card-bg"),
        },
        panes: {
          enableResize: false,
        },
      },
      rightPriceScale: {
        visible: false,
        scaleMargins: {
          top: 0.0,
          bottom: 0.0,
        },
        borderVisible: false,
        ticksVisible: false,
      },
      overlayPriceScales: { ticksVisible: false, borderVisible: false },
      crosshair: {
        mode: CrosshairMode.Hidden,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      timeScale: {
        visible: false,
      },
    };

    // closing of the first candle - most popular baseline
    const baselineValue = CandlestickData[0].close;
    const chartData = CandlestickData.map((candle) => {
      return {
        time: candle.time,
        value: candle.close,
      };
    });

    const chart = createChart(chartContainerRef.current, chartOptions);

    const baselineSeries = chart.addSeries(BaselineSeries, {
      baseValue: { type: "price", price: baselineValue },
      topLineColor: getCssVariable("--color-stock-green"),
      topFillColor1: "rgba( 38, 166, 154, 0.28)",
      topFillColor2: "rgba( 38, 166, 154, 0.05)",
      bottomLineColor: getCssVariable("--color-stock-red"),
      bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
      bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
    });

    baselineSeries.setData(chartData);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [CandlestickData]);

  return (
    <div
      ref={chartContainerRef}
      id={`stock-${id}`}
      className="h-14 pointer-events-none touch-none"
    />
  );
};

export default PreviewChart;
