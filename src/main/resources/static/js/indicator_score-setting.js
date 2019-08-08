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
        if ($($("input[name*='[lim_score_up]']")[i]).attr('name') != $(this).attr('name')) {
            $($("input[name*='[lim_score_up]']")[i]).val('');
        }
        resetRanges(++i, limites.length);
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
    if ($($("[name*='[lim_score_up]']")[i]).val() <= $($("[name*='[lim_score_down]']")[i]).val()) {
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
                    digits: true,
                    required: true
                },
                '[0][lim_score_up]': {
                    digits: true,
                    required: true
                },
                '[0][score_range_color]': {
                    required: true
                },
                '[1][lim_score_down]': {
                    digits: true,
                    required: true
                },
                '[1][lim_score_up]': {
                    digits: true,
                    required: true
                },
                '[1][score_range_color]': {
                    required: true
                },
                '[2][lim_score_down]': {
                    digits: true,
                    required: true
                },
                '[2][lim_score_up]': {
                    digits: true,
                    required: true
                },
                '[2][score_range_color]': {
                    required: true
                },
                '[3][lim_score_down]': {
                    digits: true,
                    required: true
                },
                '[3][lim_score_up]': {
                    digits: true,
                    required: true
                },
                '[3][score_range_color]': {
                    required: true
                },
                '[4][lim_score_down]': {
                    digits: true,
                    required: true
                },
                '[4][lim_score_up]': {
                    digits: true,
                    required: true
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
                text: "Si guarda esto, se borrará toda configuración anterior de Risk Score.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                        if (result.value) {
                            if (validatorExcel.form()) {
                                KTApp.progress(btn);
                                var score = {};
                                score['titulo'] = $('#score_titule').val();
                                score['variable'] = $('#score_variable').val();
                                var cant = $('[name*="[lim_score_down]"]').length;
                                var listRanges = [];
                                for (var i; i < cant; i++) {
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
                                            text: "La configuración de Data Integration ha sido guardado correctamente!",
                                            type: "success",
                                            onClose: function () {
                                                window.location = "/dataintegration"
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


        btn.on('click', function (e) {
            e.preventDefault();

            if (validator.form()) {
                // See: src\js\framework\base\app.js
                KTApp.progress(btn);
                //KTApp.block(formEl);

                // See: http://malsup.com/jquery/form/#ajaxSubmit
                formEl.ajaxSubmit({
                    success: function () {
                        KTApp.unprogress(btn);
                        //KTApp.unblock(formEl);

                        swal.fire({
                            "title": "",
                            "text": "The application has been successfully submitted!",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary"
                        });
                    }
                });
            }
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

jQuery(document).ready(function () {
    onClickDeletedRange();
    disabledDownRange();
    changeRanges();
    onClickBtnCreateRange();
    onClickBtnDeleteRange();
    KTWizard3.init();
    resumen();
});