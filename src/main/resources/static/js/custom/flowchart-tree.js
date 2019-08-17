
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
    // $.validator.addMethod('sintaxisMath', function (value, element, param) {
    //     return false;
    // }, 'Problemas de sintaxis en la operación matemática, por favor revisar');
    validatorOperator = $('#form_add_node').validate({
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
            }
        },

        // Display error
        invalidHandler: function (event, validator) {
        },

        // Submit valid form
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

        // Display error
        invalidHandler: function (event, validator) {
        },

        // Submit valid form
        submitHandler: function (form) {

        }
    });
}

var idOperator = 0;
$('#create_node').click(function (e) {
    e.preventDefault();
    var operatorId = 'created_operator_' + idOperator;
    var operatorRaizData = {
        top: Math.round((Math.random() * 210) + 1),
        left: Math.round((Math.random() * (document.getElementById("tree").clientWidth - 200)) + 1),
        properties: {
            title: '{' + $('#tree_variable').val().trim() + '} ' + $('#tree_operation').val().trim() + ' ' + $('#tree_value_comparator').val().trim(),
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
            title: '{' + $('#tree_variable').val().trim() + '} ' + $('#tree_operation').val().trim() + ' ' + $('#tree_value_comparator').val().trim(),
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
            $('#tree').flowchart('createOperator', operatorId, operatorRaizData);
        } else {
            $('#tree').flowchart('createOperator', operatorId, operatorData);
        }
        $('.operator-node .flowchart-operator-outputs .flowchart-operator-connector-label:contains(Negación)').attr('style', 'color: #ff4700');
        $('.operator-node .flowchart-operator-outputs .flowchart-operator-connector-label:contains(Afirmación)').attr('style', 'color: #0012ff');
        $('.operator-node > .flowchart-operator-title').attr('style', 'background-color: #ffffff');
        $('.flowchart-operator-inputs-outputs').attr('style', 'margin-top: 0px; margin-bottom: 0px;');
        $('#modal_add_node').modal('hide');
        $('#tree_variable').val($('#tree_variable').children().get(0).value);
        $('#tree_operation').val($('#tree_operation').children().get(0).value);
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
        objectNode[node['id']] = node;
    }
    var arrayNodes = [];
    getNode(arrayNodes, objectNode, getNameMainNode());
    arrayNodes[arrayNodes.length].isMain = true;
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

