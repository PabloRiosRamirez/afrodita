var OPERADORES = {
    LESS_THAN: '<',
    GREATER_THAN: '>',
    GREATER_OR_EQUAL: '>=',
    LESS_OR_EQUAL: '<=',
    IS_IN: '=',
    SURROGATE: '<',
    EQUAL: '=',
};

var contRISKAUTO = 50;
var jsonR = {};
var jsonVari = {};
var jsonDatos = {};
var RISKACT;
var id_auto = 0;
var nombre_auto = "";

$(function () {
    buscarEstadoRiskTier();

    $('#chboxRiskTierAutomatico').change(function () {
        var check = $(this).prop('checked');
        var is = (check ? 1 : 0);

        $.ajax({
            url: 'Svl_RiskTier',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accion: "cambiarRiskTierML2",
                check: is,
                id_tipo: 6
            }, success: function (data) {
                console.log(JSON.stringify(data));
            }
        });

        if (is) {
            $('#nombreRisk').html('Ãrbol AutomÃ¡tico');
            $('#subNombre').html('Ãrbol AutomÃ¡tico');
            $('#subNombre2').html('Ãrbol AutomÃ¡tico');
            limpiarCanvas();
            $('#cuadroRM').removeClass('portlet box blue');
            $('#discriptRM').hide();
            $('#tituloRM').hide();
            $('#seccionarbolM').hide();
            $('#arbolM1').hide();
            $('#arbolM2').hide();
            $('#arbolAM1').show();
            $('#arbolAM2').show();
            $('#tipo').hide();
            $('#cmboxTipoM').hide();
            $('#ind_autom').hide();
            $('#herramientasRT').hide();
            $('#herramientasRT1st').hide();
            $('#historialRT').hide();
            $('#pmmlTipo').show();
            generarModeloML(1);
            $('#btnMostrarHerr').hide();
            $("#chboxArbolManual").prop('checked', false);
            $("#chboxArbolManual").parent().addClass("off");
        } else {
            limpiarCanvas();
            $('#nombreRisk').html('Matriz Risk Tier');
            $('#subNombre').html('Matriz Risk Tier');
            $('#subNombre2').html('Matriz Risk Tier');
            $('#cuadroRM').removeClass('portlet box blue');
            $('#discriptRM').hide();
            $('#tituloRM').hide();
            $('#seccionarbolM').hide();
            $('#arbolM1').hide();
            $('#arbolM2').hide();
            $('#arbolAM1').hide();
            $('#arbolAM2').hide();
            $('#cmboxTipoM').hide();
            $('#pmmlTipo').hide();
            $('#tipo').show();
            $('#ind_autom').show();
            $('#herramientasRT').show();
            $('#herramientasRT1st').show();
            $('#historialRT').show();
            CargarRiskTierII();
            cargarHistorialRT();
            $('#btnMostrarHerr').show();
            $(this).prop('checked', false);
            $(this).parent().addClass("off");
        }
    });
    $('#chboxArbolManual').change(function () {
        INDEX_PADRE = 0;
        $("#contenedorReglas_" + 0).remove();
        $("#contenedorReglas_" + 1).remove();
        ListaReglasPadre[0] = undefined;
        var check = $(this).prop('checked');
        var is = (check ? 2 : 0);

        $.ajax({
            url: 'Svl_RiskTier',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accion: "cambiarRiskTierML2",
                check: is,
                id_tipo: 8
            }, success: function (data) {
                console.log(JSON.stringify(data));
            }
        });

        if (is) {
            limpiarCanvas();
            $('#nombreRisk').html('Ãrbol Manual');
            $('#subNombre').html('Ãrbol Manual');
            $('#subNombre2').html('Ãrbol Manual');
            $('#cuadroRM').addClass('portlet box blue');
            $('#discriptRM').show();
            $('#tituloRM').show();
            $('#seccionarbolM').show();
            $('#arbolM1').show();
            $('#arbolM2').show();
            $('#arbolAM1').hide();
            $('#arbolAM2').hide();
            $('#tipo').hide();
            $('#cmboxTipoM').show();
            $('#ind_autom').hide();
            $('#herramientasRT').hide();
            $('#herramientasRT1st').hide();
            $('#historialRT').hide();
            $('#pmmlTipo').hide();
            $('#btnMostrarHerr').hide();
            CargarAbolManual();
            $('#nombre_varM').select2({
                placeholder: "Seleccione una opciÃ³n",
                "language": {
                    "noResults": function () {
                        return "No se encontraron Registros";
                    }
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                dropdownAutoWidth: true,
                width: 'auto'
            });
            $('#nombre_varMR').select2({
                placeholder: "Seleccione una opciÃ³n",
                "language": {
                    "noResults": function () {
                        return "No se encontraron Registros";
                    }
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                dropdownAutoWidth: true,
                width: 'auto'
            });
            $("#chboxRiskTierAutomatico").prop('checked', false);
            $("#chboxRiskTierAutomatico").parent().addClass("off");
            $(this).prop('checked', true);
            $(this).parent().removeClass("off");
        } else {
            limpiarCanvas();
            $('#pmmlTipo').hide();
            $('#nombreRisk').html('Matriz Risk Tier');
            $('#subNombre').html('Matriz Risk Tier');
            $('#subNombre2').html('Matriz Risk Tier');
            $('#cuadroRM').removeClass('portlet box blue');
            $('#discriptRM').hide();
            $('#tituloRM').hide();
            $('#seccionarbolM').hide();
            $('#arbolM1').hide();
            $('#arbolM2').hide();
            $('#arbolAM1').hide();
            $('#arbolAM2').hide();
            $('#cmboxTipoM').hide();
            $('#tipo').show();
            $('#ind_autom').show();
            $('#herramientasRT').show();
            $('#herramientasRT1st').show();
            $('#historialRT').show();
            CargarRiskTierII();
            cargarHistorialRT();
            $('#btnMostrarHerr').show();
            $(this).prop('checked', false);
            $(this).parent().addClass("off");
        }
    });

});

