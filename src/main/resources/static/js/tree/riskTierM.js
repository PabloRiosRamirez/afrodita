/* global jsPlumb */

var acciones = [];
var id_nodoacc;
var CONT = 0;
var CONT_NODO = 1;
var _ID_NODO = 0;
var CONT_NIVEL = 1;
var obs = [];
var id_grupo = 0;
var nombre_grupo = "";
var _contChkbox = 0;
var noConCarga = true;
var auxDataDatos;
var numeros_nodos = [];
var _top = 10;
var _left = (document.getElementById('canvas2').offsetWidth / 2) - (document.getElementById('canvas2').offsetWidth / 20);
var _ultimaRaiz = 0;
var _esEjeXoY = 0;

/*Variable JSON*/
var JBUREAUS = [];
var BUREAUSM = [];
var validarNodos = false;
var NodosPreCargados = false;
var ACTIVIDAD = {
    1: {detalle: 'TRASNUNION'},
    2: {detalle: 'EQUIFAX'},
    3: {detalle: 'SINACOFI'},
    4: {detalle: 'SIISA'},
    5: {detalle: 'FUENTE DE TERCEROS'}
};

var OPERADOR = {
    '<': {detalle: 'Menor'},
    '<=': {detalle: 'Menor o Igual'},
    '>': {detalle: 'Mayor'},
    '>=': {detalle: 'Mayor o Igual'},
    '==': {detalle: 'Igual'},
    '!=': {detalle: 'Distinto'}
};

var OPERADORTexto = {
    '<=': {detalle: 'Contiene'},
    '>=': {detalle: 'No Contiene'},
    '==': {detalle: 'Igual a'},
    '!=': {detalle: 'Distinto de'}
};

var OPERADORFECHA = {
    '<': {detalle: 'Menor'},
    '>': {detalle: 'Mayor'},
};
var VALORFECHA = {
    '1': {detalle: '1'},
    '3': {detalle: '3'},
    '6': {detalle: '6'},
    '12': {detalle: '12'},
    '24': {detalle: '24'},
};

function CargarAbolManual() {
//    $('#cmboxTipoM').val(1);
    buscarAcciones();
    mostrarRM(1);
    initOperador($('#sl_operadorMR'));
    initOperador($('#sl_operadorM'));
    initValorFecha();
    CargarRiskM($('#cmboxTipoM').val());
    obtenerBureau();
}

//funciones RiskTier Manual
function obtenerBureau() {
    getJsonCM('Svl_Variable', {accion: 'listarPorBureau', sw: "true", recurso: "9"}, false, function (data) {
        $('#btnAgregarVariable').prop('disabled', false);
        $('#btnVistaPrevia').prop('disabled', false);
        $('#btnGuardarRegla').prop('disabled', false);
        if (data.estado === 200) {
            BUREAUSM = data.datos;
        }
        fillBureauM();
    }, function () {});
}

function fillBureauM() {
    $.ajax({
        url: 'Svl_Informacion',
        type: 'POST',
        dataType: 'json',
        data: {
            code: 'consultarIndustria'
        },
        success: function (data) {
            var selected = document.getElementById("cmboxTipoM").value;
            $('#sl_actividadM').html(' ');
            $('#sl_actividadM').html('<option value="0" selected disabled>Seleccione</option>');
            $('#sl_actividadMR').html(' ');
            $('#sl_actividadMR').html('<option value="0" selected disabled>Seleccione</option>');
            var grupoDato = "<optgroup label=\"ObtenciÃ³n de Datos\">";
            var option = "";
            for (var i in BUREAUSM) {
                if (data.datos.IND_NOMBRE.toUpperCase() == BUREAUSM[i].nombre || BUREAUSM[i].tipoBureau == 1 || BUREAUSM[i].nombre == "SII" || BUREAUSM[i].tipoFuente == 3 || BUREAUSM[i].nombre == "PREVIRED") {
                    var nombre;
                    if (data.datos.IND_NOMBRE.toUpperCase() == BUREAUSM[i].nombre) {
                        nombre = "DATA ENTRY";
                    } else {
                        nombre = BUREAUSM[i].nombre;
                    }
                    option = '<option value="' + BUREAUSM[i].id + '">' + nombre + '</option>';
                    if ((BUREAUSM[i].tipoFuente === 2 || BUREAUSM[i].tipoFuente === 3) && selected !== 2) {
                        grupoDato = grupoDato + option;
                    }
                }
            }
            grupoDato = grupoDato + "</optgroup>";
            $('#sl_actividadM').append(grupoDato);
            $('#sl_actividadMR').append(grupoDato);
        }
    });
}

function fillBureauVariablesM() {
    var sw = false;
    var selected = document.getElementById("cmboxTipoM").value;
    var tipoPersona;
    if (selected == 1) {
        tipoPersona = 'N'
    } else {
        tipoPersona = 'J';
    }
    for (var i in BUREAUSM) {
        if (BUREAUSM[i].id == $('#sl_actividadM').val()) {
            sw = true;
            $('#nombre_varM').html('<option value="0" selected disabled>Seleccione</option>');
            var variables = BUREAUSM[i].variables;
            for (var j in variables) {
                if (variables[j].tipo == tipoPersona || variables[j].tipo == 'A') {
                    $('#nombre_varM').append('<option value="' + variables[j].id + '" vartipo="' + variables[j].tipoDato + '" varId_ratio="' + variables[j].id_ratio + '">' + variables[j].descripcion + ' ' + getTipoDato(variables[j].tipoDato) + '</option>');
                }
            }
            break;
        }
    }
    if (!sw) {
        console.log("No tiene variables");
        $('#nombre_varM').html('<option value="0" selected disabled>Seleccione</option>');
    }
}

function fillBureauVariablesMR() {
    $('#sl_ValorMFechaMR').val(0);
    $('#sl_ValorMFechaMR').hide();
    $('#valorMR').show();
    $('#valorMR').val('');
    $('#valorMR').attr('onkeyup', 'formatoNumero(this);');
    var sw = false;
    var selected = document.getElementById("cmboxTipoM").value;
    var tipoPersona;
    if (selected == 1) {
        tipoPersona = 'N'
    } else {
        tipoPersona = 'J';
    }
    for (var i in BUREAUSM) {
        if (BUREAUSM[i].id == $('#sl_actividadMR').val()) {
            sw = true;
            $('#nombre_varMR').html('<option value="0" selected disabled>Seleccione</option>');
            var variables = BUREAUSM[i].variables;
            for (var j in variables) {
                if (variables[j].tipo == tipoPersona || variables[j].tipo == 'A') {
                    $('#nombre_varMR').append('<option value="' + variables[j].id + '" vartipo="' + variables[j].tipoDato + '" varId_ratio="' + variables[j].id_ratio + '">' + variables[j].descripcion + '</option>');
                }
            }
            break;
        }
    }
    if (!sw) {
        console.log("No tiene variables");
        $('#nombre_varMR').html('<option value="0" selected disabled>Seleccione</option>');
    }
}

function validaDatoVar(dato) {
    if ($('#chboxArbolManual').prop('checked'))
    {
        _esEjeXoY = 0;
        $("#mostrarModalClass").hide();
    }

    var tipo = $('option:selected', dato).attr('vartipo');
    $('#contVariables').val(false);

    if (_esEjeXoY == 1)
        $("#mostrarModalClass2").hide();
    else
    if (_esEjeXoY == 2)
        $("#mostrarModalClass3").hide();
    if (tipo == "3") {
        initOperadorFecha('sl_operadorM');
        $('#sl_ValorMFecha').show();
        $('#valor').hide();
    } else if (tipo == "1" || tipo == "55") {
        initOperadorTexto('sl_operadorM');
        $('#sl_ValorMFecha').hide();
        $('#valor').attr('onkeyup', '');
    } else if (tipo == "50" || tipo == "51")
    {
        $("#mostrarModalClass").show();
        $("#mostrarModalClass2").show();
        $("#mostrarModalClass3").show();
        if (tipo == "51")
        {
            initOperadorTexto('sl_operadorM');
            $('#contVariables').val(true);
        } else
        {
            initOperador($('#sl_operadorM'), undefined);
            $('#contVariables').val(false);
        }
        $('#sl_ValorMFecha').hide();
        $('#valor').show();
        $('#valor').attr('onkeyup', 'formatoNumero(this);');
        $('#divValor_' + CONT).show();
        $("#div_regla_arreglo_" + CONT).show();
        $('#divHastaFecha_' + CONT).hide();
        if (_esEjeXoY == 0)
            reiniciar();
        mostrarReglasRray();
    } else {
        initOperador($('#sl_operadorM'), undefined);
        $('#sl_ValorMFecha').hide();
        $('#valor').show();
        $('#valor').attr('onkeyup', 'formatoNumero(this);');
    }
    $('#valor').val('');
    $('#sl_ValorMFecha').val(0);
}

function validaDatoVarRM(dato) {
    var tipo = $('option:selected', dato).attr('vartipo');
    if (tipo == "3") {
        initOperadorFecha('sl_operadorMR');
        $('#sl_ValorMFechaMR').show();
        $('#valorMR').hide();
    } else if (tipo == "1") {
        initOperadorTexto('sl_operadorMR');
        $('#sl_ValorMFechaMR').hide();
        $('#valorMR').attr('onkeyup', '');
    } else {
        initOperador($('#sl_operadorMR'));
        $('#sl_ValorMFechaMR').hide();
        $('#valorMR').show();
        $('#valorMR').attr('onkeyup', 'formatoNumero(this);');
    }
    $('#valorMR').val('');
    $('#sl_ValorMFechaMR').val(0);
}

function initOperador(select, _varFija) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    if (_varFija != undefined && _varFija) {
        operadorString(select);
    } else {
        for (var i in OPERADOR) {
            $(select).append('<option value="' + i + '" simbolo="' + OPERADOR[i].valor + '">' + OPERADOR[i].detalle + '</option>');
        }
    }
}
function initOperadorFecha(nombre) {
    $('#' + nombre).empty();
    $('#' + nombre).append('<option value="0" selected="" disabled="">Operador</option>');
    for (var i in OPERADORFECHA) {
        $('#' + nombre).append('<option value="' + i + '">' + OPERADORFECHA[i].detalle + '</option>');
    }
}

function initOperadorTexto(nombre) {
    $('#' + nombre).empty();
    $('#' + nombre).append('<option value="0" selected="" disabled="">Operador</option>');
    for (var i in OPERADORTexto) {
        $('#' + nombre).append('<option value="' + i + '">' + OPERADORTexto[i].detalle + '</option>');
    }
}

function initValorFecha() {
    $('#sl_ValorMFecha').empty();
    $('#sl_ValorMFecha').append('<option value="0" selected="" disabled="">Valor</option>');
    $('#sl_ValorMFechaMR').empty();
    $('#sl_ValorMFechaMR').append('<option value="0" selected="" disabled="">Valor</option>');
    for (var i in VALORFECHA) {
        if (i == 1) {
            $('#sl_ValorMFecha').append('<option value="' + i + '">' + VALORFECHA[i].detalle + ' Mes </option>');
            $('#sl_ValorMFechaMR').append('<option value="' + i + '">' + VALORFECHA[i].detalle + ' Mes </option>');
        } else {
            $('#sl_ValorMFecha').append('<option value="' + i + '">' + VALORFECHA[i].detalle + ' Meses </option>');
            $('#sl_ValorMFechaMR').append('<option value="' + i + '">' + VALORFECHA[i].detalle + ' Meses </option>');
        }
    }
}

$('#cmboxTipoM').change(function () {
    limpiarArbolM();
    CargarRiskM(this.value);
    mostrarRM(this.value);
});

