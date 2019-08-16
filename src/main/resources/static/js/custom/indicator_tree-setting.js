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
        wizard = new KTWizard('kt_wizard_tree', {
            startStep: 1,
        });

        // Validation before going to next page
        wizard.on('beforeNext', function (wizardObj) {
            // if (validator.form() !== true) {
            //     wizardObj.stop();  // don't go to the next step
            // } else {
            if (wizardObj.currentStep == 2) {

            }
            // }
        });

        // Change event
        wizard.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function () {
        // $.validator.addMethod('sintaxisMath', function (value, element, param) {
        //     return false;
        // }, 'Problemas de sintaxis en la operación matemática, por favor revisar');
        validator = formEl.validate({
            ignore: ":hidden",
            rules: {
                tree_variable: {
                    required: true
                },
                tree_operation: {
                    required: true
                },
                tree_value_comparator: {
                    required: true,
                    number: true
                },
                tree_label_output: {
                    required: true,
                    number: true
                },
                tree_color_output: {
                    required: true,
                    number: true
                }
            },

            // Display error
            invalidHandler: function (event, validator) {
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

    var initTree = function () {

    }

    return {
        // public functions
        init: function () {
            wizardEl = KTUtil.get('kt_wizard_tree');
            formEl = $('#kt_form_tree');
            initWizard();
            initValidation();
            initSubmit();
            initTree();
        }
    };
}();

jQuery(document).ready(function () {
    KTWizard3.init();
});