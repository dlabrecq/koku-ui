import { orgUnitIdKey, Query } from 'api/queries/query';

export const getGroupById = (query: Query) => {
  const groupByOrg =
    query && query.group_by ? query.group_by[orgUnitIdKey] : undefined;
  const groupBys = query && query.group_by ? Object.keys(query.group_by) : [];

  return groupByOrg ? 'account' : groupBys.find(key => key !== orgUnitIdKey);
};

export const getGroupByValue = (query: Query) => {
  const groupById = getGroupById(query);
  return groupById ? query.group_by[groupById] : undefined;
};