function mostrarRM(tipoNoJ) {
    var cont = 0;
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'selectGrupo',
            tipo_: tipoNoJ
        }, success: function (data) {
            $("#txtNombreRM").attr("disabled", "disabled");
            $('#divTablaArbolM').html('<table class="col-md-12 col-xs-12 table table-bordered table-hover" id="tblRiskMGrupo" style="width: 100%;">' +
                '<thead>' +
                '<tr>' +
                '<th>NOMBRE</th>' +
                '<th>FECHA CREACIÃ“N</th>' +
                '<th></th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '' +
                '</tbody>' +
                '</table>');
            if (data.estado == "200") {
                var datos = [];
                if (data['estado'] == 200) {
                    datos = JSON.parse(data['datos']);
                }

                if ($.fn.DataTable.isDataTable('#tblRiskGrupo')) {
                    $('#tblRiskMGrupo').DataTable().destroy();
                }

                $('#tblRiskMGrupo').DataTable({
                    language: {
                        url: 'json/Spanish.json'
                    },
                    "aaData": datos,
                    "bSort": false,
                    "aoColumns": [
                        {"mData": "nombre", "sWidth": "60%"},
                        {"mData": "",
                            mRender: function (data, type, full) {
                                var str = full.fecha_creacion;
                                var res = str.substring(8, 10) + "-" + str.substring(5, 7) + "-" + str.substring(0, 4);
                                return res;
                            },
                            "sWidth": "30%"
                        },
                        {"mData": "",
                            "mRender": function (data, type, full) {
                                if (full.estado == 1) {
                                    nombre_grupo = full.nombre;
                                    id_grupo = full.id;
                                    noConCarga = true;
                                    cont = 1;
                                    return '<div style="text-align: center">'
                                        + '<button id="estado_' + full.id + '" class="btn btn-success" onclick="desactivarTodosRM()" data-toggle="tooltip" title="Activar Optimizador del Motor"><i class="fa fa-check-circle"></i> Desactivar</button>'
                                        + '<div>';
                                } else {
                                    return '<div style="text-align: center">'
                                        + '<button id="estado_' + full.id + '" class="btn btn-primary" onclick="aceptarEliminarRM(' + full.id + ')" data-toggle="tooltip" title="Activar Optimizador del Motor"><i class="fa fa-check-circle-o"></i> Activar</button>'
                                        + '<div>';
                                }
                            },
                            "sWidth": "10%"
                        }
                    ]
                });
                if (id_grupo === 0) {
                    if (noConCarga === false && id_grupo === 0) {
                        $("#txtNombreRM").removeAttr("disabled");
                    } else if (cont == 0) {
                        $("#txtNombreRM").val('');
                    }
                } else {
                    $("#txtNombreRM").val(nombre_grupo);
                }
            } else {
                $("#txtNombreRM").val('');
                $('#tblRiskMGrupo').DataTable().destroy();
                $('#tblRiskMGrupo').DataTable({
                    language: {
                        url: 'json/Spanish.json'
                    }
                });
                $('#tblRiskMGrupo tbody').append('<tr id="trCargando" class="odd" style="text-align: center;"><td valign="top" colspan="7" class="dataTables_empty" style="text-align: center;"><i class="fa fa-spinner fa-spin"></i>  ' + data.mensaje + '</td></tr>');
            }
        }
    });
}

function cargarVarBureau() {
    $("#nombre_varM").empty();
    var html = "<option value=\"0\" selected disabled>Variables</option>";
    var actividad_sel = $('#sl_actividadM option:selected').text().toUpperCase();
    var tipo_var = $('#tipo_var').val();
    for (var bureau in JBUREAUS) {
        if (JBUREAUS[bureau].nombre === actividad_sel) {
            for (var iVar = 0; iVar < JBUREAUS[bureau].variables.length; iVar++) {
                if (JBUREAUS[bureau].variables[iVar].tipo == tipo_var || JBUREAUS[bureau].variables[iVar].tipo == "A" || JBUREAUS[bureau].variables[iVar].tipo == "F") {
                    html = html + '<option value=' + JBUREAUS[bureau].variables[iVar].id + '>' + JBUREAUS[bureau].variables[iVar].descripcion + '</option>';
                }
            }
        }
    }
    $("#nombre_varM").append(html);
}

function cancelarEliminar() {
    $('#NodoPadreM').html("");
    $("#sl_actividadM").prop("disabled", false);
    $("#sl_nodopadreRM").prop("disabled", false);
    $("#btnAgregarNodoRM").prop("disabled", false);
    $("#btnEliminarNodo").prop("disabled", false);
}

function aceptarEliminacion(nodo) {
    var nPadreClonVal = nodo;
    swal({
        title: "Â¿Desea Continuar?",
        text: 'Se eliminaran todos los nodos filiales de este nodo',
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: 'Svl_RiskTierM',
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'delete-risktierM',
                    nodo: nPadreClonVal
                }, success: function (data, textStatus, jqXHR) {
                    if (data.estado === 200) {
                        var ids = data.datos;
                        for (var i = ids.length - 1; i >= 0; i--) {
                            var nod = ids[i];
                            var idTooltip = $('#m_nodo_' + nod).attr('aria-describedby');
                            eliminarNodo("m_nodo_" + nod);
                            $('#m_nodo_' + nod).tooltip('destroy');
                            if (numeros_nodos[0] == nod) {
                                jsPlumb.detachAllConnections('m_nodo_0');
                                jsPlumb.removeAllEndpoints('m_nodo_0');
                                jsPlumb.detach('m_nodo_0');
                                $('#m_nodo_0').remove();
                                limpiarArbolM2();
                            }
                            numeros_nodos.forEach(function (elemento, indice, array) {
                                if (elemento == nod) {
                                    array.splice(indice, 1);
                                }
                            });
                            $('#' + idTooltip).remove();
                        }
                    } else {
                        swal("Fallo en la EliminaciÃ³n", "Error al eliminar Nodo", "error");
                    }
                }
            });
        }
    });
}

//function aceptarEliminacion(nodo) {
//    var nPadreClonVal = nodo;
//    var connectionList = jsPlumb.getConnections({source: "m_nodo_" + nodo});
//    var connectionListTarget = jsPlumb.getConnections({target: "m_nodo_" + nodo});
//
//    if (connectionList.length == 0) {
//        $('#m_nodo_' + nodo).tooltip('destroy');
//        if (connectionList.length > 0 || connectionListTarget.length > 0) {
//            $.ajax({
//                url: 'Svl_RiskTierM',
//                type: 'POST',
//                dataType: 'json',
//                data: {
//                    accion: 'delete-risktierM',
//                    nodo: nPadreClonVal,
//                    id_grupo: id_grupo
//                }, success: function (data, textStatus, jqXHR) {
//                    eliminarNodo("m_nodo_" + nodo);
//                }
//            });
////            }
//        } else {
//            $.ajax({
//                url: 'Svl_RiskTierM',
//                type: 'POST',
//                dataType: 'json',
//                data: {
//                    accion: 'delete-risktierM',
//                    nodo: nPadreClonVal,
//                    id_grupo: id_grupo
//                }, success: function (data, textStatus, jqXHR) {
//                    eliminarNodo("m_nodo_" + nodo);
//                }
//            });
//        }
//        if (numeros_nodos[0] == nodo) {
//            jsPlumb.detachAllConnections('m_nodo_0');
//            jsPlumb.removeAllEndpoints('m_nodo_0');
//            jsPlumb.detach('m_nodo_0');
//            $('#m_nodo_0').remove();
//            limpiarArbolM2();
//        }
//        numeros_nodos.forEach(function (elemento, indice, array) {
//            if (elemento == nodo) {
//                array.splice(indice, 1);
//            }
//        });
//    } else {
//        swal("Fallo en la EliminaciÃ³n", "No se puede eliminar un nodo parental", "error");
//    }
//}

function NuevoGrupo() {
    $('#modalNombreRMGuardar').modal({backdrop: 'static'});
    //$("#txtNombreRM").removeAttr("disabled");
    //$("#divLeftButtonsRM").append("<button class=\"btn btn-primary btn-circle\" id=\"btnCancelarNuevoGrupo\" onclick=\"CancelarNuevoGrupo()\"><i class=\"fa fa-times\"></i> Cancelar Nuevo Grupo</button>");


}

function CancelarNuevoGrupo() {
    go('cmd', [{id: 'recurso', val: '9'}], undefined, 'cmd');
//    location.reload();
}

function aceptarEliminarRM(id_grupo) {
    var tipo = document.getElementById("cmboxTipoM").value;
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'cambiarGrupo',
            id_grupo: id_grupo,
            tipo: tipo
        }, success: function (data, textStatus, jqXHR) {
            if (data['estado'] == 200) {
                swal({
                    title: "Exito en la Activacion",
                    text: data['mensaje'],
                    type: "success",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        limpiarArbolM();
                        mostrarRM(tipo);
                        CargarRiskM(tipo);
                    }
                });
            } else {
                swal("Fallo en la Activacion", data['mensaje'], "error");
            }
        }
    });
}

function desactivarTodosRM() {
    var tipo = document.getElementById("cmboxTipoM").value;
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'desactivarGrupo',
            tipo: tipo
        }, success: function (data, textStatus, jqXHR) {
            if (data['estado'] == 200) {
                swal({
                    title: "Exito en la DesactivaciÃ³n",
                    text: data['mensaje'],
                    type: "success",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        limpiarArbolM();
                        mostrarRM(tipo);
                    }
                });
            } else {
                swal("Fallo en la DesactivaciÃ³n", data['mensaje'], "error");
            }
        }
    });
}

function agregarNodoRM() {
    var nombre = $("#txtNombreRM").val();
    var agregar = true;
    if (id_grupo === 0) {
        if (nombre === '') {
            agregar = false;
        }
    }
    if (agregar) {
        $("#btnAgregarNodoRM").html("<i class=\"fa fa-spinner fa-pulse fa-fw\"></i>  Agregar Nodo");
        $("#btnAgregarNodoRM").prop("disabled", true);

        if (validarNodoSolo()) {
            swal("!AtenciÃ³nÂ¡", "Debe conectar todos los nodos antes de crear uno nuevo", "warning");
            $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
            $("#btnAgregarNodoRM").prop("disabled", false);
        } else {
            var contAux = 1;
            var _padre;
            obs = [];
            var tipo_NoJ = $("#cmboxTipoM option:selected").val();
            if ($("#sl_actividadM option:selected").text() === "Seleccionar") {
                swal("Actividad", "Debe seleccionar una actividad", "error");
                $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                $("#btnAgregarNodoRM").prop("disabled", false);
            } else {
                var ob = new Object();
                ob.idOrigen = $("#sl_actividadM option:selected").val();
                if ($('#nombre_1').length) {
                    ob.nombre = $("#nombre_1 option:selected").text();
                } else {
                    if ($("#nombre_varM option:selected").text() === "") {
                        swal("Tipo", "Debe indicar Tipo", "error");
                        $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                        $("#btnAgregarNodoRM").prop("disabled", false);
                        return;
                    } else if ($("#nombre_varM option:selected").text() === "Variables") {
                        swal("Variables", "Debe indicar la variable", "error");
                        $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                        $("#btnAgregarNodoRM").prop("disabled", false);
                        return;
                    } else {
                        ob.nombre = $("#nombre_varM option:selected").text();
                        ob.idVar = $("#nombre_varM option:selected").val();
                    }
                }
                if ($("#sl_operadorM" + " option:selected").text() === "Operador") {
                    swal("Debe Seleccionar Operador", "", "error");
                    $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                    $("#btnAgregarNodoRM").prop("disabled", false);
                    return;
                } else {
                    ob.operador = $("#sl_operadorM" + " option:selected").val();
                }
                var tipoDato = $("#nombre_varM option:selected").attr('vartipo');
                ob.tipoDato = tipoDato;
                if (tipoDato == "3") {
                    if ($("#sl_ValorMFecha option:selected").text() === "Valor") {
                        swal("Todos Los Valores Son Obligatorios", "", "error");
                        $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                        $("#btnAgregarNodoRM").prop("disabled", false);
                        return;
                    } else {
                        ob.valor = $("#sl_ValorMFecha option:selected").val();
                    }
                } else
                if (tipoDato == "50" || tipoDato == "51") {
                    ob.valor = "";
                    ob.detallesNodo = guardarReglasArray(0);
                } else {
                    if ($('#valor').val() === "") {
                        swal("Todos Los Valores Son Obligatorios", "", "error");
                        $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                        $("#btnAgregarNodoRM").prop("disabled", false);
                        return;
                    } else {
                        ob.valor = $('#valor').val();
                    }
                }
                if (tipoDato == "11") {
                    ob.idRatio = $('#nombre_varM option:selected').attr('varId_ratio');
                } else {
                    ob.idRatio = "0";
                }

                if (ob.valor !== "nada" || ob.operador !== "nada") {
                    obs.push(ob);
                }
                contAux++;
                _padre = "";
                $.ajax({
                    url: 'Svl_RiskTierM',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'insert-arbol-manual',
                        actividad: $("#sl_actividadM").val(),
                        padre: _padre,
                        data: JSON.stringify(obs),
                        id_grupo: id_grupo,
                        nombre: nombre,
                        tipo: tipo_NoJ
                    }, success: function (data, textStatus, jqXHR) {
                        if (data['estado'] == 200) {
                            validarNodos = true;
                            NodosPreCargados = false;
                            if (id_grupo == 0) {
                                mostrarRM(tipo_NoJ);
                                $("#txtNombreRM").attr("disabled", "disabled");
                                $("#divLeftButtonsRM").empty();
                                $("#divLeftButtonsRM").append("<button class=\"btn btn-primary btn-circle\" id=\"btnNuevoGrupo\" onclick=\"NuevoGrupo()\"><i class=\"fa fa-plus\"></i> Nuevo Grupo</button>");
                            }
                            //Agrega nodo a la vista previa
                            var datos = JSON.parse(data['datos']);
                            id_grupo = datos.id_grupo;
                            _ID_NODO = datos.id_nodo;
                            numeros_nodos.push(_ID_NODO);
                            var nPadre = parseInt($("#sl_nodopadreRM option:selected").val());
                            var nombrePila = $('#sl_actividadM option:selected').text();
                            var left = $('#canvas2').scrollLeft() + 20;
                            var top = $('#canvas2').scrollTop() + 20;
                            if (numeros_nodos[0] == _ID_NODO) {
                                top = 167;
                                left = 165;
                            }
                            if (nPadre === 0) {
                                agregarHojaCreate(nombrePila, top, left);
                            } else {
                                agregarHojaHijoCreate(nombrePila, top, left);
                            }
                            $("#sl_nodopadreRM").append('<option value="' + _ID_NODO + '">' + CONT_NODO + '</option>');
                            CONT_NODO++;
                            jsPlumb.repaintEverything();
                            if (numeros_nodos[0] == _ID_NODO) {
                                agregarInicioRMN(_ID_NODO);
                            }
                            $('#valor').val('');
                            $('#sl_operadorM').val(0);
                            $('#nombre_varM').empty();
                            $('#nombre_varM').append('<option value="0" selected="" disabled="">Seleccione</option>');
                            $('#sl_actividadM').val(0);
                            $('#sl_ValorMFecha').val(0);
                            $('#m_nodo_' + _ID_NODO).tooltip({
                                container: 'body'
                            });
                        } else {
                            swal('', data['descripcion'], "error");
                        }
                        $("#btnAgregarNodoRM").html("<i class=\"fa fa-leaf\"></i> Agregar Nodo");
                        $("#btnAgregarNodoRM").prop("disabled", false);
                    }
                });
            }
        }
    } else {
        swal("!AtenciÃ³nÂ¡", "Debe crear un nuevo arbol para continuar", "warning");
    }
}