function limpiarCanvas() {
    limpiarPizarra();
    limpiarPizarraAuto();
    limpiarArbolM();
}

function buscarEstadoRiskTier() {
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'buscarEstadoRTAuto2'
        }, success: function (data) {
            if (data.estado == 200) {
                var estado_rtauto = data.estado_rt_auto;
                if (estado_rtauto == 1) {
                    $('#nombreRisk').html('Ãrbol AutomÃ¡tico');
                    $('#subNombre').html('Ãrbol AutomÃ¡tico');
                    $('#subNombre2').html('Ãrbol AutomÃ¡tico');
                    $('#cuadroRM').removeClass('portlet box blue');
//                    $('#discriptRM').hide();
//                    $('#tituloRM').hide();
//                    $('#seccionarbolM').hide();
                    $('#cmboxTipoM').hide();
//                    $('#arbolM1').hide();
//                    $('#arbolM2').hide();
                    $('#pmmlTipo').show();
                    $('#arbolAM1').show();
                    $('#arbolAM2').show();
                    $('#tipo').hide();
                    $('#ind_autom').hide();
                    $('#herramientasRT').hide();
                    $('#herramientasRT1st').hide();
                    $('#historialRT').hide();
                    generarModeloML($('#pmmlTipo').val());
                    $("#chboxArbolManual").prop('checked', false);
                    $("#chboxArbolManual").parent().addClass("off");
                    $('#chboxRiskTierAutomatico').prop('checked', true);
                    $('#chboxRiskTierAutomatico').parent().removeClass("off");
                } else if (estado_rtauto == 2) {
                    $('#nombreRisk').html('Ãrbol Manual');
                    $('#subNombre').html('Ãrbol Manual');
                    $('#subNombre2').html('Ãrbol Manual');
                    $('#cuadroRM').addClass('portlet box blue');
                    $('#discriptRM').show();
                    $('#tituloRM').show();
                    $('#arbolM1').show();
                    $('#arbolM2').show();
                    $('#seccionarbolM').show();
                    $('#cmboxTipoM').show();
                    $('#tipo').hide();
                    $('#ind_autom').hide();
                    $('#herramientasRT').hide();
                    $('#herramientasRT1st').hide();
                    $('#historialRT').hide();
                    CargarAbolManual();
                    $('#nombre_varM').select2({
                        placeholder: "Seleccione una opciÃ³n",
                        "language": {
                            "noResults": function () {
                                return "No se encontraron Registros";
                            }
                        },
                        escapeMarkup: function (markup) {
                            return markup;
                        },
                        dropdownAutoWidth: true,
                        width: 'auto'
                    });
                    $('#nombre_varMR').select2({
                        placeholder: "Seleccione una opciÃ³n",
                        "language": {
                            "noResults": function () {
                                return "No se encontraron Registros";
                            }
                        },
                        escapeMarkup: function (markup) {
                            return markup;
                        },
                        dropdownAutoWidth: true,
                        width: 'auto'
                    });
                    $('#btnMostrarHerr').hide();
                    $("#chboxRiskTierAutomatico").prop('checked', false);
                    $("#chboxRiskTierAutomatico").parent().addClass("off");
                    $('#chboxArbolManual').prop('checked', true);
                    $('#chboxArbolManual').parent().removeClass("off");
                } else {
                    $('#cuadroRM').removeClass('portlet box blue');
                    $('#discriptRM').hide();
                    $('#tituloRM').hide();
                    $('#seccionarbolM').hide();
                    $('#btnMostrarHerr').show();
                    CargarRiskTierII();
                    cargarHistorialRT();
                }

                $('#chboxRiskTierAutomatico').bootstrapToggle({
                    on: '',
                    off: ''
                });
                $('#chboxArbolManual').bootstrapToggle({
                    on: '',
                    off: ''
                });
            }
        }
    });
}
function guardarPmml() {
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'guardarPmml'
        }, success: function (data) {
            if (data.estado == 200) {
                return true;
            }
        }
    });
}

