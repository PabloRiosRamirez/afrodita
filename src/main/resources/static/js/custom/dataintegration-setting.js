// Class definition
var KTWizard3 = function () {
    // Base elements
    var wizardElExcel;
    var formElExcel;
    var wizardElBureau;
    var formElBureau;
    var validatorExcel;
    var wizardExcel;
    var validatorBureau;
    var wizardBureau;

    // Private functions
    var initWizardExcel = function () {
        // Initialize form wizard
        wizardExcel = new KTWizard('wizard_excel', {
            startStep: 1,
        });

        // Validation before going to next page
        wizardExcel.on('beforeNext', function (wizardObj) {
            if (validatorExcel.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            }
            $('.back-dataintegration').attr('hidden', 'hidden');

            $('#content_file_name').text($('.custom-file-label').html());

            var templateVariables = "";
            var length = $('input[name*="[default_value_variable]"]').length;
            for (var i = 0; i < length; i++) {
                templateVariables = templateVariables.concat("<div class=\"form-group row\">");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Nombre:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>" + $('input[name*="[name_variable]"]')[i].value + "</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Tipo:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>" + $('select[name*="[type_variable]"]')[i].value + "</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Coordenadas:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>" + $('input[name*="[coordinate_variable]"]')[i].value + "</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Valor por defecto:</label><label class=\"col-xl-3 col-lg-3 col-form-label text-info\"><strong>" + $('input[name*="[default_value_variable]"]')[i].value + "</strong></label>");
                templateVariables = templateVariables.concat("</div>");
            }
            $('#content_details_variables').html(templateVariables);

        })
        wizardExcel.on('beforePrev', function (wizardObj) {
            if (wizardObj.currentStep == 2) {
                $('.back-dataintegration').removeAttr('hidden');
            }
        });

        // Change event
        wizardExcel.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }
    var initWizardBureau = function () {
        // Initialize form wizard
        wizardBureau = new KTWizard('wizard_bureau', {
            startStep: 1,
        });

        // Validation before going to next page
        wizardBureau.on('beforeNext', function (wizardObj) {
            if (validatorBureau.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            }
            $('.back-dataintegration').attr('hidden', 'hidden');
            if ($('[type="checkbox"]:checked').length <= 1) {
                Swal.fire({
                    "title": "",
                    "text": "Como minino debe seleccionar dos variables!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
                wizardObj.stop();
            } else if ($('[type="checkbox"]:checked').length > 35) {
                Swal.fire({
                    "title": "",
                    "text": "Como máximo puede seleccionar 35 variables!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
                wizardObj.stop();
            } else {
                var length = $('input[type="checkbox"]:checked').length
                for (var i = 0; i < length; i++) {
                    $('#group_details_variable_' + $('input[type="checkbox"]:checked')[i].value).removeAttr('hidden');
                }
            }
        })
        wizardBureau.on('beforePrev', function (wizardObj) {
            if (wizardObj.currentStep == 2) {
                $('.back-dataintegration').removeAttr('hidden');
            }
            var length = $('input[type="checkbox"]:checked').length
            for (var i = 0; i < length; i++) {
                $('#group_details_variable_' + $('input[type="checkbox"]:checked')[i].value).attr('hidden', 'hidden');
            }
        })

        // Change event
        wizardBureau.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidationExcel = function () {
        $.validator.addMethod('cellExcel', function (value, element, param) {
            //Your Validation Here
            return /^[A-Z]+[0-9]+$/.test(value);
        }, 'Formato para celda de excel no valido, debe ingresar una letra junto con el número de celda. Ejemplo: A12');
        validatorExcel = formElExcel.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                //= Step 1
                file_dataintegration: {
                    required: true,
                    extension: "xls|xlsx"
                },

                //= Step 2
                '[0][name_variable]': {
                    required: true
                },
                '[0][type_variable]': {
                    required: true
                },
                '[0][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[0][default_value_variable]': {
                    required: true
                },

                '[1][name_variable]': {
                    required: true
                },
                '[1][type_variable]': {
                    required: true
                },
                '[1][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[1][default_value_variable]': {
                    required: true
                },
                '[2][name_variable]': {
                    required: true
                },
                '[2][type_variable]': {
                    required: true
                },
                '[2][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[2][default_value_variable]': {
                    required: true
                },
                '[3][name_variable]': {
                    required: true
                },
                '[3][type_variable]': {
                    required: true
                },
                '[3][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[3][default_value_variable]': {
                    required: true
                },

                '[4][name_variable]': {
                    required: true
                },
                '[4][type_variable]': {
                    required: true
                },
                '[4][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[4][default_value_variable]': {
                    required: true
                },

                '[5][name_variable]': {
                    required: true
                },
                '[5][type_variable]': {
                    required: true
                },
                '[5][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[5][default_value_variable]': {
                    required: true
                },

                '[6][name_variable]': {
                    required: true
                },
                '[6][type_variable]': {
                    required: true
                },
                '[6][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[6][default_value_variable]': {
                    required: true
                },

                '[7][name_variable]': {
                    required: true
                },
                '[7][type_variable]': {
                    required: true
                },
                '[7][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[7][default_value_variable]': {
                    required: true
                },

                '[8][name_variable]': {
                    required: true
                },
                '[8][type_variable]': {
                    required: true
                },
                '[8][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[8][default_value_variable]': {
                    required: true
                },

                '[9][name_variable]': {
                    required: true
                },
                '[9][type_variable]': {
                    required: true
                },
                '[9][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[9][default_value_variable]': {
                    required: true
                },
                '[10][name_variable]': {
                    required: true
                },
                '[10][type_variable]': {
                    required: true
                },
                '[10][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[10][default_value_variable]': {
                    required: true
                },

                '[11][name_variable]': {
                    required: true
                },
                '[11][type_variable]': {
                    required: true
                },
                '[11][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[11][default_value_variable]': {
                    required: true
                },
                '[12][name_variable]': {
                    required: true
                },
                '[12][type_variable]': {
                    required: true
                },
                '[12][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[12][default_value_variable]': {
                    required: true
                },
                '[13][name_variable]': {
                    required: true
                },
                '[13][type_variable]': {
                    required: true
                },
                '[13][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[13][default_value_variable]': {
                    required: true
                },

                '[14][name_variable]': {
                    required: true
                },
                '[14][type_variable]': {
                    required: true
                },
                '[14][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[14][default_value_variable]': {
                    required: true
                },

                '[15][name_variable]': {
                    required: true
                },
                '[15][type_variable]': {
                    required: true
                },
                '[15][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[15][default_value_variable]': {
                    required: true
                },

                '[16][name_variable]': {
                    required: true
                },
                '[16][type_variable]': {
                    required: true
                },
                '[16][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[16][default_value_variable]': {
                    required: true
                },

                '[17][name_variable]': {
                    required: true
                },
                '[17][type_variable]': {
                    required: true
                },
                '[17][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[17][default_value_variable]': {
                    required: true
                },

                '[18][name_variable]': {
                    required: true
                },
                '[18][type_variable]': {
                    required: true
                },
                '[18][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[18][default_value_variable]': {
                    required: true
                },

                '[19][name_variable]': {
                    required: true
                },
                '[19][type_variable]': {
                    required: true
                },
                '[19][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[19][default_value_variable]': {
                    required: true
                },

                '[20][name_variable]': {
                    required: true
                },
                '[20][type_variable]': {
                    required: true
                },
                '[20][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[20][default_value_variable]': {
                    required: true
                },

                '[21][name_variable]': {
                    required: true
                },
                '[21][type_variable]': {
                    required: true
                },
                '[21][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[21][default_value_variable]': {
                    required: true
                },
                '[22][name_variable]': {
                    required: true
                },
                '[22][type_variable]': {
                    required: true
                },
                '[22][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[22][default_value_variable]': {
                    required: true
                },
                '[23][name_variable]': {
                    required: true
                },
                '[23][type_variable]': {
                    required: true
                },
                '[23][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[23][default_value_variable]': {
                    required: true
                },

                '[24][name_variable]': {
                    required: true
                },
                '[24][type_variable]': {
                    required: true
                },
                '[24][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[24][default_value_variable]': {
                    required: true
                },

                '[25][name_variable]': {
                    required: true
                },
                '[25][type_variable]': {
                    required: true
                },
                '[25][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[25][default_value_variable]': {
                    required: true
                },

                '[26][name_variable]': {
                    required: true
                },
                '[26][type_variable]': {
                    required: true
                },
                '[26][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[26][default_value_variable]': {
                    required: true
                },

                '[27][name_variable]': {
                    required: true
                },
                '[27][type_variable]': {
                    required: true
                },
                '[27][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[27][default_value_variable]': {
                    required: true
                },

                '[28][name_variable]': {
                    required: true
                },
                '[28][type_variable]': {
                    required: true
                },
                '[28][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[28][default_value_variable]': {
                    required: true
                },

                '[29][name_variable]': {
                    required: true
                },
                '[29][type_variable]': {
                    required: true
                },
                '[29][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[29][default_value_variable]': {
                    required: true
                },


                '[30][name_variable]': {
                    required: true
                },
                '[30][type_variable]': {
                    required: true
                },
                '[30][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[30][default_value_variable]': {
                    required: true
                },

                '[31][name_variable]': {
                    required: true
                },
                '[31][type_variable]': {
                    required: true
                },
                '[31][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[31][default_value_variable]': {
                    required: true
                },
                '[32][name_variable]': {
                    required: true
                },
                '[32][type_variable]': {
                    required: true
                },
                '[32][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[32][default_value_variable]': {
                    required: true
                },
                '[33][name_variable]': {
                    required: true
                },
                '[33][type_variable]': {
                    required: true
                },
                '[33][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[33][default_value_variable]': {
                    required: true
                },

                '[34][name_variable]': {
                    required: true
                },
                '[34][type_variable]': {
                    required: true
                },
                '[34][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[34][default_value_variable]': {
                    required: true
                },

                '[35][name_variable]': {
                    required: true
                },
                '[35][type_variable]': {
                    required: true
                },
                '[35][coordinate_variable]': {
                    required: true,
                    cellExcel: true
                },
                '[35][default_value_variable]': {
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
                if (wizardObj.currentStep == 2) {
                    $('.back-dataintegration').removeAttr('hidden');
                }
                if (wizardObj.currentStep == 1) {
                    $('.back-dataintegration').attr('hidden', 'hidden');
                }
            },

            // Submit valid form
            submitHandler: function (form) {

            }
        });


    }

    var initValidationBureau = function () {
        validatorBureau = formElBureau.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                //= Step 1
                /* bureau_user: {
                     required: true
                 },
                 bureau_pass: {
                     required: true
                 }*/
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
                if (wizardObj.currentStep == 2) {
                    $('.back-dataintegration').removeAttr('hidden');
                }
                if (wizardObj.currentStep == 1) {
                    $('.back-dataintegration').attr('hidden', 'hidden');
                }
            },

            // Submit valid form
            submitHandler: function (form) {
            }
        });
    }

    var initSubmitExcel = function () {
        var btn = formElExcel.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function (e) {
            Swal.fire({
                title: '¿Está seguro de guardar esta configuración?',
                text: "Si guarda esto, se borrará toda configuración anterior de Data Integration además de los indicadores Risk Score, Risk Ratios y Business Tree.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                    if (result.value) {
                        if (validatorExcel.form()) {
                            KTApp.progress(btn);
                            var dataIntegration = {};
                            dataIntegration["organization"] = $('#organization').val();
                            var list_variable = [];
                            var length = $('input[name*="[default_value_variable]"]').length;
                            for (var i = 0; i < length; i++) {
                                var variable = {};
                                variable["name"] = $('input[name*="[name_variable]"]')[i].value;
                                variable["type"] = $('select[name*="[type_variable]"]')[i].value;
                                variable["coordinate"] = $('input[name*="[coordinate_variable]"]')[i].value;
                                variable["defaultValue"] = $('input[name*="[default_value_variable]"]')[i].value;
                                list_variable.push(variable);
                            }
                            dataIntegration["variables"] = list_variable;
                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: "/v1/rest/dataintegration/excel",
                                data: JSON.stringify(dataIntegration),
                                dataType: 'json',
                                cache: false,
                                timeout: 60000,
                                success: function (data, textStatus, jqXHR) {
                                    var files = document.querySelector("#file_dataintegration").files;
                                    var formData = new FormData();
                                    formData.append("file", files[0]);
                                    var xhr = new XMLHttpRequest();
                                    xhr.open("PUT", "/v1/rest/dataintegration/" + data.current_response.idDataintegration + "/excel");
                                    xhr.onload = function () {
                                        KTApp.unprogress(btn);
                                        if (xhr.status == 200) {
                                            Swal.fire({
                                                title: "",
                                                text: "La configuración de Data Integration ha sido guardado correctamente!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/dataintegration"
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                "title": "",
                                                "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                                                "type": "error",
                                                "confirmButtonClass": "btn btn-secondary"
                                            });
                                        }
                                    }
                                    xhr.send(formData);
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
                });
        });
    }

    var initSubmitBureau = function () {
        var btn = formElBureau.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function (e) {
            Swal.fire({
                title: '¿Está seguro de guardar esta configuración?',
                text: "Si guarda esto, se borrará toda configuración anterior de Data Integration además de los indicadores Risk Score, Risk Ratios y Business Tree.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                    if (result.value) {
                        if (validatorBureau.form()) {
                            KTApp.progress(btn);
                            //KTApp.block(formEl);

                            var dataIntegration = {};
                            dataIntegration["organization"] = $('#organization').val();
                            var list_variable = [];
                            var length = $('input[type="checkbox"]:checked').length
                            for (var i = 0; i < length; i++) {
                                var variable = {};
                                variable["idVariable"] = $('input[type="checkbox"]:checked')[i].value;
                                list_variable.push(variable);
                            }
                            dataIntegration["variables"] = list_variable;

                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: "/v1/rest/dataintegration/bureau",
                                data: JSON.stringify(dataIntegration),
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
                });
        });
    }

    return {
        // public functions
        init: function () {
            wizardElExcel = KTUtil.get('wizard_excel');
            formElExcel = $('#kt_form_excel');
            initWizardExcel();
            initValidationExcel();
            initSubmitExcel();
            onChangeType();
        },
        // public functions
        init2: function () {
            wizardElBureau = KTUtil.get('wizard_bureau');
            formElBureau = $('#kt_form_bureau');
            initWizardBureau();
            initValidationBureau();
            initSubmitBureau();
        }
    };
}();