function CargarRiskM(tipo) {
    var estado, top, left, accionval, accionnombre;
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        async: true,
        data: {
            accion: 'selectRiskTierM',
            tipo: tipo
        }, success: function (data) {
            if (data['estado'] == 200) {
                var datos = JSON.parse(data['datos']);
                var nodos = "(";
                for (var i = 0; i < datos.length; i++) {
                    var obj = datos[i];
                    if (i < (datos.length - 1)) {
                        nodos = nodos + " " + obj.id + ",";
                    } else {
                        nodos = nodos + " " + obj.id + ")";
                    }
                }
                obs = [];
                id_grupo = datos[0].id_group;
                $.ajax({
                    url: 'Svl_RiskTierM',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        accion: 'selectDetallesNodos',
                        nodos: nodos
                    }, success: function (data) {
//                            console.log(data);
                        var allNodos = JSON.parse(data.datos);
                        if (data.estado == 200) {
                            for (var dd in allNodos) {
                                var ob = new Object();
                                ob.nombre = allNodos[dd].nombre;
                                ob.operador = allNodos[dd].operador;
                                ob.valor = allNodos[dd].num_rango;
                                ob.idVar = allNodos[dd].idVar;
                                ob.idOrigen = allNodos[dd].idOrigen;
                                ob.id_nodo = allNodos[dd].id_nodo;
                                ob.estado = allNodos[dd].estado;
                                ob.top = allNodos[dd].pos_top;
                                ob.left = allNodos[dd].pos_left;
                                ob.accionval = allNodos[dd].num_rango;
                                ob.accionnombre = allNodos[dd].nombre;
                                obs.push(ob);
                            }
                        }
                    }
                });
//                for (var d in datos) {
//                    $.ajax({
//                        url: 'Svl_RiskTierM',
//                        type: 'POST',
//                        dataType: 'json',
//                        async: false,
//                        data: {
//                            accion: 'selectDetalleNodo',
//                            idnodo: datos[d].id
//                        }, success: function (data) {
////                            limpiarPizarra();
//                            var datosDetalle = JSON.parse(data['datos']);
//                            if (data['estado'] == 200) {
//                                for (var dd in datosDetalle) {
//                                    var ob = new Object();
//                                    ob.nombre = datosDetalle[dd].nombre;
//                                    ob.operador = datosDetalle[dd].operador;
//                                    ob.valor = datosDetalle[dd].num_rango;
//                                    ob.idVar = datosDetalle[dd].idVar;
//                                    ob.idOrigen = datosDetalle[dd].idOrigen;
//                                    estado = datosDetalle[dd].estado;
//                                    top = datosDetalle[dd].pos_top;
//                                    left = datosDetalle[dd].pos_left;
//                                    accionval = datosDetalle[dd].num_rango;
//                                    accionnombre = datosDetalle[dd].nombre;
//                                    obs.push(ob);
//                                }
//                            }
//                        }
//                    });
                jsPlumb.setSuspendDrawing(true);
                for (var d in datos) {
                    validarNodos = false;
                    NodosPreCargados = true;
                    _ID_NODO = datos[d].id;
                    for (var i = 0; i < obs.length; i++) {
                        if (_ID_NODO === obs[i].id_nodo) {
                            estado = obs[i].estado;
                            top = obs[i].top;
                            left = obs[i].left;
                            accionval = obs[i].accionval;
                            accionnombre = obs[i].accionnombre;
                            break;
                        }
                    }
                    var nPadre = datos[d].id_nodo_padre;
                    var flag = true;
                    var nombrePila = "";
                    BUREAUSM.forEach(function (valor, indice, array) {
                        if (valor.id == datos[d].id_actividad && flag) {
                            flag = false;
                            nombrePila = valor.nombre;
                        }
                    });
                    if (numeros_nodos[0] == _ID_NODO) {
                        if (left > 0 && left < 124) {
                            left = 151;
                        }
                    }
                    if (nPadre === 0) {
                        agregarHoja(nombrePila, top, left);
                    } else {
                        agregarHojaHijo(nombrePila, top, left);
                    }
                    if (accionnombre == "ACCIÃ“N") {
                        cargarAcciones(_ID_NODO, accionval);
                    }
                    numeros_nodos.push(_ID_NODO);
                    noConCarga = false;
                    ConectarNodosRM("m_nodo_" + nPadre, "m_nodo_" + _ID_NODO, estado);
                    $("#sl_nodopadreRM").append('<option value="' + _ID_NODO + '">' + CONT_NODO + '</option>');
                    CONT_NODO++;
                    jsPlumb.repaintEverything();
                    desbloquearUI('limpiarRM');
                    if (numeros_nodos[0] == _ID_NODO) {
                        agregarInicioRM(_ID_NODO, top);
                    }
                    $('#m_nodo_' + _ID_NODO).tooltip({
                        container: 'body'
                    });
                    if (accionnombre == "ACCIÃ“N") {
                        $('#accion_RM' + _ID_NODO).val(accionval);
                    }
                }
                jsPlumb.setSuspendDrawing(false, true);
                noConCarga = true;
            }
            $('#sl_actividadM option').each(function () {
                if ($(this).val() == 0) {
                    $(this).prop('selected', true);
                }
            });
            if (validarNodoSolo()) {
                validarNodos = true;
            }
            NodosPreCargados = false;
        }
    });
}

function limpiarArbolM() {
    bloquearUI('limpiar');
    jsPlumb.detachAllConnections('m_nodo_0');
    jsPlumb.removeAllEndpoints('m_nodo_0');
    jsPlumb.detach('m_nodo_0');
    $('#m_nodo_0').remove();
    for (var nnodo in numeros_nodos) {
        var elemento = "m_nodo_" + numeros_nodos[nnodo];
        jsPlumb.detachAllConnections(elemento);
        jsPlumb.removeAllEndpoints(elemento);
        jsPlumb.detach(elemento);
        $("#" + elemento).remove();
    }

    jsPlumb.deleteEveryEndpoint();
    numeros_nodos = [];
    id_grupo = 0;
    desbloquearUI('limpiar');
}

function limpiarArbolM2() {
    bloquearUI('limpiar');
    jsPlumb.detachAllConnections('m_nodo_0');
    jsPlumb.removeAllEndpoints('m_nodo_0');
    jsPlumb.detach('m_nodo_0');
    $('#m_nodo_0').remove();
    for (var nnodo in numeros_nodos) {
        var elemento = "m_nodo_" + numeros_nodos[nnodo];
        jsPlumb.detachAllConnections(elemento);
        jsPlumb.removeAllEndpoints(elemento);
        jsPlumb.detach(elemento);
        $("#" + elemento).remove();
    }

    jsPlumb.deleteEveryEndpoint();
    numeros_nodos = [];
    desbloquearUI('limpiar');
}

function agregarInicioRM(id_nodo, top) {
    var opcion = "INICIO";

    var html = '&nbsp;&nbsp;' +
        '<div id="m_nodo_0" data-var=0 data-origen=0 class="window jtk-node jtk-endpoint-anchor jtk-connected" style="text-align: center; border: 1px solid #0088cc; padding: 20px; top: ' + (top + 13) + 'px;left: 6px;background-color: #ffffff !important;">\n';
    var html = html + '<strong>' + opcion + '</strong> ' + "";
    var html = html + '</div>';
    $('#canvas2').append(html);
    jsPlumb.addEndpoint("m_nodo_0", sourceEndpoint, {anchor: "RightMiddle", uuid: "RightMiddle"});
    jsPlumb.draggable($("#m_nodo_0"));
    _ultimaRaiz = id_nodo;
    _left += 300;
//    ConectarNodosRM("m_nodo_0", "m_nodo_" + id_nodo, 0);
    jsPlumb.connect({
        source: "m_nodo_0",
        target: "m_nodo_" + id_nodo,
        anchors: ["RightMiddle", "LeftMiddle"],
        connector: ["Straight"],
        reattach: true,
        endpoint: "Blank"
    });
}

function agregarInicioRMN(id_nodo) {
    var opcion = "INICIO";

    var html = '&nbsp;&nbsp;' +
        '<div id="m_nodo_0" data-var=0 data-origen=0 class="window jtk-node jtk-endpoint-anchor jtk-connected" style="text-align: center; border: 1px solid #0088cc; padding: 20px; top: 180px;left: 6px;background-color: #ffffff !important;">\n';
    var html = html + '<strong>' + opcion + '</strong> ' + "";
    var html = html + '</div>';
    $('#canvas2').append(html);
    jsPlumb.addEndpoint("m_nodo_0", sourceEndpoint, {anchor: "RightMiddle", uuid: "RightMiddle"});
    jsPlumb.draggable($("#m_nodo_0"));
    _ultimaRaiz = id_nodo;
    _left += 300;
    jsPlumb.connect({
        source: "m_nodo_0",
        target: "m_nodo_" + id_nodo,
        anchors: ["RightMiddle", "LeftMiddle"],
        connector: ["Flowchart"],
        reattach: false,
        endpoint: "Blank"
    });
}

