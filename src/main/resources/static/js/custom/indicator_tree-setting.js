"use strict";

var KTWizard3 = function () {
    var wizardEl;
    var formEl;
    var validator;
    var wizard;
    var initWizard = function () {
        wizard = new KTWizard('kt_wizard_tree', {
            startStep: 1,
        });
        wizard.on('beforeNext', function (wizardObj) {
            if (wizardObj.currentStep == 1) {
                if (!$('.flowchart-operator').length > 0 || !$('.operator-output').length > 1) {
                    swal.fire({
                        "title": "",
                        "text": "Debe configurar el árbol decisional antes de seguir, como mínimo debe existir un nodo inicial con dos salidas!",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                    wizardObj.stop();
                } else if (!existMainNode()) {
                    swal.fire({
                        "title": "",
                        "text": "Debe existir un nodo inicial el cual no contenga entrada, por favor agregue un nodo y este será de tipo inicial!",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                    wizardObj.stop();
                } else if (!isAllConnectedWithLinks()) {
                    swal.fire({
                        "title": "",
                        "text": "Deben estar todos los nodos conectados entre si, si no ocupará uno por favor eliminarlo antes de seguir!",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                    wizardObj.stop();
                } else if (!isAllClosedInOutput()) {
                    swal.fire({
                        "title": "",
                        "text": "Todos las ramas del árbol decisional deben terminar en alguna salida de flujo, por favor agregar las salidas necesarias antes de seguir!",
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary"
                    });
                    wizardObj.stop();
                }
            }
        });
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
                tree_comparator: {
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
            /*            Swal.fire({
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
                            );*/
        });
    }

    var isAllClosedInOutput = function () {
        return $('.operator-node').length == $('.operator-output').length - 1;
    }
    var isAllConnectedWithLinks = function () {
        return $('.flowchart-operator').length == $('.flowchart-link').length + 1;
    }
    var existMainNode = function () {
        return $('.operator-main-node').length > 0;
    }

    return {
        // public functions
        init: function () {
            wizardEl = KTUtil.get('kt_wizard_tree');
            formEl = $('#kt_form_tree');
            initWizard();
            initValidation();
            initSubmit();
        }
    };
}();

jQuery(document).ready(function () {
    KTWizard3.init();
});
$(document).ready(function () {
    initValidation();
    var data = {
        operators: {}
    };
    $('#tree').flowchart({
        data: data,
        grid: 2,
        defaultLinkColor: "#848485",
    });
    $('button[data-target="#modal_add_node"]').click();
});
var validatorOperator;
var validatorOutput;
var initValidation = function () {
    validatorOperator = $('#form_add_node').validate({
        ignore: ":hidden",
        rules: {
            tree_variable: {
                required: true
            },
            tree_comparator: {
                required: true
            },
            tree_value_comparator: {
                required: true,
                number: true
            }
        },
        invalidHandler: function (event, validator) {
        },
        submitHandler: function (form) {
        }
    });
    validatorOutput = $('#form_add_output').validate({
        ignore: ":hidden",
        rules: {
            tree_label_output: {
                required: true
            },
            tree_color_output: {
                required: true
            }
        },
        invalidHandler: function (event, validator) {
        },
        submitHandler: function (form) {

        }
    });
}

var idOperator = 0;
$('#create_node').click(function (e) {
    e.preventDefault();
    var operatorId = 'created_operator_' + idOperator;
    var operatorMainData = {
        top: Math.round((Math.random() * 210) + 1),
        left: Math.round((Math.random() * (document.getElementById("tree").clientWidth - 200)) + 1),
        properties: {
            title: '{' + $('#tree_variable').val().trim() + '} ' + $('#tree_comparator').val().trim() + ' ' + $('#tree_value_comparator').val().trim(),
            outputs: {
                output_1: {
                    label: 'Afirmación',
                },
                output_2: {
                    label: 'Negación',
                }
            },
            class: 'operator-main-node operator-node'
        }
    };
    var operatorData = {
        top: Math.round((Math.random() * 210) + 1),
        left: Math.round((Math.random() * (document.getElementById("tree").clientWidth - 200)) + 1),
        properties: {
            title: '{' + $('#tree_variable').val().trim() + '} ' + $('#tree_comparator').val().trim() + ' ' + $('#tree_value_comparator').val().trim(),
            inputs: {
                input_1: {
                    label: 'Entrada',
                }
            },
            outputs: {
                output_1: {
                    label: 'Afirmación',
                },
                output_2: {
                    label: 'Negación',
                }
            },
            class: 'operator-node'
        }
    };
    if (validatorOperator.form()) {
        if ($('.operator-main-node').length == 0) {
            $('#tree').flowchart('createOperator', operatorId, operatorMainData);
        } else {
            $('#tree').flowchart('createOperator', operatorId, operatorData);
        }
        $('.operator-node .flowchart-operator-outputs .flowchart-operator-connector-label:contains(Negación)').attr('style', 'color: #ff4700');
        $('.operator-node .flowchart-operator-outputs .flowchart-operator-connector-label:contains(Afirmación)').attr('style', 'color: #0012ff');
        $('.operator-node > .flowchart-operator-title').attr('style', 'background-color: #ffffff');
        $('.flowchart-operator-inputs-outputs').attr('style', 'margin-top: 0px; margin-bottom: 0px;');
        $('#modal_add_node').modal('hide');
        $('#tree_variable').val($('#tree_variable').children().get(0).value);
        $('#tree_comparator').val($('#tree_comparator').children().get(0).value);
        $('#tree_value_comparator').val('');
        idOperator++;
    }else{
        $('#modal_add_node').modal('show');
    }
});

var idOutput = 0;
$('#create_output').click(function (e) {
    e.preventDefault();
    if (validatorOutput.form()) {
        var operatorId = 'created_output_' + idOutput;
        var operatorOutput = {
            top: Math.round((Math.random() * 210) + 1),
            left: Math.round((Math.random() * (document.getElementById("tree").clientWidth - 200)) + 1),
            properties: {
                title: $('#tree_label_output').val().trim(),
                inputs: {
                    input_1: {
                        label: 'Entrada',
                    }
                },
                class: 'operator-output operator-output' + idOutput
            }
        };
        $('#tree').flowchart('createOperator', operatorId, operatorOutput);
        $('.operator-output' + idOutput + ' > .flowchart-operator-title')[0].style['background-color'] = $('#tree_color_output').val().trim();
        $('.operator-output' + idOutput)[0].style['background-color'] = $('#tree_color_output').val().trim();
        $('.operator-output' + idOutput + ' > .flowchart-operator-title').colourBrightness();
        $('.flowchart-operator-inputs-outputs').attr('style', 'margin-top: 0px !important;margin-bottom: 0px !important;');
        if ($('.operator-output' + idOutput + ' > .flowchart-operator-title.light').length > 0) {
            $('.operator-output' + idOutput + ' > .flowchart-operator-title')[0].style['color'] = 'black';
            $('.operator-output' + idOutput)[0].style['color'] = 'black';
        } else {
            $('.operator-output' + idOutput + ' > .flowchart-operator-title')[0].style['color'] = 'white';
            $('.operator-output' + idOutput)[0].style['color'] = 'white';
        }
        $('.flowchart-operator-inputs-outputs').attr('style', 'margin-top: 0px; margin-bottom: 0px;');
        $('#modal_add_output').modal('hide');
        $('#tree_label_output').val('');
        $('#tree_color_output').val('#ac1dcd');
        idOutput++;
    }else{
        $('#modal_add_output').modal('show');
    }
});

$('#delete_selected_button').click(function () {
    $('#tree').flowchart('deleteSelected');
});

function processDataTree() {
    var objectNode = {};
    var operators = $('#tree').flowchart('getData').operators;
    var arrayNamesOperators = Object.keys(operators);
    for (var i = 0; i < arrayNamesOperators.length; i++) {
        var node = {};
        var operator = operators[arrayNamesOperators[i]];
        node['id'] = arrayNamesOperators[i];
        node['output'] = operator.properties['outputs'] == undefined;
        if (operator.properties['outputs'] == undefined) {
            node['label'] = operator.properties['title'];
            node['color'] = operator.properties['title'];
        } else {
            node['expression'] = operator.properties['title'];
            node['childrenNegation'] = getBrotherNode(node['id'], true, undefined);
            node['childrenAffirmation'] = getBrotherNode(node['id'], false, node['childrenNegation']);
        }
        node['main'] = false;
        objectNode[node['id']] = node;
    }
    var arrayNodes = [];
    getNode(arrayNodes, objectNode, getNameMainNode());
    arrayNodes[arrayNodes.length-1].main = true;
    return arrayNodes;
}

function getBrotherNode(fatherNode, isfirst, brotherNode) {
    var links = $('#tree').flowchart('getData').links;
    var arrayNamesLinks = Object.keys(links);
    for (var i = 0; i < arrayNamesLinks.length; i++) {
        var link = links[arrayNamesLinks[i]];
        if (link.fromOperator == fatherNode && (isfirst || link.toOperator != brotherNode))
            return link.toOperator
    }
}

function getNameMainNode() {
    var arrayNode = [];
    var operators = $('#tree').flowchart('getData').operators;
    var arrayNamesOperators = Object.keys(operators);
    for (var i = 0; i < arrayNamesOperators.length; i++) {
        var node = operators[arrayNamesOperators[i]];
        node['id'] = arrayNamesOperators[i];
        arrayNode.push(node);
    }
    var links = $('#tree').flowchart('getData').links;
    var arrayNamesLinks = Object.keys(links);
    for (var i = 0; i < arrayNode.length; i++) {
        if (arrayNode[i].properties['inputs'] == undefined) {
            for (var j = 0; j < arrayNamesLinks.length; j++) {
                if (links[arrayNamesLinks[j]].fromOperator == arrayNode[i].id) {
                    return arrayNode[i].id;
                }
            }
        }
    }
}

function getNode(arrayNode, objectNode, nameNode) {
    if (objectNode[nameNode].childrenNegation != undefined)
        getNode(arrayNode, objectNode, objectNode[nameNode].childrenNegation);
    if (objectNode[nameNode].childrenAffirmation != undefined)
        getNode(arrayNode, objectNode, objectNode[nameNode].childrenAffirmation);
    arrayNode.push(objectNode[nameNode]);

}