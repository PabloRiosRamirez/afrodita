var _idTemporal = 0;
var _arrCoordenadasIngresadas = new Array();
var _idIngresos = 0;
var _arrColumnRows = new Array();
var obConfig = {};
var RISKTIER = undefined;
var BUREAUS = [];
var industria = 0;
var _TIPO;

$(document).ready(function () {
    obtenerVariablesHijo();
    $('#cmboxEjeX').select2({
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
    $('#cmboxEjeY').select2({
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
});

/**
 * Funcion que consulta la moneda que pertenece a la empresa
 * @returns {undefined}
 */
function obtenerMonedaRT() {
    $.ajax({
        url: 'Svl_Informacion',
        type: 'POST',
        dataType: 'json',
        data: {
            code: 'obtenerMoneda'
        },
        success: function (data) {
            if (data.estado == 200) {
                _Moneda = data.datos;
                obtenerBureaus();
            }
        }
    });
}

function TipoRisTier(id) {
    $('#cmboxOrigenEjeX').html("");
    $('#cmboxOrigenEjeY').html("");
    $('#cmboxEjeX').html("");
    $('#cmboxEjeY').html("");

    $('#cmboxOrigenEjeX').append('<option value="0" disabled="" selected="">Seleccione</option>');
    $('#cmboxOrigenEjeY').append('<option value="0" disabled="" selected="">Seleccione</option>');
    $('#cmboxEjeX').append('<option value="0" disabled="" selected="">Seleccione</option>');
    $('#cmboxEjeY').append('<option value="0" disabled="" selected="">Seleccione</option>');
    // Se actualiza el tipo de persona
    if (id == 1) {
        _TIPO = 'N';
    } else {
        _TIPO = 'J';
    }
    obtenerMonedaRT();
}

function obtenerBureaus() {

    $.ajax({
        url: 'Svl_Informacion',
        type: 'POST',
        dataType: 'json',
        data: {
            code: 'consultarIndustria'
        },
        success: function (data) {
            var nombre_ind = data.datos.IND_NOMBRE;
            $.ajax({
                url: 'Svl_Variable',
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'listarPorBureauNJxRecurso',
                    sw: "true",
                    recurso: "9"
                }, success: function (data, textStatus, jqXHR) {
                    $('#cmboxOrigenEjeX').html("");
                    $('#cmboxOrigenEjeY').html("");
                    if (data.estado === 200) {
                        BUREAUS = data.datos;
                        var flag = 0;
                        if (_Moneda == 'COP') {
                            flag = 2;
                        } else if (_Moneda == 'S') {
                            flag = 3;
                        } else {
                            flag = 1;
                        }
                        for (var i in data.datos) {
                            if (BUREAUS[i].tipo != 2 && $("#tipo").val() == 1) {
                                if ((flag == 1 && (BUREAUS[i].id != 20 && BUREAUS[i].id != 19)) || (flag == 2 && BUREAUS[i].id != 3) || (flag == 3 && BUREAUS[i].id != 2)) {
                                    if ((nombre_ind.toUpperCase() == data.datos[i].nombre || data.datos[i].tipoBureau == 1 || data.datos[i].nombre == "SII" || data.datos[i].nombre == "PREVIRED"
                                        || (BUREAUS[i].id == 19 && flag == 2) || (BUREAUS[i].id == 20 && flag == 3) || data.datos[i].tipoBureau == 10 )) {
                                        var nombre;
                                        if (nombre_ind.toUpperCase() == data.datos[i].nombre) {
                                            nombre = "DATA ENTRY";
                                        } else {
                                            nombre = BUREAUS[i].nombre;
                                        }
                                        $('#cmboxOrigenEjeX').append('<option value="' + data.datos[i].id + '">' + nombre + '</option>');
                                        $('#cmboxOrigenEjeY').append('<option value="' + data.datos[i].id + '">' + nombre + '</option>');
                                    }
                                }
                            } else if (BUREAUS[i].tipo != 1 && $("#tipo").val() == 2) {
                                if ((flag == 1 && (BUREAUS[i].id != 20 && BUREAUS[i].id != 19)) || (flag == 2 && BUREAUS[i].id != 3) || (flag == 3 && BUREAUS[i].id != 2)) {
                                    if ((nombre_ind.toUpperCase() == data.datos[i].nombre || data.datos[i].tipoBureau == 1 || data.datos[i].nombre == "SII" || data.datos[i].nombre == "PREVIRED"
                                        || (BUREAUS[i].id == 19 && flag == 2) || (BUREAUS[i].id == 20 && flag == 3) || data.datos[i].tipoBureau == 10 )) {
                                        var nombre;
                                        if (nombre_ind.toUpperCase() == data.datos[i].nombre) {
                                            nombre = "DATA ENTRY";
                                        } else {
                                            nombre = BUREAUS[i].nombre;
                                        }
                                        $('#cmboxOrigenEjeX').append('<option value="' + data.datos[i].id + '">' + nombre + '</option>');
                                        $('#cmboxOrigenEjeY').append('<option value="' + data.datos[i].id + '">' + nombre + '</option>');
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });
}

function obtenerVariables(_nro, _select) {
    var sw = false;
    var tipoPersona = _TIPO == "J" ? 2 : 1;
    for (var i in BUREAUS) {
        if (BUREAUS[i].id == $(_select).val() && BUREAUS[i].tipo == (tipoPersona)) {
            $('#' + (_nro == 1 ? 'cmboxEjeX' : 'cmboxEjeY')).html('<option value="0" disabled="" selected="">Seleccione</option>');
            var variables = BUREAUS[i].variables;
            for (var j in variables) {
                if (variables[j].tipo == _TIPO || variables[j].tipo == "A" || variables[j].tipo == "F") {
                    if (variables[j].tipoDato == 50 || variables[j].tipoDato == 2)
                        $('#' + (_nro == 1 ? 'cmboxEjeX' : 'cmboxEjeY')).append('<option value="' + variables[j].id + '" vartipo="' + variables[j].tipoDato + '">' + variables[j].descripcion + ' ' + getTipoDato(variables[j].tipoDato) + ' </option>');
                    sw = true;
                }
            }
        }
        if (sw)
            break;
    }
}

function fillCoordenadasPresupuesto(table) {
    $(table).find('tbody').empty();
    $(table).find('thead').empty();
    var column = $('#inpColumn').val();
    var columna = $('<tr>');
    $(columna).append('<td style="text-align: center;"><span style="color:blue;">' + obConfig.variableY.nombre + '</span><b> / </b>' + obConfig.variableX.nombre + '</td>');
    $('#tblPresupuesto tbody tr').each(function () {
        var column_id = $(this).find('td').eq(0).find('input').attr('id');
        var row_id = $(this).find('td').eq(1).find('input').attr('id');
        if ($(this).find('td').eq(0).find('input').attr('id') != undefined) {
            $(columna).append('<th style="text-align: center;">' + $('#' + column_id).val() + '</th>');
        }

        var fila = $('<tr>');
        for (var i = 0; i <= column; i++) {
            if ($(this).find('td').eq(1).find('input').attr('id') != undefined) {
                if (i == 0) {
                    $(fila).append('<td align="center"><span style="color:blue;">' + $('#' + row_id).val() + '</span></td>');
                } else {
                    var colAux = '<td><select class="form-control"><option value="0">Seleccione</option>';
                    for (var j in RISKTIER) {
                        colAux += '<option value="' + RISKTIER[j].id + '">' + RISKTIER[j].nombre + '</option>';
                    }
                    colAux += '</select></td>';

                    $(fila).append(colAux);
                    _idIngresos--;
                }
            }
        }
        $(table).find('tbody').append(fila);
    });

    $(table).find('thead').append(columna);
}

function fillCoordenadasIngresadas() {
    _idIngresos = 0;
    _arrColumnRows = new Array();
    _arrCoordenadasIngresadas = new Array();
    var objColumnRow = new Object();
    objColumnRow.column = $('#inpColumn').val();
    objColumnRow.row = $('#inpRow').val();
    _arrColumnRows.push(objColumnRow);
    $('#tblCoordenadasPresupuesto tbody tr td').each(function (index, element) {
        var row_data = $(element).find('input').attr('id');
        if (row_data != undefined) {
            var objDatos = new Object();
            objDatos.id = row_data;
            objDatos.detalle = $('#' + row_data).val();
            _arrCoordenadasIngresadas.push(objDatos);
        }
    });
}

function fillValidarTableColumnRow() {
    guardarConfiguracion();
    var flag = false;

    $('#tblPresupuesto tbody tr').each(function () {
        if ($(this).find('td').eq(0).find('input').attr('id') != undefined) {
            var column_id = $(this).find('td').eq(0).find('input').attr('id');
            if ($('#' + column_id).val().trim().length == 0) {
                $('#divInformacion').removeClass('hidden');
                var texto = 'Debe completar todos los campos(*)';
                $('#lblInformacion').text(texto);
            }
        }
    });

    if (flag == false) {
        $('#id-panel-body-2').removeClass('hidden');
        $('#id-panel-body-1').addClass('hidden');
        fillCoordenadasPresupuesto($('#tblCoordenadasPresupuesto'));
    }
    return true;
}

function fillValidarDatos() {
    var texto = '';
    $('#divInformacion').removeClass('hidden');

    if ($('#cmboxTipoRiskTier').val() == null) {
        texto = 'Debe seleccionar tipo (Natural o JurÃ­dico)';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#cmboxOrigenEjeX').val() == 0) {
        texto = 'Debe seleccionar origen de variable Eje X';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#cmboxEjeX').val() == 0) {
        texto = 'Debe seleccionar una variable para el eje X';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#inpColumn').val().length == 0 || $('#inpColumn').val() == '0') {
        texto = 'Debe ingresar nÃºmero de columnas';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#cmboxOrigenEjeY').val() == 0) {
        texto = 'Debe seleccionar origen de variable Eje Y';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#cmboxEjeY').val() == 0) {
        texto = 'Debe seleccionar una variable para el eje Y';
        $('#lblInformacion').text(texto);
        return false;
    } else if ($('#inpRow').val().length == 0 || $('#inpRow').val() == '0') {
        texto = 'Debe ingresar nÃºmero de filas';
        $('#lblInformacion').text(texto);
        return false;
    } else {
        $('#divInformacion').addClass('hidden');
        filladdRowtable($('#tblPresupuesto'));
        return true;
    }
}

function filladdRowtable(table) {
    $('#tblPresupuesto tbody').empty();
    $('#tblPresupuesto thead').empty();
    var var1 = $('#cmboxEjeX option:selected').text();
    var var2 = $('#cmboxEjeY option:selected').text();
    $('#tblPresupuesto thead').append('<tr><th>' + var1 + '</th><th>' + var2 + '</th></tr>');
    var column = $('#inpColumn').val();
    var row = $('#inpRow').val();

    $(table).find('thead').append('<tr>'
        + '<th>' + $('#cmboxProductoColumn option:selected').text() + '</th>'
        + '<th>' + $('#cmboxProductoRow option:selected').text() + '</th></tr>');
    var cont = column > row ? column : row;
    for (var i = 0; i < cont; i++) {
        var fila = '<tr>';
        if (column > i) {
            var html = '<input  id="column_' + _idTemporal + '" class="form-control" placeholder="Ingrese valor(*)" type="text" onkeyup="return formatoNumero(this)">';
            fila += '<td>' + html + '</td>';
        } else {
            fila += '<td style="visibility: hidden;"></td>';
        }

        if (row > i) {
            var html = '<input id="row_' + _idTemporal + '" class="form-control" placeholder="Ingrese valor(*)" type="text" onkeyup="return formatoNumero(this)">';
            fila += '<td >' + html + '</td>';
        } else {
            fila += '<td style="visibility: hidden;"></td>';
        }

        fila += '</tr>';
        $('#tblPresupuesto tbody').append(fila);
        _idTemporal--;
    }
}

//crea risktier
function guardarPresupuesto() {
    var arr = [];
    var flag = true;
    $.each($('#tblCoordenadasPresupuesto tbody tr'), function () {
        var fila = $(this).index();
        arr.push(new Array());
        $.each($(this).find('td'), function () {
            var col = $(this).index();
            if (col > 0) {
                var valor = $(this).find('select').val();
                arr[fila].push(new Array());
                arr[fila][(col - 1)] = valor;
                if (valor == 0) {
                    flag = false;
                }
            }
        });
    });

    if (!flag) {
        $('#divInformacion').removeClass('hidden');
        $('#divInformacion').show();
        $('#lblInformacion').text('Faltan items por seleccionar!');
    } else {
        $('#divInformacion').addClass('hidden');
        $('#divInformacion').hide();
        $('#lblInformacion').text('');
        obConfig.datos = arr;

        swal({
            title: 'Guardar datos',
            text: 'Â¿Continuar?',
            type: 'info',
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: 'Svl_RiskTier',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'guardar-risktier-empresa',
                        obRiskTier: JSON.stringify(obConfig)
                    }, success: function (data, textStatus, jqXHR) {
                        if (data.estado == 200) {
                            swal({
                                title: "Datos Actualizados",
                                text: "Matriz Risk Tier actualizada",
                                type: "info",
                                showCancelButton: false,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            }, function () {
                                //go('cmd', [{id: 'code', val: 'risktier'}, {id: 'parentRecurso', val: recurso}], undefined, 'cmd');
                                go('cmd', [{id: 'code', val: 'risktier'}, {id: 'parentRecurso', val: recurso}, {id: 'select', val: data.tipo}], undefined, 'cmd');
                            });
                        } else {
                            sweetAlert("Oops...", "Hubo un error al guardar los datos!", "error");
                        }
                    }
                });
            }
        });
    }
}

function buscarVariables() {
    $('#cmboxOrigenEjeX').html("");
    $('#cmboxOrigenEjeY').html("");
    $('#cmboxOrigenEjeX').append('<option value="0" selected>Seleccione</option>');
    $('#cmboxOrigenEjeY').append('<option value="0" selected>Seleccione</option>');
    $('#cmboxEjeX').append('<option value="0" selected>Seleccione</option>');
    $('#cmboxEjeY').append('<option value="0" selected>Seleccione</option>');
    $.ajax({
        url: 'Svl_Variable',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'listar'
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado === 200) {
                for (var i in data.datos) {
                    $('#cmboxEjeX').append('<option value="' + data.datos[i].id + '">' + data.datos[i].variable + '</option>');
                    $('#cmboxEjeY').append('<option value="' + data.datos[i].id + '">' + data.datos[i].variable + '</option>');
                }
            }
        }
    });
}


/**
 * Guarda la configuraciÃ³n del risk tier
 *
 * @returns {undefined}
 */
function guardarConfiguracion() {
    var flag = true;

    obConfig = new Object();
    obConfig.tipoRiskTier = $('#cmboxTipoRiskTier').val();
    obConfig.variableX = new Object();
    obConfig.variableX.id = $('#cmboxEjeX').val();
    obConfig.variableX.nombre = $('#cmboxEjeX option:selected').text();
    var arrAux = [];
    $.each($('#tblPresupuesto tbody tr'), function () {
        var valor = $(this).find('td:eq(0) input').val();
        if (valor != undefined) {
            if (valor != null && valor.length > 0) {
                arrAux.push($(this).find('td:eq(0) input').val().replace(/\./g, ''));
            } else {
                flag = false;
            }
        }
    });
    obConfig.variableX.datos = arrAux;
    obConfig.variableY = new Object();
    obConfig.variableY.id = $('#cmboxEjeY').val();
    obConfig.variableY.nombre = $('#cmboxEjeY option:selected').text();

    arrAux = [];
    $.each($('#tblPresupuesto tbody tr'), function () {
        var valor = $(this).find('td:eq(1) input').val();
        if (valor != undefined) {
            if (valor != null && valor.length > 0) {
                arrAux.push($(this).find('td:eq(1) input').val().replace(/\./g, ''));
            } else {
                flag = false;
            }
        }
    });
    obConfig.variableY.datos = arrAux;

    obConfig.filas = $('#inpRow').val().replace(/\./g, '');
    obConfig.columnas = $('#inpColumn').val().replace(/\./g, '');

    if (flag) {
        fillCoordenadasPresupuesto($('#tblCoordenadasPresupuesto'));
    } else {
        $('#divInformacion').removeClass('hidden');
        $('#divInformacion').show();
        $('#lblInformacion').text('Debe completar todos los campos');
    }

    return flag;
}

/**
 *
 * @param {type} _buscarRiskIndicator
 * @return {undefined}
 */
function buscarRiskTier(tipo, pantalla) {

    origenX_N = [];
    origenY_N = [];
    origenX_J = [];
    origenY_J = [];
    arrCab = [];
    arrDef = [];
    bloquearUI('tablaRiskTier', 'black'); //bloquear UI
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'listar'
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado === 200) {
                RISKTIER = data.datos;
            }

            buscarRiskIndicator(tipo, pantalla);
        }
    });
}

//natural
var origenX_N = [];
var origenY_N = [];
// juridico
var origenX_J = [];
var origenY_J = [];

var arrCab = [];
// valor tabla core + id tipo
var arrDef = [];

var valor_tabla_core_Natural = [];
var valor_tabla_core_Judicial = [];

function buscarRiskIndicator(tipo, pantalla) {
    valor_tabla_core_Natural = [];
    valor_tabla_core_Judicial = [];
    //natural
    origenX_N = [];
    origenY_N = [];
// juridico
    origenX_J = [];
    origenY_J = [];
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'listar-riskindicator-empresa'
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado === 200) {
                $('#contenedorRiskTier').show();
                $('#tablaRiskTier').empty();
                var datos = data.datos;
                arrCab = datos;
                arrDef = data.def;
                /*separar los valores tabla core por tipo*/
                for (var i in arrDef) {
                    if (arrDef[i].tipo == 1) {
                        //arreglo para natural
                        valor_tabla_core_Natural.push(arrDef[i]);
                    } else {
                        //judicial
                        valor_tabla_core_Judicial.push(arrDef[i]);

                    }
                }

                for (var j in datos) {
                    var cab = datos[j];
                    for (var i in cab.caberasTablaCore) {
                        if (cab.tipoAdminRiskTier.id == 1) {
                            if (cab.caberasTablaCore[i].eje.toString().toLowerCase() == 'x') {
                                origenX_N.push(cab.caberasTablaCore[i]);
                            } else if (cab.caberasTablaCore[i].eje.toString().toLowerCase() == 'y') {
                                origenY_N.push(cab.caberasTablaCore[i]);
                            }
                        } else if (cab.tipoAdminRiskTier.id == 2) {
                            if (cab.caberasTablaCore[i].eje.toString().toLowerCase() == 'x') {
                                origenX_J.push(cab.caberasTablaCore[i]);
                            } else if (cab.caberasTablaCore[i].eje.toString().toLowerCase() == 'y') {
                                origenY_J.push(cab.caberasTablaCore[i]);
                            }
                        }
                    }
                }
                if (pantalla == 1) {
                    crearMatrizRiskTier(tipo);
                } else {
                    cambiarVista(tipo);
                }
            }
        }
    });
}
/*
 * Esta funcion intermedia a cambiarVista(idTipo) se implemento para no afectar la experiencia del usuario a nivel de UI:
 */