function conectarNodosRTA(padre, hijo) {
    jsPlumb.connect({
        source: padre,
        target: hijo,
        anchors: ["RightMiddle", "LeftMiddle"],
        connector: ["Flowchart"],
        endpoint: "Blank"
    });
}

$('#pmmlTipo').change(function () {
    limpiarPizarraAuto();
    generarModeloML(this.value);
});

function generarModeloML(tipo) {
    id_auto = 0;
    $('#tr #descrit').html(' ');
    $('#tr #modelonom').html(' ');
    $('#tr #functionnom').html(' ');
    $('#tr #algoritmonom').html(' ');
    $('#tr #time').html(' ');
    $('#tablaVari').html(' ');
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'obtenerRiskTierPmml',
            tipo: tipo
        }, success: function (data) {
            if (data.estado == 200) {
                jsonR = JSON.parse(data.datos);
                jsonVari = data.variables;
                jsonDatos = data.datosVar;
                id_auto = data.id_auto;
                nombre_auto = data.nombre_auto;

                $('#tr #descrit').html(jsonDatos.descrit.length > 19 ? jsonDatos.descrit.substring(0, 18) + "..." : jsonDatos.descrit);
                $('#tr #modelonom').html(jsonDatos.nombremodel.length > 19 ? jsonDatos.nombremodel.substring(0, 18) + "..." : jsonDatos.nombremodel);
                $('#tr #functionnom').html(jsonDatos.funcion.length > 19 ? jsonDatos.funcion.substring(0, 18) + "..." : jsonDatos.funcion);
                $('#tr #algoritmonom').html(jsonDatos.algoritmo.length > 19 ? jsonDatos.algoritmo.substring(0, 18) + "..." : jsonDatos.algoritmo);
                $('#tr #time').html(jsonDatos.time);

                var html = '';
                for (var i = 0; i < jsonVari.length; i++) {
                    html += '<tbody>'
                        + '<tr>'
                        + '<td>' + jsonVari[i].variable + '</td>'
                        + '</tr>'
                        + '</tbody>';
                }
                $('#tablaVari').html(html);

                buscarNodosV1(jsonR.node);
                desbloquearUI('limpiar');
            }
        }
    });
}

