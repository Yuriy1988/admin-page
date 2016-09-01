import * as StatisticChartActions from '../actions/statisticActions';

function func() {
    return  {
        isFetching: false,
        error: {},
        data : {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgb(  1, 152, 117)',
                    'rgb(  3, 166, 120)',
                    'rgb(  77, 175, 124)',
                    'rgb(  42, 187, 155)',
                    'rgb( 0, 177, 106)',
                    'rgb(  30, 130, 76)',
                    'rgb( 4, 147, 114)',
                    'rgb( 38, 194, 129)',
                    'rgb(12,222,132)',
                    'rgb(0,92,59)',
                    'rgb(20,152,122)',
                    'rgb(78,205,196)',
                    'rgb(162, 222, 208)',
                    'rgb(135, 211, 124)',
                    'rgb(  144, 198, 149)',
                    'rgb(  38, 166, 91)',
                    'rgb(3, 201, 169)',
                    'rgb( 104, 195, 163)',
                    'rgb( 101, 198, 187)',
                    'rgb( 27, 188, 155)',
                    'rgb( 27, 163, 156)',
                    'rgb(  102, 204, 153)',
                    'rgb(  54, 215, 183)',
                    'rgb(  200, 247, 197)',
                    'rgb(  134, 226, 213)',
                    'rgb( 46, 204, 113)',
                    'rgb(  22, 160, 133)',
                    'rgb( 63, 195, 128)',

                ],
                hoverBackgroundColor:  [
                    'rgb(  1, 152, 117)',
                    'rgb(  3, 166, 120)',
                    'rgb(  77, 175, 124)',
                    'rgb(  42, 187, 155)',
                    'rgb( 0, 177, 106)',
                    'rgb(  30, 130, 76)',
                    'rgb( 4, 147, 114)',
                    'rgb( 38, 194, 129)',
                    'rgb(12,222,132)',
                    'rgb(0,92,59)',
                    'rgb(20,152,122)',
                    'rgb(78,205,196)',
                    'rgb(162, 222, 208)',
                    'rgb(135, 211, 124)',
                    'rgb(  144, 198, 149)',
                    'rgb(  38, 166, 91)',
                    'rgb(3, 201, 169)',
                    'rgb( 104, 195, 163)',
                    'rgb( 101, 198, 187)',
                    'rgb( 27, 188, 155)',
                    'rgb( 27, 163, 156)',
                    'rgb(  102, 204, 153)',
                    'rgb(  54, 215, 183)',
                    'rgb(  200, 247, 197)',
                    'rgb(  134, 226, 213)',
                    'rgb( 46, 204, 113)',
                    'rgb(  22, 160, 133)',
                    'rgb( 63, 195, 128)',
                ],
            }]
        }
    };
}

function foo() {
    return {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(  1, 152, 117)',
                'rgb(  3, 166, 120)',
                'rgb(  77, 175, 124)',
                'rgb(  42, 187, 155)',
                'rgb( 0, 177, 106)',
                'rgb(  30, 130, 76)',
                'rgb( 4, 147, 114)',
                'rgb( 38, 194, 129)',
                'rgb(12,222,132)',
                'rgb(0,92,59)',
                'rgb(20,152,122)',
                'rgb(78,205,196)',
                'rgb(162, 222, 208)',
                'rgb(135, 211, 124)',
                'rgb(  144, 198, 149)',
                'rgb(  38, 166, 91)',
                'rgb(3, 201, 169)',
                'rgb( 104, 195, 163)',
                'rgb( 101, 198, 187)',
                'rgb( 27, 188, 155)',
                'rgb( 27, 163, 156)',
                'rgb(  102, 204, 153)',
                'rgb(  54, 215, 183)',
                'rgb(  200, 247, 197)',
                'rgb(  134, 226, 213)',
                'rgb( 46, 204, 113)',
                'rgb(  22, 160, 133)',
                'rgb( 63, 195, 128)',

            ],
            hoverBackgroundColor: [
                'rgb(  1, 152, 117)',
                'rgb(  3, 166, 120)',
                'rgb(  77, 175, 124)',
                'rgb(  42, 187, 155)',
                'rgb( 0, 177, 106)',
                'rgb(  30, 130, 76)',
                'rgb( 4, 147, 114)',
                'rgb( 38, 194, 129)',
                'rgb(12,222,132)',
                'rgb(0,92,59)',
                'rgb(20,152,122)',
                'rgb(78,205,196)',
                'rgb(162, 222, 208)',
                'rgb(135, 211, 124)',
                'rgb(  144, 198, 149)',
                'rgb(  38, 166, 91)',
                'rgb(3, 201, 169)',
                'rgb( 104, 195, 163)',
                'rgb( 101, 198, 187)',
                'rgb( 27, 188, 155)',
                'rgb( 27, 163, 156)',
                'rgb(  102, 204, 153)',
                'rgb(  54, 215, 183)',
                'rgb(  200, 247, 197)',
                'rgb(  134, 226, 213)',
                'rgb( 46, 204, 113)',
                'rgb(  22, 160, 133)',
                'rgb( 63, 195, 128)',
            ],
        }]
    };
}

export default function chartStatistic (state = func(), action) {

    switch (action.type) {

        case StatisticChartActions.CHART_STAT_GET_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case StatisticChartActions.CHART_STAT_GET_SUCCESS:
            const statistic = foo();

            action.response.counts.forEach(function (item, i) {
                statistic.labels[i] = item.value;
                statistic.datasets[0].data[i] = item.count;
            });

            return Object.assign({}, func(), {data: statistic});

        case StatisticChartActions.CHART_STAT_GET_FAILURE:
            return Object.assign({}, state, {isFetching: false}, {error: action.error.message});

        default:
            return state;
    }
}