function agregarHoja(nombrePila, top, left) {
    var opcion;
    var nombre;
    var idVar;
    var idOrigen;
    var nomOrigen;
    var operador;
    var valor;
    for (var i = 0; i < obs.length; i++) {
        if (_ID_NODO === obs[i].id_nodo) {
            opcion = obs[i].nombre;
            nombre = obs[i].nombre;
            idVar = obs[i].idVar;
            idOrigen = obs[i].idOrigen;
            nomOrigen = buscarNombre(idOrigen);
            operador = obs[i].operador;
            valor = obs[i].valor;
            break;
        }
    }
    //ver como se ven con estos colores
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }
    if (nombre === "ACCIÃ“N") {
        var html = '<div id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body" style="padding-right: 10px; padding-top: 10px;">' +
            '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-toggle="tooltip" data-placement="bottom" title="' + nomOrigen + ' / ' + opcion + '" class="tooltipp window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="display: inline-table;text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="editNodo" ondblclick="editarArbol(' + _ID_NODO + ', \'' + idVar + '\', \'' + idOrigen + '\', \'' + operador + '\', \'' + valor + '\')"><div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;">' + opcion + '</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div><br>';
    }

    for (var i = 0; i < obs.length; i++) {
        if (_ID_NODO === obs[i].id_nodo) {
            if (nombre === "ACCIÃ“N") {
                var html = html + '<br>' +
                    '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                    '</select>';
            } else {
                var html = html + '<span class="nomp">' + obs[i].nombre + " " + obs[i].operador + " ";
                var html = html + obs[i].valor + " " + '</span><br>';
            }
        }
    }

    var html = html + '</div></div>';
    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
//    _ultimaRaiz = _ID_NODO;
//    _left += 300;
}

function agregarHojaCreate(nombrePila, top, left) {
    var opcion;
    var nombre;
    var idVar;
    var idOrigen;
    var nomOrigen;
    var operador;
    var valor;
    for (var i = 0; i < obs.length; i++) {
        opcion = obs[i].nombre;
        nombre = obs[i].nombre;
        idVar = obs[i].idVar;
        idOrigen = obs[i].idOrigen;
        nomOrigen = buscarNombre(idOrigen);
        operador = obs[i].operador;
        valor = obs[i].valor;
    }
    //ver como se ven con estos colores
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }
    if (nombre === "ACCIÃ“N") {
        var html = '<div id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body" style="padding-right: 10px; padding-top: 10px;">' +
            '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-toggle="tooltip" data-placement="bottom" title="' + nomOrigen + ' / ' + opcion + '" class="tooltipp window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="display: inline-table;text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="editNodo" ondblclick="editarArbol(' + _ID_NODO + ', \'' + idVar + '\', \'' + idOrigen + '\', \'' + operador + '\', \'' + valor + '\')"><div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;">' + opcion + '</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div><br>';
    }

    for (var i = 0; i < obs.length; i++) {
        if (nombre === "ACCIÃ“N") {
            var html = html + '<br>' +
                '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                '</select>';
        } else {
            var html = html + '<span class="nomp">' + obs[i].nombre + " " + obs[i].operador + " ";
            var html = html + obs[i].valor + " " + '</span><br>';
        }
    }

    var html = html + '</div></div>';
    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
//    _ultimaRaiz = _ID_NODO;
//    _left += 300;
}


function agregarNuevaHoja(nombrePila) {
    var opcion = nombrePila;
    var nombre;
    var idVar;
    var idOrigen;
    for (var i = 0; i < obs.length; i++) {
        if (obs[i].nombre === "ACCIÃ“N") {
            var opcion = obs[i].nombre;
        }
        nombre = obs[i].nombre;
        idVar = obs[i].idVar;
        idOrigen = obs[i].idOrigen;
    }
    //ver como se ven con estos colores
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }
    if (nombre === "ACCIÃ“N") {
        var html = '<div posi="' + _ID_NODO + '" id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: 25px; left: 25px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;">' + opcion + '</span>' +
            '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-var=' + idVar + ' data-origen=' + idOrigen + ' class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: 25px; left: 25px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;">' + opcion + '</span>' +
            '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    }
    for (var i = 0; i < obs.length; i++) {
        if (nombre === "ACCIÃ“N") {
            var html = html + '<br>' +
                '<select id="accion_RM" class="form-control">' +
                '</select>';
        } else {
            var html = html + obs[i].nombre + " " + obs[i].operador + " ";
            var html = html + obs[i].valor + " " + '<br>';
        }
    }
    var html = html + '</div>';
    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        $('#m_nodo_' + _ID_NODO).animate({backgroundColor: '#' + obs[0].operador}, 2500);
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
    q
    _ultimaRaiz = _ID_NODO;
    _left += 300;
}

function mostrarAcciones(id_nodo) {
    $('#cuerpoModal').empty();
    $('#piesModal').empty();
    for (var data in auxDataDatos) {
        if (!$('#cuerpoModal #btnAccion_' + auxDataDatos[data].ID_ACCION).length) {
            $('#cuerpoModal').append('<button id="btnAccion_' + auxDataDatos[data].ID_ACCION + '" class="btn blue btn-block btn-lg" onclick="nodoAccion(\'' + auxDataDatos[data].ID_ACCION + '\',' + id_nodo + ',\'' + auxDataDatos[data].COLOR + '\')" style="background-color: #' + auxDataDatos[data].COLOR + ';">' + auxDataDatos[data].ACCION_NOMBRE + '</button>');
        }
    }
    $('#modalSolicitud').modal("show");
}

function updatePosicion(idNodo) {
    var canvas2 = $('#canvas2');
    var elemento = $("#m_nodo_" + idNodo).position();
    var topp = elemento.top + canvas2.scrollTop();
    var lett = elemento.left + canvas2.scrollLeft();
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'updatePosicion',
            idNodo: idNodo,
            top: topp,
            left: lett
        }
    });
}

function AgregarAccion() {
    var html = '<br>' +
        '<div class="input-group">' +
        '<input id="nuevaAccion" class="form-control" type="text" name="nuevaAccion">' +
        '<span class="input-group-btn">' +
        '<button id="generarAccion" onclick="generarAccion()" class="btn btn-success" type="button">' +
        '<i class="fa fa-plus fa-fw"></i> Generar</button>' +
        '</span>' +
        '</div>';
    $('#cuerpoModal').append(html);
}

function generarAccion() {
    acciones.push($('#nuevaAccion').val());
    crearbtnAccion();
}

function crearbtnAccion() {
    $('#cuerpoModal').empty();
    $('#cuerpoModal').html('<button class="btn green btn-block btn-lg" onclick="nodoAccion(\'Aumentar\',' + id_nodoacc + ')">Aumentar</button>' +
        '<button class="btn blue btn-block btn-lg" onclick="nodoAccion(\'Mantener\',' + id_nodoacc + ')">Mantener</button>' +
        '<button class="btn red btn-block btn-lg" onclick="nodoAccion(\'Extinguir\',' + id_nodoacc + ')">Extinguir</button>');
    for (var acc in acciones) {
        var html = '<button class="btn green btn-block btn-lg" onclick="nodoAccion(\'' + acciones[acc] + '\',' + id_nodoacc + ')">' + acciones[acc] + '</button>';
        $('#cuerpoModal').append(html);
    }
}

function agregarHojaHijo(nombrePila, top, left) {
    var opcion;
    var nombre;
    var idVar;
    var idOrigen;
    var nomOrigen;
    var operador;
    var valor;
    for (var i = 0; i < obs.length; i++) {
        if (_ID_NODO === obs[i].id_nodo) {
            opcion = obs[i].nombre;
            nombre = obs[i].nombre;
            idVar = obs[i].idVar;
            idOrigen = obs[i].idOrigen;
            nomOrigen = buscarNombre(idOrigen);
            operador = obs[i].operador;
            valor = obs[i].valor;
            break;
        }
    }
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }
    if (nombre === "ACCIÃ“N") {
        var html = '<div posi="' + _ID_NODO + '" id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:40px !important"></i>' +
            '<div class="widget-thumb-body" style="padding-right: 10px; padding-top: 10px;">' +
            '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-toggle="tooltip" data-placement="bottom" title="' + nomOrigen + ' / ' + opcion + '" class="tooltipp window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="display: inline-table;text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="editNodo" ondblclick="editarArbol(' + _ID_NODO + ', \'' + idVar + '\', \'' + idOrigen + '\', \'' + operador + '\', \'' + valor + '\')"><div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;">' + opcion + '</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div><br>';
    }
    for (var i = 0; i < obs.length; i++) {
        if (_ID_NODO === obs[i].id_nodo) {
            if (nombre === "ACCIÃ“N" && (obs[i].valor == "" || obs[i].valor == null)) {
                var html = html + '<br>' +
                    '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                    '</select>';
            } else {
                if (nombre === "ACCIÃ“N") {
                    var html = html + '<br>' +
                        '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                        '</select>';
                } else {
                    var html = html + '<span class="nomp">' + obs[i].nombre + " " + obs[i].operador + " ";
                    if ($("#sl_actividadM option:selected").text() === "ANSWER TREE BUSINESS") {
                        var html = html + obs[i].valor + " " + '<br>';
                    } else {
                        var html = html + obs[i].valor + " " + '</span><br>';
                    }
                }
            }
        }
    }

    var html = html + '</div></div>';

    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        $('#m_nodo_' + _ID_NODO).css("border-radius", "100px !important;");
    }
    if (nombre === "ACCIÃ“N") {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
}

function agregarHojaHijoCreate(nombrePila, top, left) {
    var opcion;
    var nombre;
    var idVar;
    var idOrigen;
    var nomOrigen;
    var operador;
    var valor;
    for (var i = 0; i < obs.length; i++) {
        opcion = obs[i].nombre;
        nombre = obs[i].nombre;
        idVar = obs[i].idVar;
        idOrigen = obs[i].idOrigen;
        nomOrigen = buscarNombre(idOrigen);
        operador = obs[i].operador;
        valor = obs[i].valor;
    }
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }
    if (nombre === "ACCIÃ“N") {
        var html = '<div posi="' + _ID_NODO + '" id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:40px !important"></i>' +
            '<div class="widget-thumb-body" style="padding-right: 10px; padding-top: 10px;">' +
            '<span class="widget-thumb-subtitle text-left fuente ' + fontColor + '" style="font-size:13px !important;text-align: center;">CLASIFICACIÃ“N</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-toggle="tooltip" data-placement="bottom" title="' + nomOrigen + ' / ' + opcion + '" class="tooltipp window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="display: inline-table;text-align: center; border: 1px solid #0088cc; padding: 10px; top: ' + top + 'px; left: ' + left + 'px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="editNodo" ondblclick="editarArbol(' + _ID_NODO + ', \'' + idVar + '\', \'' + idOrigen + '\', \'' + operador + '\', \'' + valor + '\')"><div class="widget-thumb-wrap">' +
            //                '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">' +
            '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;text-align: center;">' + opcion + '</span>' +
            //                '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div><br>';
    }
    for (var i = 0; i < obs.length; i++) {
        if (nombre === "ACCIÃ“N" && (obs[i].valor == "" || obs[i].valor == null)) {
            var html = html + '<br>' +
                '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                '</select>';
        } else {
            if (nombre === "ACCIÃ“N") {
                var html = html + '<br>' +
                    '<select id="accion_RM' + _ID_NODO + '" class="form-control" onchange="guardarAccion(' + _ID_NODO + ')">' +
                    '</select>';
            } else {
                var html = html + '<span class="nomp">' + obs[i].nombre + " " + obs[i].operador + " ";
                if ($("#sl_actividadM option:selected").text() === "ANSWER TREE BUSINESS") {
                    var html = html + obs[i].valor + " " + '<br>';
                } else {
                    var html = html + obs[i].valor + " " + '</span><br>';
                }
            }
        }
    }

    var html = html + '</div></div>';

    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        $('#m_nodo_' + _ID_NODO).css("border-radius", "100px !important;")
    }
    if (nombre === "ACCIÃ“N") {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
}

function guardarAccion(nodo) {
    var valor = $('#accion_RM' + nodo).val();
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'updateAccion',
            idNodo: nodo,
            valor: valor
        }
    });
}

