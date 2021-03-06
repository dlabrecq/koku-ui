import { Forecast, ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { runForecast } from 'api/forecasts/forecastUtils';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';

import { getForecastId } from './forecastCommon';
import { selectForecast, selectForecastFetchStatus } from './forecastSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ForecastActionMeta {
  forecastId: string;
}

export const fetchForecastRequest = createStandardAction('forecast/request')<ForecastActionMeta>();
export const fetchForecastSuccess = createStandardAction('forecast/success')<Forecast, ForecastActionMeta>();
export const fetchForecastFailure = createStandardAction('forecast/failure')<AxiosError, ForecastActionMeta>();

export function fetchForecast(
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isForecastExpired(getState(), forecastPathsType, forecastType, query)) {
      return;
    }

    const meta: ForecastActionMeta = {
      forecastId: getForecastId(forecastPathsType, forecastType, query),
    };

    dispatch(fetchForecastRequest(meta));
    runForecast(forecastPathsType, forecastType, query)
      .then(res => {
        dispatch(fetchForecastSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchForecastFailure(err, meta));
      });
  };
}

function isForecastExpired(
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  query: string
) {
  const forecast = selectForecast(state, forecastPathsType, forecastType, query);
  const fetchStatus = selectForecastFetchStatus(state, forecastPathsType, forecastType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!forecast) {
    return true;
  }

  const now = Date.now();
  return now > forecast.timeRequested + expirationMS;
}
