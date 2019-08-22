"use strict";

// Class definition
var AnalysisDashboard = function () {
    var validatorExcel;
    var validatorBureau;
    var formElExcel;
    var formElBureau;
    var initAnalysis = function () {
        $("#btn_back_analysis").on('click', function () {
            $("#row_dashboard_analysis").attr('hidden', 'hidden');
            $("#row_analysis").removeAttr('hidden');
            $('#analysis_file').change();
        });
    }

    var initAnalysisExcel = function () {
        validatorExcel = formElExcel.validate({
                // Validate only visible fields
                ignore: ":hidden",

                // Validation rules
                rules: {
                    //= Step 1
                    file: {
                        required: true,
                        extension: "xls|xlsx"
                    }
                }
            }
        );
        $("#btn_submit_analysis_excel").on('click', function () {
            if (validatorExcel.form()) {
                KTApp.progress($("#btn_submit_analysis_excel"));
                sendByExcel(document.querySelector("#analysis_file").files[0], $("#btn_submit_analysis_excel"));
            }
        });

    }
    var initAnalysisBureau = function () {
        $.validator.addMethod('validateRut', function (value, element, param) {
            return $.validateRut(value);
        }, 'Rut invalido');
        validatorBureau = formElBureau.validate({
                // Validate only visible fields
                ignore: ":hidden",

                // Validation rules
                rules: {
                    //= Step 1
                    bureau_rut: {
                        required: true,
                        validateRut: true
                    }
                }
            }
        );
        $('#bureau_rut').on('keyup', function (e) {
            e.preventDefault();
            $('#bureau_rut').val($.formatRut($('#bureau_rut').val()));
        });

        $("#btn_submit_analysis_bureau").on('click', function () {
            if (validatorBureau.form()) {
                KTApp.progress($("#btn_submit_analysis_bureau"));
                sendByBureau($("#analysis_file").val(), $("#btn_submit_analysis_bureau"));
            }
        });
    }
    var sendByExcel = function (file, btn) {
        var formData = new FormData();
        formData.append("file", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/analysis/" + $('#organization').val() + "/excel");
        xhr.onload = function (data) {
            KTApp.unprogress(btn);
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                var node = response.artemisa_response.businessTree.values[0];
                var listNode = response.artemisa_response.businessTree.listNames;
                var ratio1 = response.artemisa_response.riskRatios.values[0];
                var ratio2 = response.artemisa_response.riskRatios.values[1];
                var ratio3 = response.artemisa_response.riskRatios.values[2];
                var ratio4 = response.artemisa_response.riskRatios.values[3];
                var score = response.artemisa_response.riskScore.values;
                handlePulsate(node["label"], node["color"]);
                handleRatios(1, ratio1["titule"], ratio1["expression"], ratio1["result"], ratio1["postResult"], ratio1["color"]);
                handleRatios(2, ratio2["titule"], ratio2["expression"], ratio2["result"], ratio2["postResult"], ratio2["color"]);
                handleRatios(3, ratio3["titule"], ratio3["expression"], ratio3["result"], ratio3["postResult"], ratio3["color"]);
                handleRatios(4, ratio4["titule"], ratio4["expression"], ratio4["result"], ratio4["postResult"], ratio4["color"]);
                // handleNeuro(listNode);
                var form = btn.closest('form');
                form.clearForm();
                var ranges = [];
                for (var i = 0; i < score.ranges.length; i++) {
                    var range = score.ranges[i];
                    ranges.push([parseInt(range.upperLimit) / score.ranges[score.ranges.length - 1].upperLimit, range.color]);
                }
                handleScore(score.score, ranges, score.ranges[0].lowerLimit, score.ranges[score.ranges.length - 1].upperLimit, response.artemisa_response.riskScore.configuration.titule);
                $("#row_dashboard_analysis").removeAttr('hidden');
                $("#row_analysis").attr('hidden', 'hidden');
                $('#analysis_file').change();
            } else {
                swal.fire({
                    "title": "",
                    "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        }
        xhr.send(formData);
    }
    var sendByBureau = function (rut, btn) {
        KTApp.progress(btn);
        var request = {};
        request["rut"] = $('#bureau_rut').val();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/analysis/" + $('#organization').val() + "/bureau",
            data: JSON.stringify(request),
            dataType: 'json',
            cache: false,
            timeout: 60000,
            success: function (data, textStatus, jqXHR) {
                KTApp.unprogress(btn);
                var response = JSON.parse(jqXHR.responseText);
                var node = response.artemisa_response.businessTree.values[0];
                var listNode = response.artemisa_response.businessTree.listNames;
                var ratio1 = response.artemisa_response.riskRatios.values[0];
                var ratio2 = response.artemisa_response.riskRatios.values[1];
                var ratio3 = response.artemisa_response.riskRatios.values[2];
                var ratio4 = response.artemisa_response.riskRatios.values[3];
                var score = response.artemisa_response.riskScore.values;
                handlePulsate(node["label"], node["color"]);
                handleRatios(1, ratio1["titule"], ratio1["expression"], ratio1["result"], ratio1["postResult"], ratio1["color"]);
                handleRatios(2, ratio2["titule"], ratio2["expression"], ratio2["result"], ratio2["postResult"], ratio2["color"]);
                handleRatios(3, ratio3["titule"], ratio3["expression"], ratio3["result"], ratio3["postResult"], ratio3["color"]);
                handleRatios(4, ratio4["titule"], ratio4["expression"], ratio4["result"], ratio4["postResult"], ratio4["color"]);
                // handleNeuro(listNode);
                var ranges = [];
                for (var i = 0; i < score.ranges.length; i++) {
                    var range = score.ranges[i];
                    ranges.push([parseInt(range.upperLimit) / score.ranges[score.ranges.length - 1].upperLimit, range.color]);
                }
                handleScore(score.score, ranges, score.ranges[0].lowerLimit, score.ranges[score.ranges.length - 1].upperLimit, response.artemisa_response.riskScore.configuration.titule);
                $("#row_dashboard_analysis").removeAttr('hidden');
                $("#row_analysis").attr('hidden', 'hidden');
                $('#bureau_rut').val('');
                $('#bureau_rut').change();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                KTApp.unprogress(btn);
                Swal.fire({
                    "title": "",
                    "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });

            }
        });
    }
    return {
        // Init demos
        init: function () {
            formElExcel = $('#kt_form_excel');
            formElBureau = $('#kt_form_bureau');
            initAnalysis();
            initAnalysisExcel();
            initAnalysisBureau();
        }
    };
}();

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Class initialization on page load
jQuery(document).ready(function () {
    AnalysisDashboard.init();
});

function handlePulsate(titule, color) {
    if (!jQuery().pulsate) {
        return;
    }
    $('#content_label_tree').html(titule);
    $('#content_label_tree').attr('style', 'color: ' + color);
    if (jQuery().pulsate) {
        $('#output_tree').pulsate({
            color: color,
            speed: 600
        });
    }
};

function handleScore(value, ranges, min, max, title) {
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
                name: 'Score',
                data: [value],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                        '<span style="font-size:12px;color:silver"></span></div>'
                },
                tooltip: {
                    enabled: false
                }
            }]
        }));
}