function agregarNuevaHojaHijo(nombrePila) {
    var opcion = nombrePila;
    var nombre;
    var idVar;
    var idOrigen;
    for (var i = 0; i < obs.length; i++) {
        if (obs[i].nombre === "ACCIÃ“N" || obs[i].nombre === "TIME OUT Servicios Externos") {
            var opcion = obs[i].nombre;
        }
        nombre = obs[i].nombre;
        idVar = obs[i].idVar;
        idOrigen = obs[i].idOrigen;
    }
    var iconoDiv, cuaColor, fontColor;
    if (nombre != "ACCIÃ“N") {
        switch (parseInt(idOrigen)) {
            case 14:
                iconoDiv = "fa fa-sitemap";
                cuaColor = "bg-green";
                fontColor = "font-green";
                break;
            case 15:
                iconoDiv = "fa fa-table";
                cuaColor = "bg-red";
                fontColor = "font-red";
                break;
            case 16:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-blue";
                fontColor = "font-blue";
                break;
            case 18:
                iconoDiv = "fa fa-sliders";
                cuaColor = "bg-purple";
                fontColor = "font-purple";
                break;
            default:
                iconoDiv = "fa fa-code-fork";
                cuaColor = "bg-grey-cascade";
                fontColor = "font-grey-cascade";
                break
        }
    } else {
        iconoDiv = "fa fa-question-circle";
        cuaColor = "bg-blue-madison";
        fontColor = "font-blue-madison";
    }

    if (nombre === "ACCIÃ“N") {
        var html = '<div posi="' + _ID_NODO + '" id="m_nodo_' + _ID_NODO + '" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: 0px; left: 0px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">';
    } else {
        var html = '<div id="m_nodo_' + _ID_NODO + '" data-var=' + idVar + ' data-origen=' + idOrigen + ' class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 10px; top: 25px; left: 25px; background-color: #ffffff !important;">' +
            '<div class="closeNodo"><p onclick="aceptarEliminacion(' + _ID_NODO + ')" style="float: right;">X</p></div>' +
            '<div class="widget-thumb-wrap">' +
            '<i class="widget-thumb-icon ' + cuaColor + ' ' + iconoDiv + '" style="font-size:35px !important"></i>' +
            '<div class="widget-thumb-body">';
        var html = html + '<span class="widget-thumb-subtitle text-left ' + fontColor + '" style="font-size:13px !important;">' + opcion + '</span>' +
            '<span class="widget-thumb-subtitle text-left" style="font-size:12px !important;">[nodo:' + CONT_NODO + ']</span>' +
            '</div>' +
            '</div>';
    }

    for (var i = 0; i < obs.length; i++) {
        if (nombre === "ACCIÃ“N" && (obs[i].valor == "" || obs[i].valor == null)) {
            var html = html + '<br>' +
                '<select id="accion_RM" class="form-control">' +
                '</select>';
        } else {
            if (nombre === "ACCIÃ“N") {
                if ($("#sl_actividadM option:selected").text() === "ANSWER TREE BUSINESS") {
                    var html = html + obs[i].valor + " " + '<br>';
                } else {
                    var html = html + '<br><strong>' + obs[i].valor + " " + '</strong><br>';
                }
            } else {
                var html = html + obs[i].nombre + " " + obs[i].operador + " ";
                if ($("#sl_actividadM option:selected").text() === "ANSWER TREE BUSINESS") {
                    var html = html + obs[i].valor + " " + '<br>';
                } else {
                    var html = html + obs[i].valor + " " + '<br>';
                }
            }
        }
    }
    var html = html + '</div>';
    $('#canvas2').append(html);
    if (nombre === "ACCIÃ“N") {
        $('#m_nodo_' + _ID_NODO).css("border-radius", "100px !important;")
    }

    if (nombre === "ACCIÃ“N") {
        $('#m_nodo_' + _ID_NODO).animate({backgroundColor: '#' + obs[0].operador}, 2500);
    } else {
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, sourceEndpointRechazo, {anchor: "LeftMiddle", uuid: "LeftMiddle" + _ID_NODO});
        jsPlumb.addEndpoint("m_nodo_" + _ID_NODO, targetEndpoint, {anchor: "TopCenter", uuid: "TopCenter" + _ID_NODO});
    }

    jsPlumb.draggable($("#m_nodo_" + _ID_NODO));
    $("#m_nodo_" + _ID_NODO).draggable({
        scroll: true,
        drag: function () {
            jsPlumb.repaintEverything($(this));
        },
        stop: function (e) {
            var id = $(this).attr('id').split('_');
            scroolPosicion(id[2]);
        }
    });
    cargarAcciones();
}

function agregarSolicitud() {
    if ($("#sl_nodopadreRM option:selected").text() === "RaÃ­z") {
        swal("Ingreso de Solicitud Incorrecta", "No puede crear una Solicitud en la RaÃ­z del Optimizador del Motor, Seleccione un nodo padre", "error");
        return;
    }
    $('#modalSolicitud').modal("show");
    _contChkbox = 0;
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'selectDocumentos'
        }, success: function (data) {
            if (data['estado'] == 200) {
                $('#cuerpoModal').empty();
                var datos = JSON.parse(data['datos']);
                for (var dato in datos) {
                    $('#cuerpoModal').append("<div class=\"col-md-12 col-xs-12\">" +
                        "<div class=\"md-checkbox\">" +
                        "<input type=\"checkbox\" id=\"chk" + _contChkbox + "\" class=\"ms-check\">" +
                        "<label id =\"lbl" + _contChkbox + "\"for=\"chk" + _contChkbox + "\">" +
                        "<span class=\"inc\"></span>" +
                        "<span class=\"check\"></span>" +
                        "<span class=\"box\"></span> " + datos[dato].nombre + "</label>" +
                        "</div>" +
                        "</div>");
                    _contChkbox++;
                }
            } else {
                swal("Falla en la carga", "No se pudo cargar los documentos para seleccionar", "error");
            }
        }
    });
}

function buscarAcciones() {
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'cargar-acciones'
        }, success: function (data, textStatus, jqXHR) {
            auxDataDatos = JSON.parse(data.datos);
        }
    });
}

function cargarAcciones(nodo, val) {
    for (var x in auxDataDatos) {
        $('#accion_RM' + nodo).append('<option value="' + auxDataDatos[x].ID_ACCION + '">' + auxDataDatos[x].ACCION_NOMBRE + '</option>');
    }
    if (val != '0') {
        $('#accion_RM' + nodo).val(val);
        $("#accion_RM" + nodo).find("option[value=" + val + "]").attr('selected', true);
    }
}

function nodoAccionSub(idSub, idNodo, nomSub, COLOR) {
    var idSuba = parseInt(idSub);
    var idNodos = parseInt(idNodo);
    var nomSuba = nomSub;

    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'update-accion',
            nodoid: idNodos,
            subnom: nomSuba,
            color: COLOR
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado == 200) {
                $('#m_nodo_' + idNodos + ' a:first').remove();
                $('#m_nodo_' + idNodos).append('<div id="divDown" ><strong>' + nomSuba + '</strong><div><br>');
                jsPlumb.repaintEverything();
            } else {
                swal('', data.mensaje, "error");
            }
            $('#modalSolicitud').modal("hide");
        }
    });
    $('#m_nodo_' + idNodos).animate({backgroundColor: '#' + COLOR}, 2500);
}

function nodoAccion(ids, padres, COLOR) {
    var padre = parseInt(padres);
    var idNodo = parseInt(ids);
    $.ajax({
        url: 'Svl_RiskTierM',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'insert-accion',
            padre: padre,
            id: idNodo
        }, success: function (data, textStatus, jqXHR) {
            $('#cuerpoModal').empty();
            $('#piesModal').html('<div class="pull-left"><a href="javascript:;" class="btn btn-circle purple" onclick="mostrarAcciones(' + padres + ')"><i class="fa fa-arrow-circle-left"></i> Volver </a></div>');
            var datas = data;
            if (datas.estado == 200) {
                var datos = JSON.parse(data.datos);
                for (var accion in auxDataDatos) {
                    for (var subacc in datos) {
                        if (datos[subacc].ID_SUBACCION === auxDataDatos[accion].ID_SUBACCION) {
                            for (var data in auxDataDatos) {
                                if (!$('#cuerpoModal #btnAccion_' + datos[subacc].ID_SUBACCION).length) {
                                    $('#cuerpoModal').append('<button id="btnAccion_' + datos[subacc].ID_SUBACCION + '" class="btn green btn-block btn-lg" onclick="nodoAccionSub(' + datos[subacc].ID_SUBACCION + ',' + padre + ',\'' + datos[subacc].SUBACCION_NOMBRE + '\',\'' + COLOR + '\')" style="background-color: #' + COLOR + ';">' + datos[subacc].SUBACCION_NOMBRE + '</button>');
                                }
                            }
                        }
                    }
                }
            } else {
                swal('', datas.mensaje, "error");
            }
        }
    });
}

function ConectarNodosRM(Padre, Hijo, estado) {
    var varPadre = Padre.substring(7);
    if (varPadre !== "0") {
//        if ($('#' + Padre + ' strong:first').html() !== "TIME OUT Servicios Externos") {
        jsPlumb.addEndpoint("m_nodo_" + varPadre, sourceEndpointGris, {anchor: "BottomCenter", uuid: "BottomCenter" + varPadre});
//        }
        var connectionList = jsPlumb.getConnections({source: Padre});
        connectionList.length
        if (estado == 1) {
            jsPlumb.connect({
                source: Padre,
                target: Hijo,
                anchors: ["TopCenter", "LeftMiddle"],
                connector: ["Flowchart"],
                reattach: false,
                endpoint: "Blank"
            });
        } else {
            var varPadre = Padre.substring(7);
            if (connectionList.length == 0) {
                jsPlumb.addEndpoint("m_nodo_" + varPadre, sourceEndpointGris, {anchor: "BottomCenter", uuid: "BottomCenter" + varPadre});
                jsPlumb.connect({
                    source: Padre,
                    target: Hijo,
                    anchors: ["BottomCenter", "LeftMiddle"],
                    connector: ["Flowchart"],
                    reattach: false,
                    endpoint: "Blank"
                });
            } else {
                jsPlumb.connect({
                    source: Padre,
                    target: Hijo,
                    anchors: ["BottomCenter", "LeftMiddle"],
                    connector: ["Flowchart"],
                    reattach: false,
                    endpoint: "Blank"
                });
            }
        }
    }
}

function validarNodoSolo() {
    if (numeros_nodos.length > 1) {
        for (var nnodo in numeros_nodos) {
            var nodo = numeros_nodos[nnodo];
            var contConn = jsPlumb.getConnections({source: "m_nodo_" + nodo}).length + jsPlumb.getConnections({target: "m_nodo_" + nodo}).length;
//            var contConn = jsPlumb.getConnections({target:'#m_nodo_'+nodo}).length + jsPlumb.getConnections({source:'#m_nodo_'+nodo}).length;
            if (contConn === 0) {
                return true;
            }
        }
    }
    return false;
}

// botones jquery
$("#btnEliminarNodo").click(function () {
    var html = '<div class="row" style="margin: 0px;">' +
        '<div class="portlet solid blue col-md-4 col-xs-12">' +
        '<div class="portlet-title">' +
        '<div class="caption">' +
        'Selecione Nodo a Eliminar</div>' +
        '</div>' +
        '<div class="portlet-body">' +
        '<div class="row" style="padding-left: 15px; padding-right: 15px;">' +
        '<div id="sl_nodopadreRMClon">' +
        '</div>' +
        '<div class="pull-right">' +
        '<br>' +
        '<button class="btn btn-primary btn-circle" id="btnCancelaEliminar" onclick="cancelarEliminar()"><i class="fa fa-times-circle"></i> Cancelar</button>' +
        '<button class="btn btn-primary btn-circle" id="btnAceptaEliminar" onclick="aceptarEliminacion()"><i class="fa fa-check-circle"></i> Eliminar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#NodoPadreM').html(html);
    $("#sl_nodopadreRM").clone().appendTo("#sl_nodopadreRMClon");
    $("#sl_nodopadreRMClon option[value=0]").each(function () {
        $(this).remove();
    });
    $("#sl_actividadM").val('0');
    $("#sl_nodopadreRM").val('0');
    $("#sl_actividadM").prop("disabled", true);
    $("#sl_nodopadreRM").prop("disabled", true);
    $("#btnAgregarNodoRM").prop("disabled", true);
    $("#btnEliminarNodo").prop("disabled", true);
});

