$(document).ready(function () {
    var data = {
        operators: {}
    };

    $('#tree').flowchart({
        data: data
    });
});
var validator;
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

$('#create_node').click(function () {
    var operatorId = 'created_operator_' + parseInt($('.operator-node').length + 1);
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
            class: 'operator-node'
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
    if ($('.operator-node').length == 0) {
        $('#tree').flowchart('createOperator', operatorId, operatorRaizData);
    } else {
        $('#tree').flowchart('createOperator', operatorId, operatorData);
    }
    $('#modal_add_node').modal('hide');
    $('#tree_variable').val($('#tree_variable').children().get(0).value);
    $('#tree_operation').val($('#tree_operation').children().get(0).value);
    $('#tree_value_comparator').val('');
});

$('#create_output').click(function () {
    var operatorId = 'created_output_' + parseInt($('.operator-output').length + 1);
    var operatorOutput = {
        top: Math.round((Math.random() * 210) + 1),
        left: Math.round((Math.random() * (document.getElementById("tree").clientWidth - 200)) + 1),
        properties: {
            title: $('#tree_label_output').val().trim() + ' ' + $('#tree_color_output').val().trim(),
            inputs: {
                input_1: {
                    label: 'Entrada',
                }
            },
            class: 'operator-output'
        }
    };
    $('#tree').flowchart('createOperator', operatorId, operatorOutput);

    $('#modal_add_output').modal('hide');
    $('#tree_label_output').val('');
    $('#tree_color_output').val('#ac1dcd');
});

$('#delete_selected_button').click(function () {
    $('#tree').flowchart('deleteSelected');
});