function obtenerEstadoRTAuto() {
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'estadoRTAuto'
        }
    });
}
var PRO1 = [];
var nodoAuto0;
function buscarNodosV1(_nodos) {
    jsPlumb.deleteEveryEndpoint();
    $('#canvas2').empty();
    var nodo = _nodos;
//    var nodoId = _ID_NODO_RT;
    var nodoId = nodo.id;
    nodoAuto0 = nodo.id;
//    $('#canvas2').append('<div class="window jtk-node" id="nodo_' + _ID_NODO_RT + '" style="text-align: center; border-radius: 25px !important; border: 1px solid #0088cc; padding: 4px 40px; left:30px;"><strong> INICIO</strong></div>');
    var html = '&nbsp;&nbsp;' +
        '<div id="nodo_' + nodo.id + '" data-var=0 data-origen=0 class="window jtk-node"  style="text-align: center; border: 1px solid #0088cc; padding: 20px;left: 6px;background-color: #ffffff !important;">\n';
    var html = html + '<strong>INICIO</strong> ' + "";
    var html = html + '</div>';
    $('#canvas2').append(html);
    jsPlumb.addEndpoint("nodo_" + nodo.id, sourceEndpoint, {anchor: "RightMiddle", uuid: "RightMiddle"});
    jsPlumb.draggable($("#nodo_" + nodo.id));
    var pos = 0;
    contRISKAUTO = 100;
//    _ID_NODO_RT = _ID_NODO_RT + 1;
    clasificarRTA(nodo);
    if (clasificar()) {
        buscarSubNodosV1(nodo, pos, nodoId);
    }
}

function clasificarRTA(_nodo) {
    var nodo = _nodo.nodes;
    if (typeof nodo != "undefined") {
        for (var i in nodo) {
            clasificarRTA(nodo[i]);
        }
    } else {
        PRO1.push(_nodo.scoreDistributions[1].confidence);
    }
}

var CLASI = [];
function clasificar() {
    CLASI = [];
    var letra = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    PRO1.sort();
    var cont = 0;
    if (PRO1.length > letra.length) {
        var cont2 = 0;
        var val = ("" + PRO1.length / letra.length).split(".");
        for (var i = 0; i < PRO1.length; i++) {
            var json = {};
            json.num = PRO1[i];
            if (cont != 9 && (cont2 == parseInt(val[0]))) {
                cont++;
                cont2 = 0;
            }
            cont2++;
            json.letra = letra[cont];
            CLASI.push(json);
        }
    } else {
        for (var i = 0; i < PRO1.length; i++) {
            var json = {};
            json.num = PRO1[i];
            json.letra = letra[cont];
            CLASI.push(json);
            cont++;
        }
    }
    return true;
}

function RTAutoFueraDeRango(condiciones) {
    var fontColor;
    var res = condiciones.split("^");
    fontColor = "font-grey-cascade";
    var nodoId = "1FR";
    var valor = '';
    for (var i = 0; i < jsonVari.length; i++) {
        if (jsonVari[i].nombre == res[1]) {
            valor = jsonVari[i].variable;
            i = jsonVari.length;
        }
    }
    var field_name = valor;
    var operator = res[2];
    var value = res[3];

    var valueAprox = Math.round(value);
    var condicion = '' + field_name.charAt(0) + field_name.slice(1).toLowerCase() + ' ' + operator + ' ' + valueAprox + '';
    var width = 17
    if (condicion.length > 11 && condicion.length <= 23) {
        width = 26;
    } else if (condicion.length > 23 && condicion.length <= 33) {
        width = 34;
    } else if (condicion.length > 33) {
        width = 46;
    }
    contRISKAUTO = 400;
    var html = '<div id="nodo_' + nodoId + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="width: ' + width + '%;text-align: center; border: 1px solid #0088cc; padding: 4px 40px; top: ' + (contRISKAUTO) + 'px; left: ' + 250 + 'px; background-color: #ffffff !important;">' +
        '<div class="widget-thumb-wrap">' +
        '<div class="widget-thumb-body">' +
        '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;"> VARIABLE FUERA DE RANGO <label id="idVariable" style="display: none">' + nodoId+ '<label></span>' +
        '<br>' + condicion +
        '</div>' +
        '</div>' +
        '<div></div>' +
        '</div>';
    $('#canvas2').append(html);
    contRISKAUTO += 100;
    jsPlumb.addEndpoint("nodo_" + nodoId, sourceEndpointRechazo, {anchor: "RightMiddle", uuid: "RightMiddle" + nodoId});
    jsPlumb.addEndpoint("nodo_" + nodoId, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + nodoId});
    jsPlumb.draggable($("#nodo_" + nodoId));
    conectarNodosRTA("nodo_" + nodoAuto0, "nodo_" + nodoId);
    jsPlumb.repaintEverything();
    //buscarSubNodosV1(nodo[i], (_pos + 450), nodoId);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    fontColor = "font-blue-madison";
    var nodoId2 = "2FR";
    var score = res[0];
    var html = '<div id="nodo_' + nodoId2 + "_clas" + '" class="window jtk-node" style="text-align: center; border: 1px solid #0088cc; padding: 9px 17px; top: ' + (contRISKAUTO) + 'px; left: ' + 700 + 'px; background-color: #ffffff !important;">' +
        '<div class="widget-thumb-wrap">' +
        '<div class="widget-thumb-body" style="padding-top: 10px;">' +
        '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
        '<br>' + score + '' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#canvas2').append(html);
    contRISKAUTO += 100;
    jsPlumb.addEndpoint("nodo_" + nodoId2 + "_clas", targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + nodoId2 + "_clas"});
    jsPlumb.draggable($("#nodo_" + nodoId2 + "_clas"));
    conectarNodosRTA("nodo_" + nodoId, "nodo_" + nodoId2 + "_clas");
    jsPlumb.repaintEverything();
}

