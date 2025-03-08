"use client";

import { ReactElement, useRef, useEffect } from "react";
import { CandlestickData, Period } from "@/types/stocks";
import {
  ColorType,
  createChart,
  TimeChartOptions,
  DeepPartial,
  BaselineSeries,
  CrosshairMode,
} from "lightweight-charts";

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
      height: 100,
      layout: {
        textColor: "white",
        background: { type: ColorType.Solid, color: "#16324F" },
        panes: {
          enableResize: false,
        },
      },
      rightPriceScale: {
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

    // Tworzymy wykres wewnątrz kontenera
    const chart = createChart(chartContainerRef.current, chartOptions);

    const baselineSeries = chart.addSeries(BaselineSeries, {
      baseValue: { type: "price", price: baselineValue },
      topLineColor: "rgba( 38, 166, 154, 1)",
      topFillColor1: "rgba( 38, 166, 154, 0.28)",
      topFillColor2: "rgba( 38, 166, 154, 0.05)",
      bottomLineColor: "rgba( 239, 83, 80, 1)",
      bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
      bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
    });

    baselineSeries.setData(chartData);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      id={`stock-${id}`}
      style={{ width: "100%", height: "100px" }}
    />
  );
};

export default PreviewChart;