function cambiarTipoRiskTier(idTipo)
{
    $('#tablaRiskTier').text('');
    $('#tablaRiskTier').append('<thead> <tr class="uppercase"> <th style="text-align: center;"> Buscando datos para  RiskTier.. </th> </tr> </thead>');
    bloquearUI('tablaRiskTier', 'black'); //bloquear UI
    setTimeout(function () {
        cambiarVista(idTipo);
    }, 500);

}

function cambiarVista(idTipo) {
    $('#tablaRiskTier').text('');//limpiar tabla
    if (idTipo == 1) {
        var cab = arrCab[0].tipoAdminRiskTier.id == 1 ? arrCab[0] : arrCab[1];
        var row = 0;
        $('#tablaRiskTier').append('<tr><th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' / ' + cab.origenX.nombre + '</th></tr>');
        for (var i = 0; i < origenY_N.length; i++) {
            var fila = '<tr>'
            if (row == 0) {
//                fila += '<th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' &#92; ' + cab.origenX.nombre + '</th>';
                fila += '<th></th>';
                for (var j in origenX_N) {
                    fila += '<th style="text-align: center;">' + origenX_N[j].valor + '</th>';
                }
                row = 1;
                i--;
            } else {
                fila += '<th style="text-align: center;">' + origenY_N[i].valor + '</th>';
                for (var j in origenX_N) {
                    fila += '<td id="' + origenY_N[i].id + '_' + origenX_N[j].id + '" style="text-align: center;"></td>';
                }
            }
            fila += '</tr>';
            $('#tablaRiskTier').append(fila);
        }
        for (var i in arrDef) {
            for (var j in RISKTIER) {
                if (RISKTIER[j].id == arrDef[i].idRiskTier) {
                    $('#' + arrDef[i].y.idRiskIndicator + '_' + arrDef[i].x.idRiskIndicator).html(RISKTIER[j].nombre);
                    break;
                }
            }
        }
    } else if (idTipo == 2) {
        var cab = arrCab[1].tipoAdminRiskTier.id == 2 ? arrCab[1] : arrCab[0];
        var row = 0;
        $('#tablaRiskTier').append('<tr><th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' / ' + cab.origenX.nombre + '</th></tr>');
        for (var i = 0; i < origenY_J.length; i++) {
            var fila = '<tr>'
            if (row == 0) {
//                fila += '<th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' &#92; ' + cab.origenX.nombre + '</th>';
                fila += '<th></th>';
                for (var j in origenX_J) {
                    fila += '<th style="text-align: center;">' + origenX_J[j].valor + '</th>';
                }
                row = 1;
                i--;
            } else {
                fila += '<th style="text-align: center;">' + origenY_J[i].valor + '</th>';
                for (var j in origenX_J) {
                    fila += '<td id="' + origenY_J[i].id + '_' + origenX_J[j].id + '" style="text-align: center;"></td>';
                }
            }
            fila += '</tr>';
            $('#tablaRiskTier').append(fila);
        }
        for (var i in arrDef) {
            for (var j in RISKTIER) {
                if (RISKTIER[j].id == arrDef[i].idRiskTier) {
                    $('#' + arrDef[i].y.idRiskIndicator + '_' + arrDef[i].x.idRiskIndicator).html(RISKTIER[j].nombre);
                    break;
                }
            }
        }
    }
}