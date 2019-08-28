import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const costModelsState = (state: RootState) => state[stateKey];

export const costModels = (state: RootState) => {
  const cms = costModelsState(state).costModels;
  if (cms) {
    return cms.data;
  }
  return [];
};

export const status = (state: RootState) => costModelsState(state).status;

export const error = (state: RootState) => costModelsState(state).error;

export const currentFilterValue = (state: RootState) =>
  costModelsState(state).currentFilterValue;

export const currentFilterType = (state: RootState) =>
  costModelsState(state).currentFilterType;

export const query = (state: RootState) => {
  const payload = costModelsState(state).costModels;
  if (payload === null) {
    return {
      name: null,
      type: null,
      offset: null,
      limit: null,
    };
  }
  const urlParams = new URLSearchParams(payload.links.first.split('?')[1]);
  return {
    name: urlParams.get('name'),
    type: urlParams.get('type'),
    offset: urlParams.get('offset'),
    limit: urlParams.get('limit'),
  };
};

export const pagination = (state: RootState) => {
  const payload = costModelsState(state).costModels;
  if (payload === null) {
    return {
      page: 1,
      perPage: 1,
      count: 0,
    };
  }

  let urlParams = null;
  if (payload.links.next !== null) {
    urlParams = new URLSearchParams(payload.links.next.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) - limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: payload.meta.count,
    };
  }

  if (payload.links.previous !== null) {
    urlParams = new URLSearchParams(payload.links.previous.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) + limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: payload.meta.count,
    };
  }

  urlParams = new URLSearchParams(payload.links.first.split('?')[1]);
  return {
    page: 1,
    perPage: Number(urlParams.get('limit')),
    count: payload.meta.count,
  };
};
