/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { TimeSeriesAPIResponse } from 'x-pack/plugins/apm/server/lib/transactions/charts';
import { ITransactionDistributionAPIResponse } from 'x-pack/plugins/apm/server/lib/transactions/distribution';
import { TransactionListAPIResponse } from 'x-pack/plugins/apm/server/lib/transactions/get_top_transactions';
import { IUrlParams } from '../../../store/urlParams';
import { callApi } from '../callApi';
import { addVersion, getEncodedEsQuery } from './apm';

export async function loadTransactionList({
  serviceName,
  start,
  end,
  kuery,
  transactionType = 'request'
}: IUrlParams) {
  const groups = await callApi<TransactionListAPIResponse>({
    pathname: `/api/apm/services/${serviceName}/transaction_groups/${transactionType}`,
    query: {
      start,
      end,
      esFilterQuery: await getEncodedEsQuery(kuery)
    }
  });

  return groups.map(group => {
    group.sample = addVersion(group.sample);
    return group;
  });
}

export async function loadTransactionDistribution({
  serviceName,
  start,
  end,
  transactionName,
  transactionType = 'request',
  transactionId,
  kuery
}: Required<IUrlParams>) {
  return callApi<ITransactionDistributionAPIResponse>({
    pathname: `/api/apm/services/${serviceName}/transaction_groups/${transactionType}/${encodeURIComponent(
      transactionName
    )}/distribution`,
    query: {
      start,
      end,
      transactionId,
      esFilterQuery: await getEncodedEsQuery(kuery)
    }
  });
}

export async function loadDetailsCharts({
  serviceName,
  start,
  end,
  kuery,
  transactionType = 'request',
  transactionName
}: Required<IUrlParams>) {
  return callApi<TimeSeriesAPIResponse>({
    pathname: `/api/apm/services/${serviceName}/transaction_groups/${transactionType}/${encodeURIComponent(
      transactionName
    )}/charts`,
    query: {
      start,
      end,
      esFilterQuery: await getEncodedEsQuery(kuery)
    }
  });
}

export async function loadOverviewCharts({
  serviceName,
  start,
  end,
  kuery,
  transactionType = 'request'
}: IUrlParams) {
  return callApi<TimeSeriesAPIResponse>({
    pathname: `/api/apm/services/${serviceName}/transaction_groups/${transactionType}/charts`,
    query: {
      start,
      end,
      esFilterQuery: await getEncodedEsQuery(kuery)
    }
  });
}