$('#GuardarSaveRM').click(function () {
    $('#txtNombreRM').val($('#txtNombreRMSave').val());
    CONT = 0;
    CONT_NODO = 1;
    CONT_NIVEL = 1;
    jsPlumb.detachAllConnections('m_nodo_0');
    jsPlumb.removeAllEndpoints('m_nodo_0');
    jsPlumb.detach('m_nodo_0');
    $('#m_nodo_0').remove();
    for (var nnodo in numeros_nodos) {
        var elemento = "m_nodo_" + numeros_nodos[nnodo];
        jsPlumb.detachAllConnections(elemento);
        jsPlumb.removeAllEndpoints(elemento);
        jsPlumb.detach(elemento);
        $("#" + elemento).remove();
    }
    jsPlumb.deleteEveryEndpoint();
    numeros_nodos = [];
    id_grupo = 0;
    $('#modalNombreRMGuardar').modal('toggle');
});

$('#btnGuardarSolicitudRM').click(function () {
    if (id_grupo === 0) {
        if ($("#txtNombreRM").val() === '') {
            swal("!AtenciÃ³nÂ¡", "Debe crear un nuevo arbol para continuar", "warning");
        } else {
            swal("!AtenciÃ³nÂ¡", "Debe crear un nodo de variables antes de agregar una clasificaciÃ²n", "warning");
        }
    } else {
        var l = Ladda.create(this);
        l.start();
        if (validarNodoSolo()) {
            swal("!AtenciÃ³nÂ¡", "Debe conectar todos los nodos antes de crear uno nuevo", "warning");
            l.stop();
        } else {
            obs = [];
            var ob = new Object();
            ob.nombre = "ACCIÃ“N";
            ob.operador = "";
            ob.valor = "1";
            ob.idVar = 0;
            ob.idOrigen = 0;
            ob.idRatio = 0;
            obs.push(ob);

            var padre = $("#sl_nodopadreRM option:selected").val();
            var nombre = "";
            var actividad = "10000";
            var tipo_NoJ = $("#cmboxTipoM option:selected").val();
            $.ajax({
                url: 'Svl_RiskTierM',
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'insert-arbol-manual',
                    actividad: actividad,
                    padre: padre,
                    data: JSON.stringify(obs),
                    id_grupo: id_grupo,
                    tipo: tipo_NoJ,
                    nombre: nombre
                }, success: function (data, textStatus, jqXHR) {
                    if (data['estado'] == 200) {
                        validarNodos = true;
                        NodosPreCargados = false;
                        if (id_grupo == 0) {
                            mostrarRM(tipo_NoJ);
                            $("#txtNombreRM").attr("disabled", "disabled");
                            $("#divLeftButtonsRM").empty();
                            $("#divLeftButtonsRM").append("<button class=\"btn btn-primary btn-circle\" id=\"btnNuevoGrupo\" onclick=\"NuevoGrupo()\"><i class=\"fa fa-plus\"></i> Nuevo Grupo</button>");
                        }
                        //Agrega nodo a la vista previa
                        var datos = JSON.parse(data['datos']);
                        id_grupo = datos.id_grupo;
                        _ID_NODO = datos.id_nodo;
                        numeros_nodos.push(_ID_NODO);
                        var nPadre = 0;
                        var nombrePila = $('#sl_actividadM option:selected').text();
                        var left = $('#canvas2').scrollLeft() + 20;
                        var top = $('#canvas2').scrollTop() + 20;
                        if (nPadre === 0) {
                            agregarHojaCreate(nombrePila, top, left);
                        } else {
                            agregarHojaHijoCreate(nombrePila, top, left);
                        }
                        cargarAcciones(_ID_NODO, '0');
                        $("#sl_nodopadreRM").append('<option value="' + _ID_NODO + '">' + CONT_NODO + '</option>');
                        CONT_NODO++;
                        jsPlumb.repaintEverything();
                    } else {
                        swal('', data['descripcion'], "error");
                    }
                    l.stop();
                    $('#modalSolicitud').modal("hide");
                }
            });
        }
    }
});

// js plumb valida nodos segun logica de negocios
jsPlumb.bind('connection', function (info, ev) {
    var chekManu = $('#chboxArbolManual').prop('checked');
    if (chekManu) {
        if (!NodosPreCargados) {
            var con = info.connection;   //this is the new connection
            var nodo_hijo = con.sourceId.substring(7);
            var nodo_padre = con.targetId.substring(7);
            var connectionList = jsPlumb.getConnections({source: con.sourceId});
            var connectionListTarget = jsPlumb.getConnections({target: 'm_nodo_' + nodo_padre});
        }
        if (validarNodos) {
            if (noConCarga) {
                var agregar = true;
                if (connectionList.length >= 2) {
                    if (connectionList[0].endpoints["0"].anchor.type === connectionList[1].endpoints["0"].anchor.type || connectionList.length > 2) {
                        agregar = false;
                        for (var i = 0; i < connectionList.length; i++) {
                            var auxId = connectionList[i].targetId.substring(7);
                            if (auxId === nodo_padre) {
                                jsPlumb.detach(con);
                                break;
                            }
                        }
                    }
                }
                if (connectionListTarget.length === 2) {
                    agregar = false;
                    for (var i = 0; i < connectionListTarget.length; i++) {
                        var auxId2 = connectionListTarget[i].sourceId.substring(7);
                        if (auxId2 === nodo_hijo) {
                            jsPlumb.detach(con);
                            break;
                        }
                    }
                }
                if (agregar) {
                    var nodo_estado;
                    if (connectionList[0].endpoints["0"].anchor.type == "BottomCenter" && connectionList.length === 1) {
                        nodo_estado = 0;
                    } else if (connectionList[0].endpoints["0"].anchor.type == "TopCenter" && connectionList.length === 1) {
                        nodo_estado = 1;
                    } else if (connectionList[1].endpoints["0"].anchor.type == "BottomCenter") {
                        nodo_estado = 0;
                    } else {
                        nodo_estado = 1;
                    }
                    $.ajax({
                        url: 'Svl_RiskTierM',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            accion: 'updateConnection',
                            nodo_hijo: nodo_hijo,
                            nodo_padre: nodo_padre,
                            nodo_estado: nodo_estado
                        }, success: function (data) {
                            jsPlumb.addEndpoint(con.sourceId, sourceEndpointGris, {anchor: "BottomCenter", uuid: "BottomCenter" + nodo_hijo});
                        }
                    });
                }
            } else {
                noConCarga = true;
            }
        } else {
            if (!NodosPreCargados) {
                jsPlumb.detach(con);
            }
        }
    } else {
        if (validarNodos) {
            if (noConCarga) {
                var con = info.connection;   //this is the new connection
                var nodo_hijo = con.sourceId.substring(7);
                var nodo_padre = con.targetId.substring(7);
                var connectionList = jsPlumb.getConnections({source: con.sourceId});
                var nodo_estado;
                if (connectionList[0].endpoints["0"].anchor.type == "BottomCenter" && connectionList.length === 1) {
                    nodo_estado = 0;
                } else if (connectionList[0].endpoints["0"].anchor.type == "TopCenter" && connectionList.length === 1) {
                    nodo_estado = 1;
                } else if (connectionList[1].endpoints["0"].anchor.type == "BottomCenter") {
                    nodo_estado = 0;
                } else {
                    nodo_estado = 1;
                }
            } else {
                noConCarga = true;
            }
        }
    }
});

function eliminarNodo(elemento) {
    jsPlumb.detachAllConnections(elemento);
    jsPlumb.removeAllEndpoints(elemento);
    jsPlumb.detach(elemento);
    $("#" + elemento).remove();
}

function buscarNombre(id) {
    var nombre = '';
    for (var i in BUREAUSM) {
        if (BUREAUSM[i].id == id) {
            if (BUREAUSM[i].tipoBureau == 0 && BUREAUSM[i].nombre != 'SII') {
                nombre = "DATA ENTRY";
            } else {
                nombre = BUREAUSM[i].nombre;
            }
            break;
        }
    }
    return nombre;
}

function scroolPosicion(idNodo) {
    var canvas2 = $('#canvas2');
    var elemento = $("#m_nodo_" + idNodo).position();
    var topp = elemento.top + canvas2.scrollTop();
    var lett = elemento.left + canvas2.scrollLeft();
    $('#canvas2').animate({
        scrollLeft: (lett > canvas2.width() ? lett : 0),
        scrollTop: (topp > canvas2.height() ? topp : 0)
    }, 100);
    updatePosicion(idNodo);
}

function editarArbol(id, idVari, idOri, condicion, valor) {
    $('#modalModifArbolM').modal({backdrop: 'static'});
    $('#actualizarAM').attr('onclick', 'actualizarNodo(' + id + ');');
    $('#sl_actividadMR').val(idOri);
    fillBureauVariablesMR();
    $('#nombre_varMR').val(idVari);
    var tipo = $('#nombre_varMR option:selected').attr('vartipo');
    if (tipo == "3") {
        initOperadorFecha('sl_operadorMR');
        $('#sl_ValorMFechaMR').show();
        $('#valorMR').hide();
        $('#sl_ValorMFechaMR').val(condicion);
    } else if (tipo == "1") {
        initOperadorTexto('sl_operadorMR');
        $('#sl_ValorMFechaMR').hide();
        $('#valorMR').attr('onkeyup', '');
        $('#valorMR').html('');
        $('#sl_operadorMR').val(condicion);
    } else {
        initOperador($('#sl_operadorMR'));
        $('#sl_ValorMFechaMR').hide();
        $('#valorMR').show();
        $('#valorMR').html('');
        $('#valorMR').attr('onkeyup', 'formatoNumero(this);');
        $('#sl_operadorMR').val(condicion);
    }
    $('#valorMR').val(valor);
}

function CaneditarArbol() {
    $('#valorMR').val('');
    $('#sl_operadorMR').val(0);
    $('#nombre_varMR').empty();
    $('#nombre_varMR').append('<option value="0" selected="" disabled="">Seleccione</option>');
    $('#sl_actividadMR').val(0);
    $('#sl_ValorMFechaMR').val(0);
    $('#sl_ValorMFechaMR').hide();
    $('#valorMR').show();
    $('#valorMR').html('');
    $('#valorMR').attr('onkeyup', 'formatoNumero(this);');
    $('#actualizarAM').attr('onclick', '');
}

