import {CALL_API} from '../middleware/api';
import {CHART_STAT_GET} from '../lib/api'

export const CHART_STAT_GET_REQUEST = 'CHART_STAT_GET_REQUEST';
export const CHART_STAT_GET_SUCCESS = 'CHART_STAT_GET_SUCCESS';
export const CHART_STAT_GET_FAILURE = 'CHART_STAT_GET_FAILURE';
export const CHART_STAT_GET_CERROR = 'CHART_STAT_GET_CERROR';

export default function getChartStats(param, query) {
    return {
        [CALL_API]: {
            types: [CHART_STAT_GET_REQUEST, CHART_STAT_GET_SUCCESS, CHART_STAT_GET_FAILURE],
            cError: CHART_STAT_GET_CERROR,
            endpoint: CHART_STAT_GET(param, query),
        }
    }
}