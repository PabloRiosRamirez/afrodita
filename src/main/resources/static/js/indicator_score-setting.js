function resetRanges(i, length) {
    for (; i < length; i++) {
        $($("input[name*='[lim_score_down]']")[i]).val('');
        $($("input[name*='[lim_score_up]']")[i]).val('');
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
        var i = $(this).attr('name').replace('][lim_score_down]', '').replace('][lim_score_up]', '').replace('[', '');
        // if ($($("input[name*='[lim_score_up]']")[i]).attr('name') != $(this).attr('name')) {
        //     $($("input[name*='[lim_score_up]']")[i]).val('');
        // }
        resetRanges(++i, $("input[name*='[lim_score_down]']").length);
        errorInRange(--i);
    });
}

function disabledDownRange() {
    $("input[name*='[lim_score_down]']").attr('disabled', true);
    $("input[name='[0][lim_score_down]']").removeAttr('disabled');
    var length = $("input[name*='[lim_score_down]']").length;
    for (var i = 1; i < length; i++) {
        if ($($("input[name*='[lim_score_up]']")[i - 1]).val() != undefined && $($("input[name*='[lim_score_up]']")[i - 1]).val().trim().length > 0) {
            $($("input[name*='[lim_score_down]']")[i]).val(parseInt($($("input[name*='[lim_score_up]']")[i - 1]).val()) + 1);
        }
    }
}

function errorInRange(i) {
    if (parseInt($($("[name*='[lim_score_up]']")[i]).val()) <= parseInt($($("[name*='[lim_score_down]']")[i]).val())) {
        $($("[name*='[lim_score_up]']")[i]).val(parseInt($($("[name*='[lim_score_down]']")[i]).val()) + 1);
        $($("[name*='[lim_score_down]']")[i + 1]).val(parseInt($($("[name*='[lim_score_up]']")[i]).val()) + 1);
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
                '[0][lim_score_down]': {
                    required: true,
                    digits: true
                },
                '[0][lim_score_up]': {
                    required: true,
                    digits: true
                },
                '[0][score_range_color]': {
                    required: true
                },
                '[1][lim_score_down]': {
                    required: true,
                    digits: true
                },
                '[1][lim_score_up]': {
                    required: true,
                    digits: true
                },
                '[1][score_range_color]': {
                    required: true
                },
                '[2][lim_score_down]': {
                    required: true,
                    digits: true
                },
                '[2][lim_score_up]': {
                    digits: true,
                    required: true
                },
                '[2][score_range_color]': {
                    required: true
                },
                '[3][lim_score_down]': {
                    required: true,
                    digits: true
                },
                '[3][lim_score_up]': {
                    required: true,
                    digits: true
                },
                '[3][score_range_color]': {
                    required: true
                },
                '[4][lim_score_down]': {
                    required: true,
                    digits: true
                },
                '[4][lim_score_up]': {
                    required: true,
                    digits: true
                },
                '[4][score_range_color]': {
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
                                score['titulo'] = $('#score_titule').val();
                                score['variable'] = $('#score_variable').val();
                                score['organization'] = $('#organization').val();
                                var cant = $('[name*="[lim_score_down]"]').length;
                                var listRanges = [];
                                for (var i = 0; i < cant; i++) {
                                    var range = {};
                                    range['limitDown'] = $($('[name*="[lim_score_down]"]')[i]).val();
                                    range['limitUp'] = $($('[name*="[lim_score_up]"]')[i]).val();
                                    range['color'] = $($('[name*="[score_range_color]"]')[i]).val();
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
                                                window.location = "/score"
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
        var cant = $('[name*="[lim_score_down]"]').length;
        var template = "";
        for (var i = 0; i < cant; i++) {
            template = template += "<div class=\"form-group row\"><label class=\"col-xl-3 col-lg-3 col-form-label\">Rango:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>"
            template = template += $($('[name*="[lim_score_down]"]')[i]).val() + " a " + $($('[name*="[lim_score_up]"]')[i]).val();
            template = template += "</strong></label><label class=\"col-xl-3 col-lg-3 col-form-label\">Color:</label><div class=\"col-lg-3 col-xl-3\"><input class=\"form-control\" disabled type=\"color\" value=\"";
            template = template += $($('[name*="[score_range_color]"]')[i]).val() + "\"></div></div></div>";
        }
        $('#content_ranges').html(template);

    });
}

/*function resumenGraphic() {

    var ranges = [];

    var cant = $('[name*="[lim_score_down]"]').length;
    var sizeGraphic = parseInt($($('[name*="[lim_score_down]"]')[cant - 1]).val()) - parseInt($($('[name*="[lim_score_down]"]')[0]).val());

    $($('[name*="[lim_score_up]"]')[i]).val();
    for (var i = 0; i < cant; i++) {
        ranges.push([parseInt($($('[name*="[lim_score_up]"]')[i]).val()) / sizeGraphic, $($('[name*="[score_range_color]"]')[i]).val()]);
    }

// The speed gauge
    var chartSpeed = Highcharts.chart('container-graphic_score', Highcharts.merge(
        {

            chart: {
                type: 'solidgauge'
            },

            title: null,

            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
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
                tickAmount: 2,
                title: {
                    y: -70
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
            min: parseInt($($('[name*="[lim_score_down]"]')[0]).val()),
            max: parseInt($($('[name*="[lim_score_down]"]')[cant - 1]).val()),
            title: {
                text: $('[name=score_titule]').val()
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Score',
            data: [sizeGraphic],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver"></span></div>'
            },
            tooltip: {
                valueSuffix: ''
            }
        }]

    }));

// Bring life to the dials
    setInterval(function () {
        // Speed
        var point,
            newVal,
            inc;

        if (chartSpeed) {
            point = chartSpeed.series[0].points[0];
            inc = Math.round((Math.random() - 0.5) * sizeGraphic);
            newVal = point.y + inc;

            if (newVal < 0 || newVal > sizeGraphic) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }
    }, 2000);
}*/

jQuery(document).ready(function () {
    onClickDeletedRange();
    disabledDownRange();
    changeRanges();
    onClickBtnCreateRange();
    onClickBtnDeleteRange();
    KTWizard3.init();
    resumen();
});