function buscarSubNodosV1(_nodo, _pos, _parentId) {
    var cuaColor, fontColor;
    var nodo = _nodo.nodes;
//    var nodo = _nodo;
//    var score = validarScore(_nodo);
    var flag = true;
    if (typeof nodo != "undefined") {
        for (var i in nodo) {
            fontColor = "font-grey-cascade";
//            var nodoId = _ID_NODO_RT;
            var nodoId = nodo[i].id;
            var field_name = validarFieldName(nodo[i]);
            var operator = validarOperador(nodo[i]);
            var value = validarValor(nodo[i]);
//            var valueAprox = Math.ceil(value);
            var valueAprox = Math.round(value);
            var condicion = '' + field_name.charAt(0) + field_name.slice(1).toLowerCase() + ' ' + operator + ' ' + valueAprox + '';
            var width = 17
            if (condicion.length > 11 && condicion.length <= 23) {
                width = 26;
            } else if (condicion.length > 23 && condicion.length <= 33) {
                width = 34;
            } else if (condicion.length > 33) {
                width = 46;
            }
//            $('#canvas2').append('<div class="window jtk-node" id="nodo_' + _ID_NODO_RT + '" style="text-align: center; border-radius: 25px !important; border: 1px solid #0088cc; padding: 4px 40px; left: ' + (_pos + 250) + 'px;top: ' + (contRISKAUTO) + 'px;"><strong>' + field_name + '<label id="idVariable" style="display: none">' + nodo[i].id + '<label></strong><br><div> ' + field_name.charAt(0) + field_name.slice(1).toLowerCase() + ' ' + operator + ' ' + valueAprox + ' </div></div>');
            var html = '<div id="nodo_' + nodo[i].id + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="width: ' + width + '%;text-align: center; border: 1px solid #0088cc; padding: 4px 40px; top: ' + (contRISKAUTO) + 'px; left: ' + (_pos + 250) + 'px; background-color: #ffffff !important;">' +
                '<div class="widget-thumb-wrap">' +
                '<div class="widget-thumb-body">' +
                '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;">' + field_name + '<label id="idVariable" style="display: none">' + nodo[i].id + '<label></span>' +
                '<br>' + condicion +
                '</div>' +
                '</div>' +
                '<div></div>' +
                '</div>';
            $('#canvas2').append(html);
            contRISKAUTO += 100;
            jsPlumb.addEndpoint("nodo_" + nodo[i].id, sourceEndpointRechazo, {anchor: "RightMiddle", uuid: "RightMiddle" + nodo[i].id});
            jsPlumb.addEndpoint("nodo_" + nodo[i].id, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + nodo[i].id});
            jsPlumb.draggable($("#nodo_" + nodo[i].id));
            conectarNodosRTA("nodo_" + _parentId, "nodo_" + nodoId);
            jsPlumb.repaintEverything();
//            _ID_NODO_RT = _ID_NODO_RT + 1;
            buscarSubNodosV1(nodo[i], (_pos + 450), nodoId);
        }
    } else {
        fontColor = "font-blue-madison";
//        var nodoId = _ID_NODO_RT;
        var nodoId = _nodo.id;
        var score = validarScore(_nodo);
//        if (score == "D" && 'morosidad_consolidada.monto_total' == validarFieldName(_nodo)) {
//            score = "C";
//            flag = false;
//        } else if (score == "D") {
//            score = "B";
//        } else if (score == "E" && 'score' == validarFieldName(_nodo)) {
//            score = "A";
//        }
//        $('#canvas2').append('<div class="window jtk-node" id="nodo_' + _ID_NODO_RT + '" style="text-align: center; border-radius: 25px !important; border: 1px solid #0088cc; padding: 4px 40px; left: ' + (_pos + 250) + 'px;top: ' + (contRISKAUTO) + 'px;"><strong>' + score + '</strong></div>');
        var html = '<div id="nodo_' + _nodo.id + "_clas" + '" class="window jtk-node" style="text-align: center; border: 1px solid #0088cc; padding: 9px 17px; top: ' + (contRISKAUTO) + 'px; left: ' + (_pos + 250) + 'px; background-color: #ffffff !important;">' +
            '<div class="widget-thumb-wrap">' +
            '<div class="widget-thumb-body" style="padding-top: 10px;">' +
            '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
            '<br>' + score + '' +
            '</div>' +
            '</div>' +
            '</div>';
        $('#canvas2').append(html);
        contRISKAUTO += 100;
        jsPlumb.addEndpoint("nodo_" + _nodo.id + "_clas", targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _nodo.id + "_clas"});
        jsPlumb.draggable($("#nodo_" + _nodo.id + "_clas"));
        conectarNodosRTA("nodo_" + _parentId, "nodo_" + nodoId + "_clas");
        jsPlumb.repaintEverything();
