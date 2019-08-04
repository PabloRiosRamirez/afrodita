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
            $('#content_file_name').append($('.custom-file-label').html());

            var templateVariables = "";
            var length = $('input[name*="[default_variable]"]').length;
            for (var i = 0; i < length; i++) {
                templateVariables = templateVariables.concat("<div class=\"form-group row\">");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Nombre:</label><label class=\"col-xl-3 col-lg-3 col-form-label\"><strong>" +$('input[name*="[name_variable]"]')[i].value +"</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Tipo:</label><label class=\"col-xl-3 col-lg-3 col-form-label\"><strong>" +$('select[name*="[type_variable]"]')[i].value +"</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Coordenas:</label><label class=\"col-xl-3 col-lg-3 col-form-label\"><strong>" +$('input[name*="[coordenate_variable]"]')[i].value +"</strong></label>");
                templateVariables = templateVariables.concat("<label class=\"col-xl-3 col-lg-3 col-form-label\">Valor por defecto:</label><label class=\"col-xl-3 col-lg-3 col-form-label\"><strong>" +$('input[name*="[default_variable]"]')[i].value +"</strong></label>");
                templateVariables = templateVariables.concat("</div>");
            }
            $('#content_details_variables').append(templateVariables);

        })

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
            var length = $('input[type="checkbox"]:checked').length
            for (var i = 0; i < length; i++) {
                $('#group_details_variable_'+ $('input[type="checkbox"]:checked')[i].value).removeAttr('hidden');
            }
        })
        wizardBureau.on('beforePrev', function (wizardObj) {
            var length = $('input[type="checkbox"]:checked').length
            for (var i = 0; i < length; i++) {
                $('#group_details_variable_'+ $('input[type="checkbox"]:checked')[i].value).attr('hidden', 'hidden');
            }
        })

        // Change event
        wizardBureau.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidationExcel = function () {
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
                '[0][coordenate_variable]': {
                    required: true
                },
                '[0][default_variable]': {
                    required: true,
                    digits: validateInputVariable(0, "NE"),
                    number: validateInputVariable(0, "ND")
                },

                '[1][name_variable]': {
                    required: true
                },
                '[1][type_variable]': {
                    required: true
                },
                '[1][coordenate_variable]': {
                    required: true
                },
                '[1][default_variable]': {
                    required: true
                },

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
                            //KTApp.block(formEl);

                            var dataIntegration = {};
                            dataIntegration["organization"] = $('#organization').val();
                            var list_variable = [];
                            var length = $('input[name*="[default_variable]"]').length;
                            for (var i = 0; i < length; i++) {
                                var variable = {};
                                variable["name"] = $('input[name*="[name_variable]"]')[i].value;
                                variable["type"] = $('select[name*="[type_variable]"]')[i].value;
                                variable["coordenate"] = $('input[name*="[coordenate_variable]"]')[i].value;
                                variable["valueDefault"] = $('input[name*="[default_variable]"]')[i].value;
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
                                    xhr.open("PUT", "/v1/rest/dataintegration/" + data.current_response.idDataIntegration + "/excel");
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
    });
});

function validateInputVariable(i, value) {
    return $('[name="[' + i + '][type_variable]"]').val() == value;
}

