import { getInteractiveLegendItemStyles } from '@patternfly/react-charts';
import i18next from 'i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory-core';

import { getMaxMinValues, getTooltipContent } from './chartDatumUtils';

export interface ChartData {
  childName?: string;
}

export interface ChartLegendItem {
  childName?: string;
  name?: string;
  symbol?: any;
  tooltip?: string;
}

export interface ChartSeries {
  childName?: string;
  data?: [ChartData];
  isBar?: boolean; // Used with daily charts
  isForecast?: boolean; // Used with daily charts
  isLine?: boolean; // Used with daily charts
  legendItem?: ChartLegendItem;
  style?: VictoryStyleInterface;
}

// Returns groups of chart names associated with each data series
export const getChartNames = (series: ChartSeries[]) => {
  const result = [];

  if (series) {
    series.map(serie => {
      // Each group of chart names are hidden / shown together
      result.push(serie.childName);
    });
  }
  return result as any;
};

export const getDomain = (series: ChartSeries[], hiddenSeries: Set<number>) => {
  const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };
  let maxValue = -1;
  let minValue = -1;

  if (series) {
    series.forEach((s: any, index) => {
      if (!isSeriesHidden(hiddenSeries, index) && s.data && s.data.length !== 0) {
        const { max, min } = getMaxMinValues(s.data);
        maxValue = Math.max(maxValue, max);
        if (minValue === -1) {
          minValue = min;
        } else {
          minValue = Math.min(minValue, min);
        }
      }
    });
  }

  const threshold = maxValue * 0.1;
  const max = maxValue > 0 ? Math.ceil(maxValue + threshold) : 0;
  const _min = minValue > 0 ? Math.max(0, Math.floor(minValue - threshold)) : 0;
  const min = _min > 0 ? _min : 0;

  if (max > 0) {
    domain.y = [min, max];
  }
  return domain;
};

// Returns legend data styled per hiddenSeries
export const getLegendData = (series: ChartSeries[], hiddenSeries: Set<number>, tooltip: boolean = false) => {
  if (!series) {
    return undefined;
  }
  const result = series.map((s, index) => {
    const data = {
      childName: s.childName,
      ...s.legendItem, // name property
      ...(tooltip && { name: s.legendItem.tooltip }), // Override name property for tooltip
      ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
    };
    return data;
  });
  return tooltip ? result : result.filter(d => d.childName.indexOf('Cone') === -1);
};

// Note: Forecast is expected to use both datum.y and datum.y0
export const getTooltipLabel = (datum: any, formatDatumValue: ValueFormatter, formatDatumOptions: FormatOptions) => {
  const formatter = getTooltipContent(formatDatumValue);
  const dy =
    datum.y !== undefined && datum.y !== null ? formatter(datum.y, datum.units, formatDatumOptions) : undefined;
  const dy0 =
    datum.y0 !== undefined && datum.y0 !== null ? formatter(datum.y0, datum.units, formatDatumOptions) : undefined;

  if (dy !== undefined && dy0 !== undefined) {
    return i18next.t('chart.cost_forecast_cone_tooltip', { value0: dy0, value1: dy });
  }
  return dy !== undefined ? dy : i18next.t('chart.no_data');
};

export const initHiddenSeries = (series: ChartSeries[], hiddenSeries: Set<number>, index: number) => {
  const result = new Set(hiddenSeries);
  if (!result.delete(index)) {
    result.add(index);
  }

  // Toggle forecast confidence
  const childName = series[index].childName;
  if (childName.indexOf('forecast') !== -1) {
    let _index;
    for (let i = 0; i < series.length; i++) {
      if (series[i].childName === `${childName}Cone`) {
        _index = i;
        break;
      }
    }
    if (index !== undefined && !result.delete(_index)) {
      result.add(_index);
    }
  }
  return result;
};

// Returns true if at least one data series is available
export const isDataAvailable = (series: ChartSeries[], hiddenSeries: Set<number>) => {
  const unavailable = []; // API data may not be available (e.g., on 1st of month)

  if (series) {
    series.forEach((s: any, index) => {
      if (isSeriesHidden(hiddenSeries, index) || (s.data && s.data.length === 0)) {
        unavailable.push(index);
      }
    });
  }
  return unavailable.length !== (series ? series.length : 0);
};

// Returns true if data series is hidden
export const isDataHidden = (series: ChartSeries[], hiddenSeries: Set<number>, data: any) => {
  if (data && data.length) {
    for (let keys = hiddenSeries.keys(), key; !(key = keys.next()).done; ) {
      let dataChildName;
      let serieChildName;

      for (const item of data) {
        if (item.childName) {
          dataChildName = item.childName;
          break;
        }
      }
      for (const item of series[key.value].data) {
        if (item.childName) {
          serieChildName = item.childName;
          break;
        }
      }
      if (serieChildName && dataChildName && serieChildName === dataChildName) {
        return true;
      }
    }
  }
  return false;
};

// Returns true if data series is hidden
export const isSeriesHidden = (hiddenSeries: Set<number>, index: number) => {
  return hiddenSeries.has(index);
};