jQuery(document).ready(function () {
    KTWizard3.init();
    KTWizard3.init2();

    $('.custom-select').on('change', function (e) {
        KTWizard3.init();
        KTWizard3.init2();
        $($($(this).parent().parent()[0]).children()[3]).children('input').removeClass('is-invalid').val('');
    });

    $('.back-dataintegration').on('click', function (e) {
        $('#first_dataintegration').removeAttr('hidden');
        $('#row_wizard_excel').attr('hidden', 'hidden');
        $('#row_wizard_bureau').attr('hidden', 'hidden');
        $('form').trigger("reset");
    });

    $('#btn-type-dataintegration').on('click', function (e) {
        var checked = $('input[name=option_type_dataintegration]:checked').val();
        $('#first_dataintegration').attr('hidden', 'hidden');
        if (checked == '0') {
            $('#row_wizard_excel').removeAttr('hidden');
            $('#row_wizard_bureau').attr('hidden', 'hidden');
        } else {
            $('#row_wizard_excel').attr('hidden', 'hidden');
            $('#row_wizard_bureau').removeAttr('hidden');
        }
        $('form').trigger("reset");
        $('input').removeClass('is-invalid');
    });
    onChangeType();
    onClickBtnCreateVariable();
});

function onChangeType() {
    $('[name*="[type_variable]"]').on('change', function () {
        if ($(this).val() == 'NE') {
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').rules("add", {
                number: false,
                digits: true,
                messages: {
                    required: "Este campo debe ser números entero."
                }
            });
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').val('');
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').attr('type', 'number');
        } else {
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').rules("add", {
                number: true,
                digits: false,
                messages: {
                    required: "Este campo debe ser números decimal."
                }
            });
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').val('');
            $('[name="' + $(this).attr('name').replace('[type_variable]', '') + '[default_value_variable]"').attr('type', 'number');
        }
    });
}

function onClickBtnCreateVariable() {
    $('[data-repeater-create]').on('click', function () {
        onClickBtnDeleteVariable();
        if ($('[data-repeater-delete]').length >= 34) {
            $(this).attr('hidden', 'hidden');
        }
        onChangeType();
    });
}

function onClickBtnDeleteVariable() {
    $('[data-repeater-delete]').on('click', function () {
        if ($('[data-repeater-delete]').length < 34) {
            $('[data-repeater-create]').removeAttr('hidden');
        }
        onChangeType();
    });
}


var KTFormRepeater = function () {
    var repeaterBureau = function () {
        $('#kt_repeater_bureau').repeater({
            initEmpty: false,

            defaultValues: {
                'text-input': 'foo'
            },

            show: function () {
                $(this).slideDown();
            },

            hide: function (deleteElement) {
                $(this).slideUp(deleteElement);
            }
        });
    }
    return {
        init: function () {
            repeaterBureau();
        }
    };
}();

jQuery(document).ready(function () {
    KTFormRepeater.init();
});