function actualizarNodo(idNod) {
    $("#actualizarAM").html("<i class=\"fa fa-spinner fa-pulse fa-fw\"></i>  Actualizando");
    $("#actualizarAM").prop("disabled", true);
    var idOri = $("#sl_actividadMR option:selected").val();
    var idVar = $("#nombre_varMR option:selected").val();
    var nomVari = $("#nombre_varMR option:selected").text();
    var nomOri = $("#sl_actividadMR option:selected").text();
    var opera = $("#sl_operadorMR option:selected").val();
    var tipoDato = $("#nombre_varMR option:selected").attr('vartipo');
    var valor, ratio;
    if ($("#sl_actividadMR option:selected").text() === "Seleccionar") {
        swal("Origen Variable", "Debe seleccionar una Origen Variable", "error");
        $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
        $("#actualizarAM").prop("disabled", false);
        return;
    } else if ($("#nombre_varMR option:selected").text() === "Variables") {
        swal("Variables", "Debe indicar la variable", "error");
        $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
        $("#actualizarAM").prop("disabled", false);
        return;
    } else if ($("#sl_operadorMR option:selected").text() === "Operador") {
        swal("Debe Seleccionar Operador", "", "error");
        $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
        $("#actualizarAM").prop("disabled", false);
        return;
    } else {
        if (tipoDato == "3") {
            if ($("#sl_ValorMFechaMR option:selected").text() === "Valor") {
                swal("Todos Los Valores Son Obligatorios", "", "error");
                $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
                $("#actualizarAM").prop("disabled", false);
                return;
            } else {
                valor = $("#sl_ValorMFechaMR option:selected").val();
            }
        } else {
            if ($('#valorMR').val() === "") {
                swal("Todos Los Valores Son Obligatorios", "", "error");
                $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
                $("#actualizarAM").prop("disabled", false);
                return;
            } else {
                valor = $('#valorMR').val();
            }
        }
        if (tipoDato == "11") {
            ratio = $('#nombre_varMR option:selected').attr('varId_ratio');
        } else {
            ratio = "0";
        }
        $.ajax({
            url: 'Svl_RiskTierM',
            type: 'POST',
            dataType: 'json',
            data: {
                accion: 'actualizar-arbol-manual',
                id_nodo: idNod, idOri: idOri, idVar: idVar, nomVari: nomVari, opera: opera, valor: valor, ratio: ratio
            }, success: function (data, textStatus, jqXHR) {
                if (data.estado === 200) {
                    $('#m_nodo_' + idNod + ' div div div span').html(nomVari);
                    $('#m_nodo_' + idNod + ' .editNodo').attr('ondblclick', 'editarArbol(' + idNod + ',\'' + idVar + '\',\'' + idOri + '\',\'' + opera + '\',\'' + valor + '\');');
                    $('#m_nodo_' + idNod + ' .nomp').html(nomVari + ' ' + opera + ' ' + valor);
                    $('#m_nodo_' + idNod).attr('data-original-title', nomOri + ' / ' + nomVari);
                    $('#actuCanceMR').click();
                    swal('Datos Actualizados', 'Correctamente', "success");
                } else {
                    swal('Â¡ERROR!', 'No se pudo Actualizar el Nodo', "error");
                }
                $("#actualizarAM").html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>   Actualizar');
                $("#actualizarAM").prop("disabled", false);
            }
        });
    }
}
var OPERADORDATE = {
    1: {detalle: '1', valor: '1'},
    3: {detalle: '3', valor: '3'},
    6: {detalle: '6', valor: '6'},
    12: {detalle: '12', valor: '12'},
    24: {detalle: '24', valor: '24'}
};


var OPERADORSTRING = {
    40: {detalle: 'Contiene', valor: '<='},
    41: {detalle: 'No Contiene', valor: '>='},
    42: {detalle: 'Igual a', valor: '=='},
    43: {detalle: 'Distinto de', valor: '!='}
};
var OPERADORACCIONSUM = {
    50: {detalle: 'Suma', valor: 'SUMA'},
    51: {detalle: 'Promedio', valor: 'PROM'}
};
var OPERADORACCIONPRO = {
    52: {detalle: 'Primero', valor: 'PRIM'},
    53: {detalle: 'Ultimo', valor: 'ULTI'}
};
var OPERADOR_NUM = {
    28: {detalle: '>', valor: '>'},
    29: {detalle: '<', valor: '<'},
    30: {detalle: '=', valor: '=='},
    31: {detalle: '!=', valor: '!='},
    32: {detalle: '>=', valor: '>='},
    33: {detalle: '<=', valor: '<='}
};

function obtenerVariablesHijo() {
    $.ajax({
        url: 'Svl_Informacion',
        type: 'POST',
        dataType: 'json',
        data: {
            code: 'obtenerVariablesHijo'
        },
        success: function (data) {
            if (data.estado == 200) {
                _variablesHijo = data.datos;
            }
        }
    });
}
function guardarAccionX(cont) {
    if (ListaReglasPadre[cont] == undefined)
        return false;

    var indice = (objIndices[ListaReglasPadre[cont]]) - 1;
    var obj = new Object();
    var operador = $("#accion_regla_" + ListaReglasPadre[cont] + "  option:selected").attr("simbolo");
    var variable_accion = $("#select_variable_accion_" + ListaReglasPadre[cont] + "  option:selected").attr("simbolo");

    obj.VAR_NOMBRE = variable_accion;
    obj.OPERADOR = operador;
    return obj;
}

function validarGuardarReglas(cont) {
    if (ListaReglasPadre[cont] == undefined)
        return false;

    var indice = (objIndices[ListaReglasPadre[cont]]);

    var respuesta = true;
    for (var j = 1; j < indice; j++) {
        var obj = new Object();
        var variable = $("#variable_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").attr("simbolo");
        var operador = $("#operador_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").attr("simbolo");
        var valor = $("#valor_regla_" + ListaReglasPadre[cont] + "_" + j).val();
        var condicion = $("#condicion_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").text();
        var tipo_dato = $("#tipo_dato_regla_" + ListaReglasPadre[cont] + "_" + j).val();

        if (valor == undefined || valor == '') {
            respuesta = false;
        }
    }
    return respuesta;

}

function guardarReglas(cont) {

//    for (var i in ListaReglasPadre)
//    {
    if (ListaReglasPadre[cont] == undefined)
        return false;

    var indice = (objIndices[ListaReglasPadre[cont]]);

    var respuesta = new Array();
    for (var j = 1; j < indice; j++) {
        var obj = new Object();
        var variable = $("#variable_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").attr("simbolo");
        var operador = $("#operador_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").attr("simbolo");
        var valor = $("#valor_regla_" + ListaReglasPadre[cont] + "_" + j).val();
        var condicion = $("#condicion_regla_" + ListaReglasPadre[cont] + "_" + j + "  option:selected").text();
        var tipo_dato = $("#tipo_dato_regla_" + ListaReglasPadre[cont] + "_" + j).val();

        if (j == (indice - 1) && condicion == 'seleccione') {
            condicion = '';
        }

        if (valor == undefined) {
            swal('CondiciÃ³n para ATB', 'Debe seleccionar la condicion', 'warning');
            return false;
        }


        obj.VAR_NOMBRE = variable;
        obj.OPERADOR = operador;
        obj.VALOR = valor;
        obj.CONDICION = condicion;
        obj.TIPO_DATO = tipo_dato;


        respuesta.push(obj);

    }
    return respuesta;

}
function getReglasJSArray(data) {
    var resp = "";
    try {
        var JSArray = JSON.parse(data)
        var sw = true;
        for (var i in JSArray) {
            if (JSArray[i].CONDICION != 'Continuar')
            {
                resp += (sw ? "[" : "") + JSArray[i].VAR_NOMBRE + ' ' + JSArray[i].OPERADOR + ' ' + JSArray[i].VALOR + ' ' + JSArray[i].CONDICION;
                sw = false;
            } else
                resp += (sw ? "[" : "") + JSArray[i].VAR_NOMBRE + ' ' + JSArray[i].OPERADOR + ' ' + JSArray[i].VALOR + ']';
        }
    } catch (e)
    {
    }
    return resp;
}

function getReglasJSAccion(data) {
    var resp = "";
    try {
        var JSArray = JSON.parse(data)
        var sw = true;
        resp += (JSArray.VAR_NOMBRE === undefined ? "" : JSArray.VAR_NOMBRE) + " " + (JSArray.OPERADOR === undefined ? "" : getTipoDatoAccion(JSArray.OPERADOR));
    } catch (e)
    {
    }
    return resp;
}

function getTipoDato(tipo_dato)
{
    var res = "";
    switch (tipo_dato) {
        case 1://
        {
            return "[TEXTO]";
            break;
        }
        case 2://
        {
            return "[NÃšMERO]";
            break;
        }
        case 3://
        {
            return "[FECHA]";
            break;
        }
        case 10://
        {
            return "[FECHA]";
            break;
        }
        case 50://
        {
            return "[ARRAY]";
            break;
        }
        case 51://
        {
            return "[ARRAY]";
            break;
        }
    }
    switch (tipo_dato) {
        case "1"://
        {
            return "[TEXTO]";
            break;
        }
        case "2"://
        {
            return "[NÃšMERO]";
            break;
        }
        case "3"://
        {
            return "[FECHA]";
            break;
        }
        case "10"://
        {
            return "[FECHA]";
            break;
        }
        case "50"://
        {
            return "[ARRAY]";
            break;
        }
        case "51"://
        {
            return "[ARRAY]";
            break;
        }
    }
    return res;
}
function getTipoDatoAccion(str)
{
    var res = "";
    switch (str) {
        case "SUMA"://
        {
            return "SUMA";
            break;
        }
        case "PROM"://
        {
            return "PROMEDIO";
            break;
        }
        case "PRIM"://
        {
            return "PRIMERO";
            break;
        }
        case "ULTI"://
        {
            return "ULTIMO";
            break;
        }
    }
    return res;
}

function reiniciar() {
    delete ListaReglasPadre[CONT];
    $("#contenedorReglas_" + CONT).remove();
}

function actuaDate(cont) {
//    $('#sel2_' + cont).val(29);
    $('#txtMonto_' + cont).val($('#selFecha_' + cont).val());
}
function initOperadorDate(select) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    for (var i in OPERADORDATE) {
        if (i == 1) {
            $(select).append('<option value="' + i + '" simbolo="' + OPERADORDATE[i].valor + '">' + OPERADORDATE[i].detalle + ' Mes </option>');
        } else {
            $(select).append('<option value="' + i + '" simbolo="' + OPERADORDATE[i].valor + '">' + OPERADORDATE[i].detalle + ' Meses </option>');
        }
    }
}
function eliminarReglas() {
    $("#div_regla_arreglo_0").hide();
    ListaReglasPadre = new Object();
}
function actuaDateRegla(idVariable) {
//    $('#sel2_' + cont).val(29);
    $('#valor_regla_' + idVariable).val($('#fecha_regla_' + idVariable).val());
}
function validaTipoDatoAccion(idVariable) {
    var tipoDato = 0;
    var IDVariable = $("#select_variable_accion_" + idVariable).val();
    for (var i in _variablesHijo) {
        if (_variablesHijo[i].ID == IDVariable)
        {
            tipoDato = _variablesHijo[i].TIPO_DATO;
            break;
        }
    }
    switch (tipoDato) {
        case "2"://INT
        {
            operadorAccionSum("#accion_regla_" + idVariable);
            initOperador($("#sl_operadorM"));
            mostrarFecha(false, idVariable);
            mostrarInput(true, idVariable);
            $('#valor').show();
            break;
        }
        case "3"://FECHA
        {
            operadorAccionPro("#accion_regla_" + idVariable);
            initOperadorFecha('sl_operadorM');
            $('#sl_ValorMFecha').show();
            $('#valor').hide();
            mostrarFecha(false, idVariable);
            mostrarInput(true, idVariable);
            break;
        }
        default://STRING
        {
            if (INDEX_PADRE > 0) {
                swal("Variable tipo Texto", "No puede operar variables de tipo numerico con una de tipo texto, seleccione alguna variable de tipo numerico o selecciones como primera variable la de tipo texto", "warning");
                initVariableHijo($('#select_variable_accion_' + INDEX_PADRE));
                break;
            } else
            if (INDEX_PADRE == 0) {
                $('#btnAgregarVariable').hide();
            }
            operadorAccionPro("#accion_regla_" + idVariable);
            operadorString("#sl_operadorM");
            mostrarFecha(false, idVariable);
            mostrarInput(true, idVariable);
            $('#valor').show();
            break;
        }
    }
}
function validaTipoDato(idVariable) {
    var tipoDato = 0;
    var IDVariable = $("#variable_regla_" + idVariable).val();
    for (var i in _variablesHijo) {
        if (_variablesHijo[i].ID == IDVariable)
        {
            tipoDato = _variablesHijo[i].TIPO_DATO;
            break;
        }
    }
    $("#tipo_dato_regla_" + idVariable).val(tipoDato);
    switch (tipoDato) {
        case "1":
        {
            operadorString("#operador_regla_" + idVariable);
            mostrarFecha(false, idVariable);
            mostrarInput(true, idVariable);
            break;
        }
        case "2":
        {
            initOperadorNum("#operador_regla_" + idVariable);
            mostrarFecha(false, idVariable);
            mostrarInput(true, idVariable);
            break;
        }
        case "3":
        {
            mostrarFecha(true, idVariable);
            mostrarInput(false, idVariable);
            operadorFecha("#operador_regla_" + idVariable);
            break;
        }
    }
    $('#valor_regla_' + idVariable).val("");
}
function mostrarInput(sw, idVariable) {
    if (sw)
        $("#valor_regla_" + idVariable).show();
    else
        $("#valor_regla_" + idVariable).hide();
}

