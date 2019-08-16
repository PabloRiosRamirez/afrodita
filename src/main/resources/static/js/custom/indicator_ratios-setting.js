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
        wizard = new KTWizard('kt_wizard_ratios', {
            startStep: 1,
        });

        // Validation before going to next page
        wizard.on('beforeNext', function (wizardObj) {
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar == '.')
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val().substring(0, $('.expression_ratio:not(:hidden)').val().length - 1));
            if (validator.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            } else {
                if (wizardObj.currentStep == 4) {
                    $($('.kt-form__actions').get(0)).attr('hidden', 'hidden');
                    $('#content_background_ratio1').attr('style', "background-color: " + $('#ratio1_color').val().trim());
                    $('#content_background_ratio2').attr('style', "background-color: " + $('#ratio2_color').val().trim());
                    $('#content_background_ratio3').attr('style', "background-color: " + $('#ratio3_color').val().trim());
                    $('#content_background_ratio4').attr('style', "background-color: " + $('#ratio4_color').val().trim());
                    $('#content_titule_ratio1').html($('#ratio1_titule').val().trim());
                    $('#content_titule_ratio2').html($('#ratio2_titule').val().trim());
                    $('#content_titule_ratio3').html($('#ratio3_titule').val().trim());
                    $('#content_titule_ratio4').html($('#ratio4_titule').val().trim());
                    $('#content_operation_ratio1').html($('#ratio1_expression').val().trim());
                    $('#content_operation_ratio2').html($('#ratio2_expression').val().trim());
                    $('#content_operation_ratio3').html($('#ratio3_expression').val().trim());
                    $('#content_operation_ratio4').html($('#ratio4_expression').val().trim());
                    setInterval(function () {
                        $('#content_result_ratio1').html((Math.floor(Math.random() * 100000.234) + 1000) + ' ' + $('#ratio1_fix').val().trim());
                        $('#content_result_ratio2').html((Math.round(Math.random() * 100000.234) + 1000) + ' ' + $('#ratio2_fix').val().trim());
                        $('#content_result_ratio3').html((Math.round(Math.random() * 100000.234) + 1000) + ' ' + $('#ratio3_fix').val().trim());
                        $('#content_result_ratio4').html((Math.round(Math.random() * 100000.234) + 1000) + ' ' + $('#ratio4_fix').val().trim());
                    }, 2000);

                }
            }
        });
        wizard.on('beforePrev', function (wizardObj) {
            $($('.kt-form__actions').get(0)).removeAttr('hidden');
        });

        // Change event
        wizard.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function () {
        $.validator.addMethod('sintaxisMath', function (value, element, param) {
            //Your Validation Here
            var expressionMock = value.replace(/({.*?})/g, Math.floor(Math.random() * 50) + 50);
            var checkExpression;
            try {
                checkExpression = eval(expressionMock);
            } catch (e) {
                checkExpression = undefined;
            }
            return checkExpression != undefined;
        }, 'Problemas de sintaxis en la operación matemática, por favor revisar');
        validator = formEl.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                //= Step 1
                ratio1_titule: {
                    required: true
                },
                ratio1_fix: {
                    required: true
                },
                ratio1_color: {
                    required: true
                },
                ratio1_expression: {
                    required: true,
                    sintaxisMath: true
                },
                ratio2_titule: {
                    required: true
                },
                ratio2_fix: {
                    required: true
                },
                ratio2_color: {
                    required: true
                },
                ratio2_expression: {
                    required: true,
                    sintaxisMath: true
                },
                ratio3_titule: {
                    required: true
                },
                ratio3_fix: {
                    required: true
                },
                ratio3_color: {
                    required: true
                },
                ratio3_expression: {
                    required: true,
                    sintaxisMath: true
                },
                ratio4_titule: {
                    required: true
                },
                ratio4_fix: {
                    required: true
                },
                ratio4_color: {
                    required: true
                },
                ratio4_expression: {
                    required: true,
                    sintaxisMath: true
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
                text: "Si guarda esto, si es que existe una configuración anterior de Risk Ratios está se borrará para siempre.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                        if (result.value) {
                            if (validator.form()) {
                                KTApp.progress(btn);
                                var riskRatio = {};
                                riskRatio['organization'] = $('#organization').val();
                                var ratios = [];
                                for (var i = 1; i < 5; i++) {
                                    var ratio = {};
                                    ratio["color"] = $('#ratio' + i + '_color').val().trim()
                                    ratio["titule"] = $('#ratio' + i + '_titule').val().trim()
                                    ratio["fix"] = $('#ratio' + i + '_fix').val().trim()
                                    ratio["expression"] = $('#ratio' + i + '_expression').val().trim()
                                    ratios.push(ratio);
                                }
                                riskRatio['ratios'] = ratios;
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/json",
                                    url: "/v1/rest/ratios",
                                    data: JSON.stringify(riskRatio),
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data, textStatus, jqXHR) {
                                        Swal.fire({
                                            title: "",
                                            text: "La configuración de Risk Ratios ha sido guardado correctamente!",
                                            type: "success",
                                            onClose: function () {
                                                window.location = "/ratios"
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

    var initCalculator = function () {
        $('.num-calculate').on('click', function () {
            var value = $(this).text().trim();
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 2, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar == ' 0' || ($('.expression_ratio:not(:hidden)').val().length == 1 && $('.expression_ratio:not(:hidden)').val() == '0')) {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val().substring(0, $('.expression_ratio:not(:hidden)').val().length - 1) + value);
            } else if (lastChar.charAt(1) == '}') {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '*' + value);
            } else {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + value);
            }
        });
        $('.zero-calculate').on('click', function () {
            var value = $(this).text().trim();
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 2, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar != ' 0' && $('.expression_ratio:not(:hidden)').val().trim().length != 1) {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + value);
            }
        });
        $('.parentesis-calculate').on('click', function () {
            var value = $(this).text().trim();
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar != '(' && lastChar != '.') {
                if ((lastChar == '}' || !isNaN(lastChar))
                    && (value == '(' && $('.expression_ratio:not(:hidden)').val().length > 0))
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '*' + value);
                else if (isSimbol(lastChar) && value == ')')
                    return;
                else
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + value);
            }
        });
        $('.point-calculate').on('click', function () {
            var value = $(this).text().trim();
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            var prelastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 2, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar != '.' && prelastChar != '0.' && lastChar != '}') {
                if (lastChar == '(') {
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '0.');
                    return;
                }
                if (isSimbol(lastChar) || $('.expression_ratio:not(:hidden)').val().length == 0)
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '0.');
                else
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + value);
            }
        });
        $('.simbol-calculate').on('click', function () {
            var value = $(this).text().trim();

            if ((value == '*' || value == 'x' || value == '/' || value == '+') && $('.expression_ratio:not(:hidden)').val().length == 0)
                return;
            if (value == 'x')
                value = '*'
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            var prelastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 2, $('.expression_ratio:not(:hidden)').val().length);
            if ((value == '*' || value == 'x' || value == '/' || value == '+') && prelastChar.charAt(0) == '(')
                return;
            if (lastChar == '(' && value != '-')
                return;
            if (prelastChar.charAt(1) == '.')
                return;
            else if (isSimbol(lastChar)) {
                if ($('.expression_ratio:not(:hidden)').val().length > 1)
                    $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val().substring(0, $('.expression_ratio:not(:hidden)').val().length - 1) + value);
            } else {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + value);
            }
        });
        $('.clear-calculate').on('mousedown', function () {
            // Get Array Variables
            // $('.expression_ratio:not(:hidden)').val().match(/({.*?})/g)

            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar == '}') {
                var value = $('.expression_ratio:not(:hidden)').val();
                var pointLastVariable;
                for (var i = 0; i < $('.expression_ratio:not(:hidden)').val().length; i++) {
                    if (value.charAt(i) == '{') {
                        pointLastVariable = i;
                    }
                }
                $('.expression_ratio:not(:hidden)').val(value.substring(0, pointLastVariable));
                return;
            }


            $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val().substring(0, $('.expression_ratio:not(:hidden)').val().length - 1));
        });
        $('.btn-variable-calculate').on('click', function () {
            var value = $('.variable_calculate:not(:hidden)').val().trim();
            var lastChar = $('.expression_ratio:not(:hidden)').val().substring($('.expression_ratio:not(:hidden)').val().length - 1, $('.expression_ratio:not(:hidden)').val().length);
            if (lastChar == '}' || lastChar == ')' || (lastChar != '' && !isNaN(lastChar))) {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '*{' + value + '}');
                return;
            }
            if (lastChar != '.') {
                $('.expression_ratio:not(:hidden)').val($('.expression_ratio:not(:hidden)').val() + '{' + value + '}');
            }
        });

    }

    return {
        // public functions
        init: function () {
            wizardEl = KTUtil.get('kt_wizard_ratios');
            formEl = $('#kt_form_ratios');
            initWizard();
            initValidation();
            initSubmit();
            initCalculator();
        }
    };
}();

function isNumeric(num) {
    return Number(num) != 'NaN';
}

function isSimbol(num) {
    return num == '+' || num == '-' || num == 'x' || num == '/' || num == '*';
}


jQuery(document).ready(function () {
    KTWizard3.init();
});