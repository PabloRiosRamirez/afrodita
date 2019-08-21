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
                } else {
                    var arrayNodes = processDataTree();
                    var templateNodes = "";
                    var templateOutput = "";
                    for (var i = 0; i < arrayNodes.length; i++) {
                        if (!arrayNodes[i].output) {
                            templateNodes += addNodes(arrayNodes[i].expression);
                        } else {
                            templateOutput += addOutput(arrayNodes[i].label, arrayNodes[i].color);
                        }
                    }
                    $('#content_nodes').html(templateNodes);
                    $('#content_output').html(templateOutput);


                    var template = "";
                    for (var i = 0; i < arrayNodes.length; i++) {
                        if (arrayNodes[i].output && $('div_' + arrayNodes[i].label).length == 0) {
                            template +=
                                "<div class=\"col-lg-6\">" +
                                "   <div id=\"div_" + arrayNodes[i].label + "\" class=\"offset-lg-1 col-lg-10\">\n" +
                                "       <div class=\"kt-portlet\">\n" +
                                "           <div class=\"kt-portlet__body\">\n" +
                                "                 <h1 class=\"text-center kt-font-bolder\"\n" +
                                "                    style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" id=\"label_" + arrayNodes[i].labelOutput + "\"></h1>\n" +
                                "            </div>\n" +
                                "        </div>\n" +
                                "    </div>\n" +
                                "</div>";
                        }
                    }
                    $('#content_outputs').html(template);
                    for (var i = 0; i < arrayNodes.length; i++) {
                        if (businessTreeNodeCollection[i].output && $('div_' + arrayNodes[i].labelOutput).length == 0) {
                            handlePulsate(arrayNodes[i].labelOutput, arrayNodes[i].color);
                        }
                    }


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
            Swal.fire({
                title: '¿Está seguro de guardar esta configuración?',
                text: "Si guarda esto, si es que existe una configuración anterior de Business Tree está se borrará para siempre.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar esto!'
            })
                .then(function (result) {
                        if (result.value) {
                            KTApp.progress(btn);
                            var businesstree = {};
                            businesstree['organization'] = $('#organization').val();
                            var arrayNode = processDataTree();
                            businesstree['nodes'] = arrayNode;
                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: "/v1/rest/tree",
                                data: JSON.stringify(businesstree),
                                dataType: 'json',
                                cache: false,
                                timeout: 60000,
                                success: function (data, textStatus, jqXHR) {
                                    Swal.fire({
                                        title: "",
                                        text: "La configuración de Business Tree ha sido guardado correctamente!",
                                        type: "success",
                                        onClose: function () {
                                            window.location = "/indicators/businesstree"
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
                );
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
    } else {
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
    } else {
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
            node['color'] = rgb2hex($('.' + operator.properties["class"].replace("operator-output ", ""))[0].style['background-color']);
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
    arrayNodes[arrayNodes.length - 1].main = true;


    return arrayNodes;
}

function addNodes(expression) {
    return "<div class=\"form-group row\">\n" +
        "<div class=\"col-3\">\n" +
        "   <label>Expresión:</label>\n" +
        "</div>\n" +
        "<div class=\"col-6\">\n" +
        "    <strong class=\"text-info\">" + expression + "</strong>" +
        "</div>" +
        "</div>";
}

function addOutput(label, color) {
    return "<div class=\"form-group row\">\n" +
        "<div class=\"col-4\">\n" +
        "    <label>Texto de\n" +
        "        salida:</label>\n" +
        "</div>\n" +
        "<div class=\"col-3\">\n" +
        "    <strong class=\"text-info\">" + label + "</strong>" +
        "</div>\n" +
        "<div class=\"col-3\">\n" +
        "    <label>Color:</label>\n" +
        "</div>\n" +
        "<div class=\"col-2\">\n" +
        "    <input class=\"form-control\"\n" +
        "           disabled=\"\"\n" +
        "           type=\"color\"\n" +
        "           value=\"" + color + "\">\n" +
        "</div>" +
        "</div>";
}


function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
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


/*<![CDATA[*/
var businesstree = /*[[${businesstree}]]*/ undefined;

/*]]>*/

// Class initialization on page load
jQuery(document).ready(function () {

});

function handlePulsate(titule, color) {
    if (!jQuery().pulsate) {
        return;
    }
    $('#label_' + titule).html(titule);
    $('#label_' + titule).attr('style', 'color: ' + color);
    if (jQuery().pulsate) {
        $('#div_' + titule).pulsate({
            color: color,
            speed: 600
        });
    }
};