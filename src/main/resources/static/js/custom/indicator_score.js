function handleScore(title, min, max, ranges) {
    var chartSpeed = Highcharts.chart('content_score_graphic', Highcharts.merge(
        {
            chart: {
                type: 'solidgauge',
                alignTicks: false,
                height: '300px'
            },
            title: {
                text: '',
                floating: true
            },
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            // the value axis
            yAxis: {
                stops: ranges,
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 5,
                title: {
                    y: 30
                },
                labels: {
                    y: 16
                }
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        },
        {
            yAxis: {
                min: min,
                max: max,
                title: {
                    text: title
                }
            },

            credits: {
                enabled: false
            },

            series: [{
                data: [2],
                tooltip: {
                    enabled: false
                }
            }]

        }));
}