//        _ID_NODO_RT = _ID_NODO_RT + 1;
    }

}

function validarScore(nodo) {
    var valor = '';
    try {
        for (var i = 0; i < CLASI.length; i++) {
            if (CLASI[i].num == nodo.scoreDistributions[1].confidence) {
                valor = CLASI[i].letra;
            }
        }
//        if (nodo.score !== undefined) {
//            valor = nodo.score;
//        }
    } catch (ex) {
//        console.log(ex);
    }
    return valor;
}

function validarOperador(nodo) {
    var valor = '';
    try {
        if (nodo.predicate !== undefined) {
            if (nodo.predicate.operator !== undefined) {
                valor = OPERADORES[nodo.predicate.operator];
            } else if (nodo.predicate.predicates !== undefined) {
                valor = OPERADORES[nodo.predicate.predicates[0].operator];
            }
        }
    } catch (ex) {
//        console.log(ex);
    }

    return valor;
}

function validarFieldName(nodo) {
    var valor = '';
    var valor1 = '';
    try {
        if (nodo.predicate.field !== undefined) {
            valor1 = nodo.predicate.field.value;
        } else if (nodo.predicate.predicates !== undefined) {
            valor1 = nodo.predicate.predicates[0].field.value;
        }
        for (var i = 0; i < jsonVari.length; i++) {
            if (jsonVari[i].nombre == valor1) {
                valor = jsonVari[i].variable;
                i = jsonVari.length;
            }
        }
    } catch (ex) {
//        console.log(ex);
    }
    return valor;
}

function validarValor(nodo) {
    var valor = '';
    try {
        (nodo.predicate !== undefined ? nodo.predicate.value : '');
        if (nodo.predicate !== undefined) {
            if (nodo.predicate.value !== undefined) {
                valor = nodo.predicate.value;
            } else if (nodo.predicate.array !== undefined) {
                valor = nodo.predicate.array.value;
            } else if (nodo.predicate.predicates !== undefined) {
                valor = nodo.predicate.predicates[0].value;
            }
        }
    } catch (ex) {
//        console.log(ex);
    }
    return valor;
}