function handleNeuro(list) {
    var firstname = list[0][0];

    Highcharts.addEvent(
        Highcharts.seriesTypes.networkgraph,
        'afterSetOptions',
        function (e) {
            var colors = Highcharts.getOptions().colors,
                i = 25,
                flag = false,
                nodes = {};
            e.options.data.forEach(function (link) {

                if (link[0] === firstname) {
                    nodes[firstname] = {
                        id: firstname,
                        marker: {
                            radius: i
                        },
                        color: colors[7]
                    };
                    i = 20;
                }
                if (!flag) {
                    flag = true;
                    nodes[link[1]] = {
                        id: link[1],
                        marker: {
                            radius: i
                        },
                        color: colors[5]
                    };
                } else {
                    flag = false;
                    nodes[link[1]] = {
                        id: link[1],
                        marker: {
                            radius: i
                        },
                        color: colors[9]
                    };
                    if (i > 10) {
                        i = i - 5;
                    }
                }

            });

            e.options.nodes = Object.keys(nodes).map(function (id) {
                return nodes[id];
            });
        }
    );


    Highcharts.chart('graphic_neuro', {
        chart: {
            type: 'networkgraph',
            height: '200px'

        },
        plotOptions: {
            networkgraph: {
                keys: ['from', 'to'],
                layoutAlgorithm: {
                    enableSimulation: true,
                    friction: -0.9
                }
            }
        },
        series: [{
            dataLabels: {
                enabled: true,
                linkFormat: ''
            },
            data: list
        }],
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: '',
            floating: true
        }
    });
}

function handleRatios(number, titule, operation, result, abrv, color) {
    $('#background_ratio' + number).attr('style', 'background-color: ' + color);
    $('#titule_ratio' + number).html(titule);
    $('#result_ratio' + number).html(ifIsFloatParsed(Number(result)) + (abrv.length > 0 ? (' ' + abrv) : ''));
    $('#operation_ratio' + number).html(operation);

};

function ifIsFloatParsed(n) {
    var num = Number(n);
    if (num == 'NaN') {
        return num;
    }
    if (Number(n) === n && n % 1 !== 0 && Number(n).toString().split(".")[1].length > 4) {
        return Number(Math.round(n + 'e4') + 'e-4');
    }
    return n;
}
