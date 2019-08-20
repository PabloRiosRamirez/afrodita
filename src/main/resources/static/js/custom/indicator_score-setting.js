function resetRanges(i, length) {
    for (; i < length; i++) {
        $($("input[name*='[lowerLimit]']")[i]).val('');
        $($("input[name*='[upperLimit]']")[i]).val('');
    }
    disabledDownRange();
}


function onClickBtnCreateRange() {
    $('[data-repeater-create]').on('click', function () {
        onClickDeletedRange();
        if ($('[data-repeater-delete]').length >= 4) {
            $(this).attr('hidden', 'hidden');
        }
        disabledDownRange();
        changeRanges();
    });
}

function onClickBtnDeleteRange() {
    $('[data-repeater-delete]').on('click', function () {
        if ($('[data-repeater-delete]').length < 4) {
            $(this).removeAttr('hidden');
        }
        disabledDownRange();
        changeRanges();
    });
}

function onClickDeletedRange() {
    $('[data-repeater-delete]').on('click', function () {
        var deletes = $('[data-repeater-delete]');
        var i = $(this).attr('name').replace('][btn-delete]', '').replace('[', '');
        var limites = $('.lim_score');
        resetRanges(i, limites.length);
        $('[data-repeater-create]').removeAttr('hidden');
        disabledDownRange();
    })
}

function changeRanges() {
    $('.lim_score').on('change', function () {
        var limites = $('.lim_score');
        var i = $(this).attr('name').replace('][lowerLimit]', '').replace('][upperLimit]', '').replace('[', '');
        // if ($($("input[name*='[upperLimit]']")[i]).attr('name') != $(this).attr('name')) {
        //     $($("input[name*='[upperLimit]']")[i]).val('');
        // }
        resetRanges(++i, $("input[name*='[lowerLimit]']").length);
        errorInRange(--i);
    });
}

function disabledDownRange() {
    $("input[name*='[lowerLimit]']").attr('disabled', true);
    $("input[name='[0][lowerLimit]']").removeAttr('disabled');
    var length = $("input[name*='[lowerLimit]']").length;
    for (var i = 1; i < length; i++) {
        if ($($("input[name*='[upperLimit]']")[i - 1]).val() != undefined && $($("input[name*='[upperLimit]']")[i - 1]).val().trim().length > 0) {
            $($("input[name*='[lowerLimit]']")[i]).val(parseInt($($("input[name*='[upperLimit]']")[i - 1]).val()) + 1);
        }
    }
}

function errorInRange(i) {
    if (parseInt($($("[name*='[upperLimit]']")[i]).val()) <= parseInt($($("[name*='[lowerLimit]']")[i]).val())) {
        $($("[name*='[upperLimit]']")[i]).val(parseInt($($("[name*='[lowerLimit]']")[i]).val()) + 1);
        $($("[name*='[lowerLimit]']")[i + 1]).val(parseInt($($("[name*='[upperLimit]']")[i]).val()) + 1);
    }
}

"use strict";