function mostrarFecha(sw, idVariable) {
    if (sw)
        $("#div_regla_select_" + idVariable).show();
    else
        $("#div_regla_select_" + idVariable).hide();
}
function operadorString(select) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    for (var i in OPERADORSTRING) {
        $(select).append('<option value="' + i + '" simbolo="' + OPERADORSTRING[i].valor + '">' + OPERADORSTRING[i].detalle + '</option>');
    }
}
function operadorFecha(select) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    for (var i in OPERADORFECHA) {
        $(select).append('<option value="' + i + '" simbolo="' + OPERADORFECHA[i].valor + '">' + OPERADORFECHA[i].detalle + '</option>');
    }
}
function operadorAccionSum(select) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    for (var i in OPERADORACCIONSUM) {
        $(select).append('<option value="' + i + '" simbolo="' + OPERADORACCIONSUM[i].valor + '">' + OPERADORACCIONSUM[i].detalle + '</option>');
    }
}
function operadorAccionPro(select) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    for (var i in OPERADORACCIONPRO) {
        $(select).append('<option value="' + i + '" simbolo="' + OPERADORACCIONPRO[i].valor + '">' + OPERADORACCIONPRO[i].detalle + '</option>');
    }
}
function initVariableHijo(select, _varFija) {
    $(select).empty();
    var texto = (_esEjeXoY == 0) ? $('#nombre_varM' + ' option:selected').text() : (_esEjeXoY == 1) ? $('#cmboxEjeX' + ' option:selected').text() : $('#cmboxEjeY' + ' option:selected').text();
    var valor = (_esEjeXoY == 0) ? $('#nombre_varM').val() : (_esEjeXoY == 1) ? $('#cmboxEjeX').val() : $('#cmboxEjeY').val();

    if (_varFija == "true") {
        var text = texto;
        var val = valor;
        $(select).prop('disabled', true);
        $(select).append('<option selected disabled value="' + val + '" simbolo="' + text + '">' + text + '</option>');
    } else {
        $(select).append('<option value="0">Seleccione</option>');
        for (var i in _variablesHijo) {
            if (_variablesHijo[i].VARIABLE_PADRE == valor) {
                $(select).append('<option value="' + _variablesHijo[i].ID + '" simbolo="' + _variablesHijo[i].NOMBRE + '">' + _variablesHijo[i].NOMBRE + " " + getTipoDato(_variablesHijo[i].TIPO_DATO) + '</option>');
            }
        }
    }
}
function initVariableHijoAccion(select, _varFija) {
    $(select).empty();
    var texto = (_esEjeXoY == 0) ? $('#nombre_varM' + ' option:selected').text() : (_esEjeXoY == 1) ? $('#cmboxEjeX' + ' option:selected').text() : $('#cmboxEjeY' + ' option:selected').text();
    var valor = (_esEjeXoY == 0) ? $('#nombre_varM').val() : (_esEjeXoY == 1) ? $('#cmboxEjeX').val() : $('#cmboxEjeY').val();

    if (_varFija == "true") {
        var text = texto;
        var val = valor;
        $(select).prop('disabled', true);
        $(select).append('<option selected disabled value="' + val + '" simbolo="' + text + '">' + text + '</option>');
    } else {
        $(select).append('<option value="0">Seleccione</option>');
        for (var i in _variablesHijo) {
            if (_variablesHijo[i].VARIABLE_PADRE == valor) {
                if (_esEjeXoY == 0)
                    $(select).append('<option value="' + _variablesHijo[i].ID + '" simbolo="' + _variablesHijo[i].NOMBRE + '">' + _variablesHijo[i].NOMBRE + " " + getTipoDato(_variablesHijo[i].TIPO_DATO) + '</option>');
                else {

                    if (_variablesHijo[i].TIPO_DATO == 2)
                    {
                        $(select).append('<option value="' + _variablesHijo[i].ID + '" simbolo="' + _variablesHijo[i].NOMBRE + '">' + _variablesHijo[i].NOMBRE + " " + getTipoDato(_variablesHijo[i].TIPO_DATO) + '</option>');
                    }
                }
            }
        }
    }
}
var CONTRegla = 1;
var ArrayContador;
ListaReglasPadre = new Object();
objIndices = new Object();
INDEX_PADRE = 0;
function mostrarReglasRray() {
    indexPadre = INDEX_PADRE;
    if (ListaReglasPadre[indexPadre] == undefined) {
        ListaReglasPadre[indexPadre] = indexPadre;
        $("#contenedorReglas").append('<div id="contenedorReglas_' + indexPadre + '"></div>');
        objIndices[indexPadre] = 1;
        var i = 0;
        for (var i in ListaReglasPadre) {
            if (ListaReglasPadre[i] != indexPadre) {
                $("#contenedorReglas_" + ListaReglasPadre[i]).hide();
            } else {
                agregarReglasArray()
                $("#contenedorReglas_" + ListaReglasPadre[i]).show();
            }
            i++;
        }
    } else {
        var i = 0;
        for (var i in ListaReglasPadre) {
            if (ListaReglasPadre[i] != indexPadre) {
                $("#contenedorReglas_" + ListaReglasPadre[i]).hide();
            } else
                $("#contenedorReglas_" + ListaReglasPadre[i]).show();
            i++;
        }
    }
    mostrarModalVar();

}
function mostrarModalVar(modal) {
    if (modal != undefined)
    {
        if (modal == 0)
        {
            $("#contenedorReglas_" + modal).show();
            $("#contenedorReglas_" + 1).hide();
        } else

        {
            $("#contenedorReglas_" + modal).show();
            $("#contenedorReglas_" + 0).hide();
        }
    }
    $('#modalAgregarReglasaRray').modal({backdrop: "static"});
    $('#modalAgregarReglasaRray').modal('show');

}
function eliminarReglasArray() {
    if (objIndices[INDEX_PADRE] > 2)
    {
        if ($('.contVariable:eq(' + INDEX_PADRE + ')').attr('varfija') === 'true') {
            $("#condicion_regla_" + INDEX_PADRE + "_" + (objIndices[INDEX_PADRE] - 1)).val("");
            $("#condicion_regla_" + INDEX_PADRE + "_" + (objIndices[INDEX_PADRE] - 2)).hide();
            $("#lbl_condicion_regla_" + INDEX_PADRE + "_" + (objIndices[INDEX_PADRE] - 2)).hide();
        }

        $("#div_regla_" + INDEX_PADRE + "_" + (objIndices[INDEX_PADRE] - 1)).remove();
        objIndices[INDEX_PADRE] = (objIndices[INDEX_PADRE] - 1);
    }

}
function mostrarAccion() {
    $("#div_accion_" + INDEX_PADRE).remove();
    var selec = '<select class="form-control cmboxHastaFecha valid" id="accion_regla_' + INDEX_PADRE + '">'
        + '</select> ';
    var selectVariableAccion = '<select class="form-control cmboxHastaFecha valid" id="select_variable_accion_' + INDEX_PADRE + '" onchange="validaTipoDatoAccion(\'' + INDEX_PADRE + '\');">'
        + '</select> ';

    $("#contenedorReglas_" + INDEX_PADRE).append('<div id ="div_accion_' + INDEX_PADRE + '" class="col-lg-12 col-md-12 margin-bottom-10" style="" ><div class="col-lg-6"><label>Variable</label>' + selectVariableAccion + '</div><div class="col-lg-6"><label>AcciÃ³n</label>' + selec + '</div></div>')
    initVariableHijoAccion($('#select_variable_accion_' + INDEX_PADRE));
}

function agregarReglasArray() {
    var _varFija = $('#contVariables').val();
    try {
        if ($("#condicion_regla_" + INDEX_PADRE + "_" + (objIndices[INDEX_PADRE] - 1)).val() == 3) {
            mostrarAccion();
            return;
        }
    } catch (e) {
        console.log(e);
    }
    $("#div_accion_" + INDEX_PADRE).remove();
    var indexPadre = INDEX_PADRE;
    CONTRegla = objIndices[indexPadre];

    $('#condicion_regla_' + indexPadre + "_" + (CONTRegla - 1)).show();
    $('#lbl_condicion_regla_' + indexPadre + "_" + (CONTRegla - 1)).show();

    var html = '<div class="col-lg-12 margin-top-10 margin-bottom-10 " id="div_regla_' + indexPadre + "_" + CONTRegla + '" class="class_regla" varFija="' + (_varFija === 'true') + '" > '
        + '<div class="col-md-4" >'
        + ' <label>Variable</label>'
        + ' <select class="form-control" id="variable_regla_' + indexPadre + "_" + CONTRegla + '" onchange="validaTipoDato(\'' + indexPadre + "_" + CONTRegla + '\');">'
        + ' </select>'
        + ' </div>'
        + ' <div class="col-md-2" >'
        + ' <label>Operador</label>'
        + ' <select class="form-control" id="operador_regla_' + indexPadre + "_" + CONTRegla + '">'
        + ' </select>'
        + ' </div>'
        + ' <div class="col-md-3"  >'
        + ' <label>Valor</label>'
        + ' <input name="" id="valor_regla_' + indexPadre + "_" + +CONTRegla + '" type="text" class="form-control text" required="" aria-required="true"  onkeyup="return formatoInput(this)"> '
        + '<div id="div_regla_select_' + indexPadre + "_" + CONTRegla + '" style="display:none;">'
        + '<select class="form-control cmboxHastaFecha valid" id="fecha_regla_' + indexPadre + "_" + CONTRegla + '" onchange="actuaDateRegla(\'' + indexPadre + "_" + CONTRegla + '\')" aria-invalid="false">'
        + '<option value="0">Seleccione</option>'
        + '<option value="1" simbolo="1">1 Mes </option>'
        + '<option value="3" simbolo="3">3 Meses </option>'
        + '<option value="6" simbolo="6">6 Meses </option>'
        + '<option value="12" simbolo="12">12 Meses </option>'
        + '<option value="24" simbolo="24">24 Meses </option>'
        + '</select> '
        + '</div>'
        + '</div>'
        + '<div class="col-md-3" >'
        + '<label ' + ((_varFija === 'true') ? 'style="display:none;"' : '') + ' id="lbl_condicion_regla_' + indexPadre + "_" + CONTRegla + '">AcciÃ³n</label>'
        + '<select ' + ((_varFija === 'true') ? 'style="display:none;"' : '') + ' class="form-control" id="condicion_regla_' + indexPadre + "_" + CONTRegla + '">'
        + '<option value="" disabled="" selected="">seleccione</option>'
        + '<option value="1">Y</option>'
        + ' <option value="2">O</option>'
        + ((_varFija === 'true') ? '' : '<option value="3">Continuar</option>')
        + '    </select>'
        + ' <input name="" id="tipo_dato_regla_' + indexPadre + "_" + +CONTRegla + '" type="hidden" value="1"> '
        + ' </div>'
        + '</div>';
    +'<div class="row">';
    +'</div>';
    $("#contenedorReglas_" + indexPadre).append(html);
    initOperador($('#operador_regla_' + indexPadre + "_" + CONTRegla), _varFija);
    initOperadorDate($('#fecha_regla_' + indexPadre + "_" + CONTRegla));
    initVariableHijo($('#variable_regla_' + indexPadre + "_" + CONTRegla), _varFija);
    CONTRegla++;
    objIndices[indexPadre] = CONTRegla;
}
function formatoInput(input) {
    var valor = $(input).val().toUpperCase();
    if (/^([0-9])*$/.test(valor.replace(/\./g, '')) && valor != "") {
        valor = $(input).val().replace(/\./g, '');
        $(input).val(number_format(valor, '', ',', '.'));
    } else {
        $(input).val(valor);
    }

}
function initOperadorNum(select, _varFija) {
    $(select).empty();
    $(select).append('<option value="0">Seleccione</option>');
    if (_varFija != undefined && _varFija) {
        operadorString(select);
    } else {
        for (var i in OPERADOR_NUM) {
            $(select).append('<option value="' + i + '" simbolo="' + OPERADOR_NUM[i].valor + '">' + OPERADOR_NUM[i].detalle + '</option>');
        }
    }
}
function validaDatoVarAux(select, _esEjeXOY)
{
    INDEX_PADRE = _esEjeXOY == 1 ? 0 : 1;
    _esEjeXoY = _esEjeXOY;
    validaDatoVar(select);
}