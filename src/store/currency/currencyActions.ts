import { Currency, fetchCurrency as apiGetCurrency } from 'api/currency';
import { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getReportId } from './currencyCommon';

interface CurrencyActionMeta {
  reportId: string;
}

export const fetchCurrencyRequest = createAction('currency/fetch/request')<CurrencyActionMeta>();
export const fetchCurrencySuccess = createAction('currency/fetch/success')<Currency, CurrencyActionMeta>();
export const fetchCurrencyFailure = createAction('currency/fetch/failure')<AxiosError, CurrencyActionMeta>();

export function fetchCurrency() {
  return dispatch => {
    const meta: CurrencyActionMeta = {
      reportId: getReportId(),
    };

    dispatch(fetchCurrencyRequest(meta));

    return apiGetCurrency()
      .then(res => {
        dispatch(fetchCurrencySuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchCurrencyFailure(err, meta));
      });
  };
}