// Class definition
var KTWizard3 = function () {
    // Base elements
    var wizardEl;
    var formEl;
    var validator;
    var wizard;

    // Private functions
    var initWizard = function () {
        // Initialize form wizard
        wizard = new KTWizard('kt_wizard_score', {
            startStep: 1,
        });

        // Validation before going to next page
        wizard.on('beforeNext', function (wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            } else {
                if (wizardObj.currentStep == 2)
                    resumenGraphic();
            }
        })

        // Change event
        wizard.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function () {
        validator = formEl.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                //= Step 1
                score_titule: {
                    required: true
                },
                score_variable: {
                    required: true
                },

                //= Step 2
                '[0][lowerLimit]': {
                    required: true,
                    digits: true
                },
                '[0][upperLimit]': {
                    required: true,
                    digits: true
                },
                '[0][color]': {
                    required: true
                },
                '[1][lowerLimit]': {
                    required: true,
                    digits: true
                },
                '[1][upperLimit]': {
                    required: true,
                    digits: true
                },
                '[1][color]': {
                    required: true
                },
                '[2][lowerLimit]': {
                    required: true,
                    digits: true
                },
                '[2][upperLimit]': {
                    digits: true,
                    required: true
                },
                '[2][color]': {
                    required: true
                },
                '[3][lowerLimit]': {
                    required: true,
                    digits: true
                },
                '[3][upperLimit]': {
                    required: true,
                    digits: true
                },
                '[3][color]': {
                    required: true
                },
                '[4][lowerLimit]': {
                    required: true,
                    digits: true
                },
                '[4][upperLimit]': {
                    required: true,
                    digits: true
                },
                '[4][color]': {
                    required: true
                }
            },

            // Display error
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
                swal.fire({
                    "title": "",
                    "text": "Hay algunos errores por favor corríjalos.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            },

            // Submit valid form
            submitHandler: function (form) {

            }
        });
    }

    var initSubmit = function () {
        var btn = formEl.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function (e) {
            Swal.fire({
                title: '¿Está seguro de guardar esta configuración?',
                text: "Si guarda esto, si es que existe una configuración anterior de Risk Score está se borrará para siempre.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                        if (result.value) {
                            if (validator.form()) {
                                KTApp.progress(btn);
                                var score = {};
                                score['titule'] = $('#score_titule').val();
                                score['variable'] = $('#score_variable').val();
                                score['organization'] = $('#organization').val();
                                var cant = $('[name*="[lowerLimit]"]').length;
                                var listRanges = [];
                                for (var i = 0; i < cant; i++) {
                                    var range = {};
                                    range['lowerLimit'] = $($('[name*="[lowerLimit]"]')[i]).val();
                                    range['upperLimit'] = $($('[name*="[upperLimit]"]')[i]).val();
                                    range['color'] = $($('[name*="[color]"]')[i]).val();
                                    listRanges.push(range);
                                }
                                score['ranges'] = listRanges;
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/json",
                                    url: "/v1/rest/score",
                                    data: JSON.stringify(score),
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data, textStatus, jqXHR) {
                                        Swal.fire({
                                            title: "",
                                            text: "La configuración de Risk Score ha sido guardado correctamente!",
                                            type: "success",
                                            onClose: function () {
                                                window.location = "/indicators/riskscore"
                                            }
                                        });
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        KTApp.unprogress(btn);
                                        swal.fire({
                                            "title": "",
                                            "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });

                                    }
                                });

                            }
                        }
                    }
                );
        });
    }

    return {
        // public functions
        init: function () {
            wizardEl = KTUtil.get('kt_wizard_score');
            formEl = $('#kt_form');
            initWizard();
            initValidation();
            initSubmit();
        }
    };
}();

function resumen() {
    $('[data-ktwizard-type="action-next"]').on('click', function () {
        $('#content_titule').html($('[name=score_titule]').val());
        $('#content_variable').html($('option[value=' + $('[name="score_variable"]').val() + ']').text());
        var cant = $('[name*="[lowerLimit]"]').length;
        var template = "";
        for (var i = 0; i < cant; i++) {
            template = template += "<div class=\"form-group row\"><label class=\"col-xl-3 col-lg-3 col-form-label\">Rango:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>"
            template = template += $($('[name*="[lowerLimit]"]')[i]).val() + " a " + $($('[name*="[upperLimit]"]')[i]).val();
            template = template += "</strong></label><label class=\"col-xl-3 col-lg-3 col-form-label\">Color:</label><div class=\"col-lg-3 col-xl-3\"><input class=\"form-control\" disabled type=\"color\" value=\"";
            template = template += $($('[name*="[color]"]')[i]).val() + "\"></div></div></div>";
        }
        $('#content_ranges').html(template);

    });
}

var interval;
function resumenGraphic() {
    var titulo = $('#score_titule').val();
    var cant = $('[name*="[lowerLimit]"]').length;
    var ranges = [];
    for (var i = 0; i < cant; i++) {
        ranges.push([parseInt($($('[name*="[upperLimit]"]')[i]).val()) / parseInt($($('[name*="[upperLimit]"]')[cant - 1]).val()), $($('[name*="[color]"]')[i]).val()]);
    }
    handleScore(titulo, parseInt($($('[name*="[lowerLimit]"]')[0]).val()), parseInt($($('[name*="[upperLimit]"]')[cant - 1]).val()), ranges, Math.round(Math.random() * parseInt($($('[name*="[upperLimit]"]')[cant - 1]).val())));
    if (interval != undefined) {
        clearInterval(interval);
    }
    interval = setInterval(function () {
        var chart = $('#content_score_graphic').highcharts();
        if (typeof chart === 'undefined') {
            return;
        }
        var series = chart.series[0];
        series.setData([parseInt(Math.round(Math.random() * parseInt($($('[name*="[upperLimit]"]')[cant - 1]).val())))], false, undefined, true);
        chart.redraw();
    }, 2000);
}

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

jQuery(document).ready(function () {
    onClickDeletedRange();
    disabledDownRange();
    changeRanges();
    onClickBtnCreateRange();
    onClickBtnDeleteRange();
    KTWizard3.init();
    resumen();
});