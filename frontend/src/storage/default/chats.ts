import {SettingDetail} from "@/storage/storage.types";

export const CHARTS = 'charts'

const CHART_PERIOD = 'period' // Default Candle Period

enum CHART_VALUES {
    WEEK = '1w',
    DAY = '1d',
    MIN = '1m',
    HOUR = '1h',
    QUARTER = '15m',
    '4_HOUR' = '4h'
} // "1w", "1d", "4h", "1h", "15m", "1m"

export const periods = [
    CHART_VALUES.WEEK,
    CHART_VALUES.DAY,
    CHART_VALUES.MIN,
    CHART_VALUES.HOUR,
    CHART_VALUES.QUARTER,
    CHART_VALUES["4_HOUR"],
]

export interface ChartSettings {
    [CHARTS]: {
        [CHART_PERIOD]: SettingDetail<CHART_VALUES>
    }
}

const defaultValue: ChartSettings = {
    [CHARTS]: {
        [CHART_PERIOD]: {
            value: [CHART_VALUES.DAY],
            possibleValues: periods
        }
    }
}

export default defaultValue;