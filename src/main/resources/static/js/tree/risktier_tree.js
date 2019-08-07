var obConfig = {};
var industria = 0;
var crearRT = 0;
var _ID_NODO_RT = 0;
var _top = 40;
var _left = 30;
var variab1 = "";
var _varRango;
var contavar2 = 0;
var cantvar1 = 0;
var cantvar2 = 0;
var flagEditRT = false;
var _tipoAut;
var _idRT;
var ultimoNodo = "";
$(document).ready(function () {
    $('#btnRayo').click(function () {
        $('#divRayo').animate({width: 'toggle'}, {duration: 500});
    });
    mostrarIndustriaReglas();
//    CargarRiskTierII();
//    cargarHistorialRT();
    $(".window").hover(
        function () {
            $(this).append($("<span> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></span>"));
        }, function () {
            $(this).find("span:last").remove();
        }
    );
});

//mostrar opciones de crear risktier
function mostrarHerramientas() {
    crearRT = 1;
    $('#btnMostrarHerr').hide();
    $('#volverRiskTier').show();

    // Se habilitan los campos de variable 1st
    $('#cmboxOrigenEjeX').prop('disabled', false);
    $('#cmboxEjeX').prop('disabled', false);
    $('#txtCantidadEjeX').prop('disabled', false);
    $('#btnAgregarNodo').prop('disabled', false);
}

//mostrar opciones de crear risktier Arbol Manual
function mostrarHerramientasM() {
    crearRT = 1;
    $('#btnMostrarHerr').hide();
    $('#volverRiskTier').show();

    // Se habilitan los campos de variable 1st
    $('#cmboxOrigenEjeX').prop('disabled', false);
    $('#cmboxEjeX').prop('disabled', false);
    $('#txtCantidadEjeX').prop('disabled', false);
    $('#btnAgregarNodo').prop('disabled', false);
}

//volver a la pantalla donde se muesta el risktier creado
function ocultarHerramientas() {
    crearRT = 0;
    $('#btnMostrarHerr').show();
    $('#volverRiskTier').hide();

    // Se desactivan los controles de las variables de creaciÃ³n de RT
    $('#cmboxOrigenEjeX').prop('disabled', true);
    $('#cmboxEjeX').prop('disabled', true);
    $('#txtCantidadEjeX').prop('disabled', true);
    $('#btnAgregarNodo').prop('disabled', true);
    $('#cmboxOrigenEjeY').prop('disabled', true);
    $('#cmboxEjeY').prop('disabled', true);
    $('#txtCantidad').prop('disabled', true);
    $('#btnAgregarNodo2').prop('disabled', true);

    $('#cmboxOrigenEjeX option:eq(0)').prop('selected', true);
    $('#cmboxOrigenEjeY option:eq(0)').prop('selected', true);
    $('#cmboxEjeX').html('');
    $('#cmboxEjeY').html('');
    $('#txtCantidadEjeX').val('');
    $('#txtCantidad').val('');
}

$('#volverRiskTier').click(function () {
    limpiarPizarra();
    // Se muestra el build RT como al inicio
    $('#nodo1').hide();
    $('#divParametros1st').show();
    $('#datosVar2').children().show();
    $('#nodo2').hide();
    $('#btnRTII').hide();
    CargarRiskTierII();
    cargarHistorialRT();
});

$('#btnMostrarHerr').click(function () {
    limpiarPizarra();
    $('#btnRTI').hide();
    flagEditRT = false;
    variab1 = "INICIO";
    agregarNodoVar1();
    desbloquearUI('limpiar');
});


function agregarNodoVar1(idVari) {
    var extraX = 0;
    var extraY = 0;

    var html = '';
    if (variab1 == 'INICIO') {
        _top = 40;
        _left = 30;
        html = '&nbsp;&nbsp;' +
            '<div id="nodo_1_' + _ID_NODO_RT + '" data-var=0 data-origen=0 class="window jtk-node jtk-endpoint-anchor jtk-connected" style="text-align: center; border: 1px solid #0088cc; padding: 20px; top: ' + (_top + extraY) + 'px;left: ' + (_left + extraX) + 'px;background-color: #ffffff !important;">\n';
        html = html + '<strong>' + variab1 + '<label id="idVariable" style="display: none">' + idVari + '<label></strong> ' + "";
        html = html + '<div id=top style="visibility: hidden; position: absolute;">' + _top + '</div> <div id=left style="visibility: hidden; position: absolute;">' + _left + '</div></div>';
    } else {
        html = '<div id="nodo_1_' + _ID_NODO_RT + '" onclick="editOpenModal(nodo_1_' + _ID_NODO_RT + ')" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 4px 40px; top: ' + (_top + extraY) + 'px; left: ' + (_left + extraX) + 'px; background-color: #ffffff !important;">';
        html = html + '<div> <strong>' + variab1 + '<label id="idVariable" style="display: none">' + idVari + '<label>';

        if (_ID_NODO_RT !== 0) {
            html = html + '</strong> <br><div id="cambiarRango" class="hover-pencil"><a id="myLink" href="javascript:;" onclick="openModalValor(nodo_1_' + _ID_NODO_RT + ');">Ingresar Rango</a></div>';
        }
        html = html + '</div>';
        html = html + '<div id=top style="visibility: hidden; position: absolute;">' + _top + '</div> <div id=left style="visibility: hidden; position: absolute;">' + _left + '</div>';
        html = html + '</div>';
    }

    $('#canvas2').append(html);
    if (_ID_NODO_RT == 0) {
        // Aplicar animaciÃ³n
        animarNodo0('#nodo_1_' + _ID_NODO_RT, _left, _top, _ID_NODO_RT);
    } else {
        // Aplicar animaciÃ³n
        animarNodoVar1('#nodo_1_' + _ID_NODO_RT, _left, _top, _ID_NODO_RT);
    }

    if (_ID_NODO_RT === 0) {
        _top = 40;
        _left = 250;
    } else {
        _top = _top + 60;
    }
    _ID_NODO_RT = _ID_NODO_RT + 1;

}

//Se anima la carga de nodos
function animarNodo0(nodo, x, y, indice) {
    $(nodo).hide();
    $(nodo).animate({
        left: '' + (x + 70) + 'px',
        top: '' + (y - 50) + 'px'
    }, 500, function () {
        $(nodo).show();
        $(nodo).animate({
            left: '' + (x) + 'px',
            top: '' + y + 'px'
        }, 1250, function () {
            jsPlumb.addEndpoint("nodo_1_" + indice, sourceEndpoint, {anchor: "RightMiddle", uuid: "RightMiddle"});
            jsPlumb.draggable($("#nodo_1_" + indice));
//            if (indice != 0) {
//                conectarNodosRTT("nodo_1_0", "nodo_1_" + indice);
//            }
        });
    });
}

//Se anima la carga de nodos
function animarNodoVar1(nodo, x, y, indice) {
    $(nodo).hide();
    $(nodo).animate({
        left: '' + (x + 70) + 'px',
        top: '' + (y + 50) + 'px'
    }, 500, function () {
        $(nodo).show();
        $(nodo).animate({
            left: '' + (x) + 'px',
            top: '' + y + 'px'
        }, 1250, function () {
            if (indice != 0) {
                jsPlumb.addEndpoint("nodo_1_" + indice, sourceEndpointRechazo, {
                    anchor: "RightMiddle",
                    uuid: "RightMiddle" + indice
                });
                jsPlumb.addEndpoint("nodo_1_" + indice, targetEndpoint, {
                    anchor: "LeftMiddle",
                    uuid: "LeftMiddle" + indice
                });
                jsPlumb.draggable($("#nodo_1_" + indice));
                conectarNodosRTT("nodo_1_0", "nodo_1_" + indice);
            }
        });
    });
}

function agregarNodoVar1Creacion(cantvar1, idVari) {
    contavar1 = _ID_NODO_RT;
    for (var cantiv1 = 0; cantiv1 < cantvar1; cantiv1++) {
        var html = '<div id="nodo_1_' + _ID_NODO_RT + '" onclick="editOpenModal(nodo_1_' + _ID_NODO_RT + ')" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center;border: 1px solid #0088cc; padding: 4px 40px; top: ' + _top + 'px;left: ' + _left + 'px; background-color: #ffffff !important;">';
        html = html + '<div> <strong>' + variab1 + '<label id="idVariable" style="display: none">' + idVari + '<label> </strong> <div id="cambiarRango" class="hover-pencil"><a id="myLink" href="javascript:;" onclick="openModalValor(nodo_1_' + _ID_NODO_RT + ');">Ingresar Rango</a></div></div>';
        html = html + '<div id=top style="visibility: hidden; position: absolute;">' + _top + '</div> <div id=left style="visibility: hidden; position: absolute;">' + _left + '</div>';
        html = html + '</div>';

        $('#canvas2').append(html);
        // Aplicar animaciÃ³n
        animarNodoVar1('#nodo_1_' + _ID_NODO_RT, _left, _top, _ID_NODO_RT, cantiv1);
        _ID_NODO_RT = _ID_NODO_RT + 1;
        _top = _top + 60;
    }
}

function agregarNodoVar2(cantvar1, cantvar2, idVari) {
    contavar2 = _ID_NODO_RT;
    for (var cantiv1 = 0; cantiv1 < cantvar1; cantiv1++) {
        for (var cantiv2 = 0; cantiv2 < cantvar2; cantiv2++) {
            var html = '<div id="nodo_2_' + _ID_NODO_RT + '" onclick="editOpenModal(nodo_2_' + _ID_NODO_RT + ')" class="window jtk-node widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" style="text-align: center; border: 1px solid #0088cc; padding: 4px 40px; top: ' + _top + 'px; left: ' + _left + 'px; background-color: #ffffff !important;">';
            html = html + '<div> <strong>' + variab1 + '<label id="idVariable" style="display: none">' + idVari + '<label> </strong> <div id="cambiarRango" class="hover-pencil"><a id="myLink" href="javascript:;" onclick="openModalValor(nodo_2_' + _ID_NODO_RT + ');">Ingresar Rango</a></div></div>';
            html = html + '<div id=top style="visibility: hidden; position: absolute;">' + _top + '</div> <div id=left style="visibility: hidden; position: absolute;">' + _left + '</div>';
            html = html + '</div>';

            $('#canvas2').append(html);
            // Aplicar animaciÃ³n
            animarNodoVar2_1('#nodo_2_' + _ID_NODO_RT, _left, _top, _ID_NODO_RT, cantiv1);
            _ID_NODO_RT = _ID_NODO_RT + 1;
            _top = _top + 60;
        }
    }
    _top = 40;
    parseInt($('#nodo_2_' + cantvar1).width()) + 50
    var nodoMenos1 = _ID_NODO_RT - 1;
    _left = _left + parseInt($('#nodo_2_' + nodoMenos1).width()) + 160;
    for (var cantiv1 = 0; cantiv1 < cantvar1; cantiv1++) {
        for (var cantiv2 = 0; cantiv2 < cantvar2; cantiv2++) {
            var html = '<div id="nodo_3_' + _ID_NODO_RT + '" class="window jtk-node" style="text-align: center; border: 1px solid #0088cc; padding: 4px 40px; top: ' + _top + 'px;left: ' + _left + 'px;background-color: #ffffff !important;">';
            html = html + '<div><select id="slLetra" class="form-control input-xsmall" style="background-color:#F4F4F5">' +
                '<option value="1">A</option>' +
                '<option value="2">B</option>' +
                '<option value="3">C</option>' +
                '<option value="4">D</option>' +
                '<option value="5">E</option>' +
                '<option value="6">F</option>' +
                '<option value="7">G</option>' +
                '<option value="8">H</option>' +
                '<option value="9">I</option>' +
                '<option value="10" selected>J</option>' +
                '</select></div>';
            html = html + '<div id=top style="visibility: hidden; position: absolute;">' + _top + '</div> <div id=left style="visibility: hidden; position: absolute;">' + _left + '</div>';
            html = html + '</div>';

            $('#canvas2').append(html);
            // Aplicar animaciÃ³n
            animarNodoVar2_2('#nodo_3_' + _ID_NODO_RT, _left, _top, _ID_NODO_RT, contavar2);

            contavar2 = contavar2 + 1;
            _ID_NODO_RT = _ID_NODO_RT + 1;
            _top = _top + 60;
        }
    }
}

//Se anima la carga de nodos
function animarNodoVar2_1(nodo, x, y, indice, cantidad) {
    $(nodo).hide();
    $(nodo).animate({
        left: '' + (x - 50) + 'px',
        top: '' + (y + 50) + 'px'
    }, 500, function () {
        $(nodo).show();
        $(nodo).animate({
            left: '' + (x) + 'px',
            top: '' + y + 'px'
        }, 1250, function () {
            if (indice != 0) {
                jsPlumb.addEndpoint("nodo_2_" + indice, sourceEndpointRechazo, {
                    anchor: "RightMiddle",
                    uuid: "RightMiddle" + indice
                });
                jsPlumb.addEndpoint("nodo_2_" + indice, targetEndpoint, {
                    anchor: "LeftMiddle",
                    uuid: "LeftMiddle" + indice
                });
                jsPlumb.draggable($("#nodo_2_" + indice));
                conectarNodosRTT("nodo_1_" + (cantidad + 1), "nodo_2_" + indice);
            }
        });
    });
}

//Se anima la carga de nodos
function animarNodoVar2_2(nodo, x, y, indice, cantidad) {
    $(nodo).hide();
    $(nodo).animate({
        left: '' + (x - 70) + 'px',
        top: '' + (y - 40) + 'px'
    }, 500, function () {
        $(nodo).show();
        $(nodo).animate({
            left: '' + (x) + 'px',
            top: '' + y + 'px'
        }, 1250, function () {
            if (indice != 0) {
                jsPlumb.addEndpoint("nodo_3_" + indice, targetEndpoint, {
                    anchor: "LeftMiddle",
                    uuid: "LeftMiddle" + indice
                });
                jsPlumb.draggable($("#nodo_3_" + indice));
                conectarNodosRTT("nodo_2_" + cantidad, "nodo_3_" + indice);
            }
        });
    });
}

function agregarRango() {
    var desde = $("#txtDesde").val().replace(/\./g, '');
    ;
    var operador = $("#cmboxLogicos").val();
    var hasta = $("#txtHasta").val().replace(/\./g, '');
    ;

    if (parseInt(hasta) <= parseInt(desde)) {
        swal("Rango Incorrecto", "El campo Hasta no puede ser menos al campo Desde", "error");
        return;
    }
    if (operador === "") {
        swal("Falta Operador", "Favor indicar campo Operador", "error");
        return;
    }

    var queNodo = _varRango.id.slice(0, 7);
    var numNodoMenos = _varRango.id.slice(7, 11);
    var numNodoMas = _varRango.id.slice(7, 11);
    try {
        if (queNodo + numNodoMenos === ultimoNodo) {
            closeModalValor();
            return;
        }
    } catch (e) {
    }

    if (queNodo === "nodo_1_") {
        var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> ' + operador + ' </label><label id="lblhasta"> ' + number_format(hasta, 0, ',', '.') + ' </label>';
        $("#" + _varRango.id).find('#cambiarRango').html(html);
    } else {
        var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> ' + operador + ' </label><label id="lblhasta"> ' + number_format(hasta, 0, ',', '.') + ' </label>';
        $("#" + _varRango.id).find('#cambiarRango').html(html);
        while ($('#' + queNodo + (parseInt(numNodoMenos) - parseInt(cantvar2))).length) {
            var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> ' + operador + ' </label><label id="lblhasta"> ' + number_format(hasta, 0, ',', '.') + ' </label>';
            $('#' + queNodo + (parseInt(numNodoMenos) - parseInt(cantvar2))).find('#cambiarRango').html(html);
            numNodoMenos = parseInt(numNodoMenos) - parseInt(cantvar2);
        }
        while ($('#' + queNodo + (parseInt(numNodoMas) + parseInt(cantvar2))).length) {
            var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> ' + operador + ' </label><label id="lblhasta"> ' + number_format(hasta, 0, ',', '.') + ' </label>';
            $('#' + queNodo + (parseInt(numNodoMas) + parseInt(cantvar2))).find('#cambiarRango').html(html);
            numNodoMas = parseInt(numNodoMas) + parseInt(cantvar2);
        }
    }

    closeModalValor();
    $("#txtHasta").val("");
    $("#txtDesde").val("");
    jsPlumb.repaintEverything();
    if (flagEditRT) {
        $('#btnRTI').fadeIn('slow', 0).slideDown();
    }
}

$('#btnAgregarNodo').click(function () {
    variab1 = $("#cmboxEjeX option:selected").text();
    cantvar1 = $("#txtCantidadEjeX").val();

    if (variab1 === "") {
        swal("Debe indicar Variable en 1st Variable", "Falta el campo de Variable en 1st Variable", "error");
        return;
    }

    if (cantvar1 === "") {
        swal("Debe indicar cantidad de Variable(s)", "Falta el campo de Cantidad en 1st Variable", "error");
        return;
    }

    swal({
        title: "Generar Nodos EJE X",
        text: "Â¿Continuar?\n\No se podrÃ¡n eliminar o agregar nodos despues de confirmar",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#dd3333',
        confirmButtonText: "Si, Crear Nodos",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true,
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            agregarNodo();
        }
    });
});

function agregarNodo() {
    // Se habilitan los campos para agregar variables 2nd
    $('#cmboxOrigenEjeY').prop('disabled', false);
    $('#cmboxEjeY').prop('disabled', false);
    $('#txtCantidad').prop('disabled', false);
    $('#btnAgregarNodo2').prop('disabled', false);

    var idVari = $("#cmboxEjeX").val();

    _top = 40;

    var html = '<br>' +
        '<div id="nodo1" data-toggle="tooltip" title=" ' + variab1 + ' " style="display: none; text-align: center; border-radius: 25px !important; border: 1px solid #0088cc; padding: 4px 40px; top: ' + _top + 'px;left: ' + _left + 'px;">';
    if (variab1.length > 5) {
        var html = html + '<div> <strong>' + variab1.slice(0, 5) + "...";
        +'</strong></div>';
    } else {
        var html = html + '<div> <strong>' + variab1 + '</strong></div>';
    }
    var html = html + '</div>';
    $('#datosVar1').children().hide();
    $('#datosVar1').append(html);
    $('#nodo1').show();
    agregarNodoVar1Creacion(cantvar1, cantvar2, idVari);
}

$('#btnAgregarNodo2').click(function () {
    variab1 = $("#cmboxEjeY option:selected").text();
    cantvar2 = $("#txtCantidad").val();

    if ($('#nodo_1_1').length == 0) {
        swal("Â¿Sin Variable X?", "debe ingresar al menos una variable de \"1rs Varaible\"", "error");
        return;
    }
    if (variab1 === "") {
        swal("Debe indicar Variable en 2nd Variable", "Falta el campo de Variable en 2nd Variable", "error");
        return;
    }
    if (cantvar2 === "") {
        swal("Debe indicar cantidad de Variable(s)", "Falta el campo de Cantidad en 2nd Variable", "error");
        return;
    }

    swal({
        title: "Generar Nodos EJE Y",
        text: "Â¿Continuar?\n\No se podrÃ¡n eliminar o agregar nodos despues de confirmar",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#dd3333',
        confirmButtonText: "Si, Crear Nodos",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true,
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            agregarNodo2();
        }
    });
});

function agregarNodo2() {
    var idVari = $("#cmboxEjeY").val();
    cantvar1 = _ID_NODO_RT - 1;
    _top = 40;
    _left = _left + parseInt($('#nodo_1_' + cantvar1).width()) + 160;

    var html = '<br>' +
        '<div id="nodo2" data-toggle="tooltip" title=" ' + variab1 + ' " style="display: none; text-align: center; border-radius: 25px !important; border: 1px solid #0088cc; padding: 4px 40px; top: ' + _top + 'px;left: ' + _left + 'px;">';
    if (variab1.length > 5) {
        var html = html + '<div> <strong>' + variab1.slice(0, 5) + "...";
        +'</strong></div>';
    } else {
        var html = html + '<div> <strong>' + variab1 + '</strong></div>';
    }
    var html = html + '</div>';
    $('#datosVar2').children().hide();
    $('#datosVar2').append(html);
    $('#nodo2').show();
    $('#btnRTII').show();
    agregarNodoVar2(cantvar1, cantvar2, idVari);
}

function conectarNodosRTT(padre, hijo) {
    jsPlumb.connect({
        source: padre,
        target: hijo,
        anchors: ["RightMiddle", "LeftMiddle"],
        connector: ["Flowchart"],
        endpoint: "Blank"
    });
}

function editOpenModal(idNodo) {
    if ($('#' + idNodo.id + ' #lblhasta').length) {

        ocultarSiEsUltimoNodo(idNodo.id);
        openModalValor(idNodo);
        $("#txtHasta").val($("#" + idNodo.id).find('#lblhasta').text().trim());
        $("#txtHasta").addClass("edited");
    }
}

function openModalValor(idNodo) {
    _varRango = idNodo;
    var idNodo = _varRango.id.slice(0, 7);
    var numNodo = _varRango.id.slice(7, 11);
    var inicialVar2 = cantvar1 + 1;

    if ($('#' + idNodo + (parseInt(numNodo) - 1)).length) {
        if ($('#' + idNodo + (parseInt(numNodo) - 1) + ' #myLink').length) {
            swal("Falta Rango Previo", "Debe ingresar el rango del nodo anterior previo a este nodo", "error");
            return;
        }
    }

    if (_varRango.id === idNodo + "1" || _varRango.id === idNodo + inicialVar2) {
        $("#txtDesde").val("0");
        $("#txtDesde").prop("disabled", true);
        $("#txtDesde").addClass("edited");
    } else if (idNodo === "nodo_1_") {
        if ($("#nodo_1_" + (parseInt(numNodo) - 1)).find('#lbloperador').text().trim() === "<") {
            $("#txtDesde").val($("#nodo_1_" + (parseInt(numNodo) - 1)).find('#lblhasta').text().trim());
        } else {
            var varDesde = parseInt($("#nodo_1_" + (parseInt(numNodo) - 1)).find('#lblhasta').text().trim().replace(/\./g, '')) + 1;
            $("#txtDesde").val(varDesde);
        }
        $("#txtDesde").addClass("edited");
        $("#txtDesde").prop("disabled", true);
    } else if (idNodo === "nodo_2_") {
        if ($("#nodo_2_" + (parseInt(numNodo) - 1)).find('#lbloperador').text().trim() === "<") {
            $("#txtDesde").val($("#nodo_2_" + (parseInt(numNodo) - 1)).find('#lblhasta').text().trim());
        } else {
            var varDesde = parseInt($("#nodo_2_" + (parseInt(numNodo) - 1)).find('#lblhasta').text().trim().replace(/\./g, '')) + 1
            $("#txtDesde").val(varDesde);
        }
        $("#txtDesde").addClass("edited");
        $("#txtDesde").prop("disabled", true);
    }
    $('#modalRangoRT').fadeIn(300, function () {
        $('#modalRangoRT').modal('show');
    });
}

function ocultarSiEsUltimoNodo(idNodo) {
    try {
        if (idNodo === ultimoNodo) {
            $("#cmboxLogicos").parent().css('display', "none");
            $("#txtHasta").parent().css('display', "none");
            flagEditRT = false;
        } else {
            $("#cmboxLogicos").parent().css('display', "block");
            $("#txtHasta").parent().css('display', "block");
            flagEditRT = true;
        }
    } catch (e) {
    }
}

function closeModalValor() {
    $('#modalRangoRT').fadeOut(300, function () {
        $('#modalRangoRT').modal('hide');
    });
}

$('#guardarRTI').click(function () {
    //crearRT = 0;
    var tipoAut = 0;
    // Se valida si la industria es Automotriz
    if (industria == 1) {
        tipoAut = $('#ind_autom').val();
    }

    // SÃ³lo continua si la opciÃ³n Tipo VehÃ­culo tiene seleccionado algÃºn valor
    if (tipoAut != 1) {
        for (var iNodo = 0; iNodo < (contavar2 - 1); iNodo++) {
            if ($('#nodo_1_' + iNodo).length) {
                if ($('#nodo_1_' + iNodo + ' #myLink').length) {
                    swal("Debe ingresar todos los rangos", "Aun quedan rangos en los nodos que no se han ingresado", "error");
                    return;
                }
            } else {
                if ($('#nodo_2_' + iNodo + ' #myLink').length) {
                    swal("Debe ingresar todos los rangos", "Aun quedan rangos en los nodos que no se han ingresado", "error");
                    return;
                }
            }
        }

        var l = Ladda.create(this);
        l.start();

        var contX = 0;
        var contY = 0;
        /* GUARDAR VALORES EN UN OBJETO */

        obConfig = new Object();
        var tipoDatoX = $('#cmboxEjeX option:selected').attr("vartipo");
        var tipoDatoY = $('#cmboxEjeY option:selected').attr("vartipo");
        if (tipoDatoX == "50" || tipoDatoX == "51") {
            obConfig.detallesX = guardarReglasArray(0);
        } else {
            obConfig.detallesX = null;
        }
        if (tipoDatoY == "50" || tipoDatoY == "51") {
            obConfig.detallesY = guardarReglasArray(1);
        } else {
            obConfig.detallesY = null;
        }

        obConfig.tipoRiskTier = $('#tipo').val();
        obConfig.variableX = new Object();
        obConfig.variableX.id = parseInt($('#nodo_2_' + parseInt(cantvar1 + 1) + ' #idVariable').text());
        obConfig.variableX.nombre = $('#nodo_2_' + cantvar1 + 1 + ' strong:first').text();
        var arrAuxX = [];
        var conX = 1;
        while ($('#nodo_1_' + conX).length) {
            if (ultimoNodo == 'nodo_1_' + conX) {
                arrAuxX.push('999999999');
            } else {
                arrAuxX.push($('#nodo_1_' + conX + ' #lblhasta').text().replace(/\./g, '').replace(' ', ''));
            }
            conX += 1;
            contX += 1;
        }
        obConfig.variableX.datos = arrAuxX;
        obConfig.variableY = new Object();
        obConfig.variableY.id = parseInt($('#nodo_1_1 #idVariable').text());
        obConfig.variableY.nombre = $('#nodo_1_1 strong:first').text();
        var arrAuxY = [];
        var conY = cantvar1 + 1;
        while ($('#nodo_2_' + conY).length && contY < cantvar2) {
            arrAuxY.push($('#nodo_2_' + conY + ' #lblhasta').text().replace(/\./g, '').replace(' ', ''));
            conY += 1;
            contY += 1;
        }
        obConfig.variableY.datos = arrAuxY;

        obConfig.filas = contX;
        obConfig.columnas = contY;

        var arr = [];
        var InitVar3 = contavar2;
        for (var iX = 0; iX < contX; iX++) {
            arr.push(new Array());
            for (var iY = 0; iY < contY; iY++) {
                arr[iX].push(new Array());
                arr[iX][iY] = $('#nodo_3_' + InitVar3 + ' #slLetra').val();
                InitVar3 += 1;
            }
        }

        obConfig.datos = arr;
        _tipoAut = tipoAut;
        mostrarModalEditar();
        l.stop();
    } else {
        sweetAlert("Falta Tipo VehÃ­culo", "Favor indicar Tipo de VehÃ­culo", "error");
    }
});

function mostrarModalEditar() {
    $('#modalNombreRTEditar').modal({backdrop: 'static'});
}

$('#GuardarEditRT').click(function () {
    var l = Ladda.create(this);
    l.start();
    obConfig.nombre = $('#txtNombreRT').val();
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'guardar-risktier-empresa',
            obRiskTier: JSON.stringify(obConfig),
            obVehiculo: _tipoAut
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado == 200) {
                swal({
                    title: "Datos Actualizados",
                    text: "Matriz Risk Tier actualizada",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#26C281",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                }, function () {
                    $('#txtNombreRT').val('');
                    if (flagEditRT) {
                        flagEditRT = false;
                        $('#btnRTI').hide();

                    }
                });
            } else {
                sweetAlert("Oops...", "Hubo un error al guardar los datos!", "error");
            }
            l.stop();
            $('#modalNombreRTEditar').modal('toggle');
        }
    });
});

/*se crea el nuevo riks tier*/
$('#guardarRTII').click(function () {
//    var tipoAut = 0;
    // Se valida si la industria es Automotriz
//    if (industria == 1) {
//        tipoAut = $('#ind_autom').val();
//    }
    for (var iNodo = 0; iNodo < (contavar2 - 1); iNodo++) {
        if ($('#nodo_1_' + iNodo).length) {
            if ($('#nodo_1_' + iNodo + ' #myLink').length) {
                swal("Debe ingresar todos los rangos", "Aun quedan rangos en los nodos que no se han ingresado", "error");
                return;
            }
        } else {
            if ($('#nodo_2_' + iNodo + ' #myLink').length) {
                swal("Debe ingresar todos los rangos", "Aun quedan rangos en los nodos que no se han ingresado", "error");
                return;
            }
        }
    }

    var l = Ladda.create(this);
    l.start();

    var contX = 0;
    var contY = 0;
    /* GUARDAR VALORES EN UN OBJETO */

    obConfig = new Object();
    var tipoDatoX = $('#cmboxEjeX option:selected').attr("vartipo");
    var tipoDatoY = $('#cmboxEjeY option:selected').attr("vartipo");
    if (tipoDatoX == "50" || tipoDatoX == "51") {
        obConfig.detallesX = guardarReglasArray(0);
    } else
        obConfig.detallesX = null;
    if (tipoDatoY == "50" || tipoDatoY == "51") {
        obConfig.detallesY = guardarReglasArray(1);
    } else
        obConfig.detallesY = null;
    obConfig.tipoRiskTier = $('#tipo').val();
    obConfig.variableX = new Object();
    obConfig.variableX.id = $('#cmboxEjeX').val();
    obConfig.variableX.nombre = $('#cmboxEjeX option:selected').text();
    var arrAuxX = [];
    var conX = 1;
    while ($('#nodo_1_' + conX).length) {
        arrAuxX.push($('#nodo_1_' + conX + ' #lblhasta').text().replace(/\./g, '').replace(' ', ''));
        conX += 1;
        contX += 1;
    }
    obConfig.variableX.datos = arrAuxX;
    obConfig.variableY = new Object();
    obConfig.variableY.id = $('#cmboxEjeY').val();
    obConfig.variableY.nombre = $('#cmboxEjeY option:selected').text();
    var arrAuxY = [];
    var conY = cantvar1 + 1;
    while ($('#nodo_2_' + conY).length && contY < cantvar2) {
        arrAuxY.push($('#nodo_2_' + conY + ' #lblhasta').text().replace(/\./g, '').replace(' ', ''));
        conY += 1;
        contY += 1;
    }
    //contY = contY * contX;
    obConfig.variableY.datos = arrAuxY;

    obConfig.filas = contX;
    obConfig.columnas = contY;

    var arr = [];
    var InitVar3 = contavar2;
    for (var iX = 0; iX < contX; iX++) {
        arr.push(new Array());
        for (var iY = 0; iY < contY; iY++) {
            arr[iX].push(new Array());
            arr[iX][iY] = $('#nodo_3_' + InitVar3 + ' #slLetra').val();
            InitVar3 += 1;
        }
    }

    obConfig.datos = arr;
//    _tipoAut = tipoAut;
    mostrarModalEditar();
    l.stop();
});

function guardarReglasArray(con) {
    var jsonDetalle = Object();
    try {
        var reglas = null;
        var accion = null;
        var resp = guardarReglas(con);
        if (!resp) {
            reglas = "";
        } else {
            reglas = resp;
        }

        var varFija = $('#contVariables .contVariable:eq(' + $(this).index() + ')').attr('varfija');

        var respA = guardarAccionX(con);
        if (varFija === 'true') {
            var t = $("#variable_regla_0_1 option:selected").text().split();
            var obj = new Object();
            obj.VAR_NOMBRE = t[(t.length - 1)];
            obj.OPERADOR = "CANT";
            accion = obj;
        } else if (!respA) {
            accion = "";
        } else {
            accion = respA;
        }


        jsonDetalle.reglas = reglas;
        jsonDetalle.accion = accion;
    } catch (e) {
        jsonDetalle.reglas = null;
        jsonDetalle.accion = null;
        console.log(e);
    }
    return jsonDetalle;
}

function mostrarModalEditar() {
    $('#modalNombreRTGuardar').modal({backdrop: 'static'});
}

$('#GuardarSaveRT').click(function () {
    var l = Ladda.create(this);
    l.start();
    obConfig.nombre = $('#txtNombreRTSave').val();
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'guardar-risktier-empresa',
            obRiskTier: JSON.stringify(obConfig)
//            obVehiculo: _tipoAut
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado == 200) {
                swal({
                    title: "Datos Guardados",
                    text: "Matriz Risk Tier Creada",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#26C281",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                }, function () {
                    $("#volverRiskTier").click();
                    $('#txtNombreRTSave').val('');
                    if (flagEditRT) {
                        flagEditRT = false;
                        $('#btnRTI').hide();
                    }
                    primerRiskTier();
                });
            } else {
                sweetAlert("Oops...", "Hubo un error al guardar los datos!", "error");
            }
            l.stop();
            $('#modalNombreRTGuardar').modal('toggle');
        }
    });
});

function limpiarPizarra() {
    bloquearUI('limpiar', 'black');
    for (var inodo = 0; inodo < _ID_NODO_RT; inodo++) {
        var elemento = "";
        if ($('#nodo_1_' + inodo).length) {
            elemento = "nodo_1_" + inodo;
        } else if ($('#nodo_2_' + inodo).length) {
            elemento = "nodo_2_" + inodo;
        } else if ($('#nodo_3_' + inodo).length) {
            elemento = "nodo_3_" + inodo;
        } else {
            elemento = "nodo_" + inodo;
        }
        jsPlumb.detachAllConnections(elemento);
        jsPlumb.removeAllEndpoints(elemento);
        jsPlumb.detach(elemento);
        $("#" + elemento).remove();
    }

    jsPlumb.deleteEveryEndpoint();
    _ID_NODO_RT = 0;
    _top = 40;
    _left = 30;
    variab1 = "";
    _varRango = "";
    contavar2 = 0;
    cantvar1 = 0;
    cantvar2 = 0;
    desbloquearUI('limpiar');
}

function limpiarPizarraAuto() {
    if (JSON.stringify(jsonR) !== "" && JSON.stringify(jsonR) !== "{}" && jsonR != undefined) {
        eliminaBuscarNodosV1(jsonR.node);

        _ID_NODO_RT = 0;
        _top = 40;
        _left = 30;
        variab1 = "";
        _varRango = "";
        contavar2 = 0;
        cantvar1 = 0;
        cantvar2 = 0;
        jsPlumb.deleteEveryEndpoint();
    }

//    for (var inodo = 0; inodo < _ID_NODO_RT; inodo++) {
//        var elemento = "";
//        if ($('#nodo_' + inodo).length) {
//            elemento = "nodo_" + inodo;
//        } else if ($('#nodo_' + inodo).length) {
//            elemento = "nodo_" + inodo;
//        } else if ($('#nodo_' + inodo).length) {
//            elemento = "nodo_" + inodo;
//        } else {
//            elemento = "nodo_" + inodo;
//        }
//        jsPlumb.detachAllConnections(elemento);
//        jsPlumb.removeAllEndpoints(elemento);
//        jsPlumb.detach(elemento);
//        $("#" + elemento).remove();
//    }


//    bloquearUI('limpiar', 'black');
}

function eliminaBuscarNodosV1(_nodos) {
    var nodo = _nodos;
    var nodoId = nodo.id;
    var elemento = "nodo_" + nodoId;
    jsPlumb.detachAllConnections(elemento);
    jsPlumb.removeAllEndpoints(elemento);
    jsPlumb.detach(elemento);
    $("#" + elemento).remove();
    if (clasificar()) {
        delBuscarSubNodosV1(nodo);
    }
}

function delBuscarSubNodosV1(_nodo) {
    var nodo = _nodo.nodes;
    if (typeof nodo != "undefined") {
        for (var i in nodo) {
            var nodoId = nodo[i].id;
            var elemento = "nodo_" + nodoId;
            jsPlumb.detachAllConnections(elemento);
            jsPlumb.removeAllEndpoints(elemento);
            jsPlumb.detach(elemento);
            $("#" + elemento).remove();
            delBuscarSubNodosV1(nodo[i]);
        }
    } else {
        var nodoId = _nodo.id;
        var elemento = "nodo_" + nodoId + "_clas";
        jsPlumb.detachAllConnections(elemento);
        jsPlumb.removeAllEndpoints(elemento);
        jsPlumb.detach(elemento);
        $("#" + elemento).remove();
    }
}

function changeTipo() {
    //Se ejecuta si no esta creando RT
    if (crearRT == 0) {
        limpiarPizarra();
        CargarRiskTierII();
        cargarHistorialRT();
        TipoRisTier($("#tipo").val());
    }
}

var datosRT;

function CargarRiskTierII() {
//    var tipoAut = 0;

    // Se valida si la industria es Automotriz
//    if (industria == 1) {
//        tipoAut = $('#ind_autom').val();
//    }
//    $('#tipo').val(1);
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'cargar-risktier-empresa',
            obRiskTier: $('#tipo').val()
//            obVehiculo: tipoAut
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado == 200) {
                datosRT = JSON.parse(data.datos);
                var idVari = 0;
                var Wfilas = datosRT[0].NUM_FILAS[0];
                for (var iX = 0; iX <= Wfilas; iX++) {
                    if (iX == 0) {
                        variab1 = "INICIO";
                    } else {
                        variab1 = datosRT[0].nombrey[0];
                        idVari = datosRT[0].ORIGEN_Y[0];
                    }
                    agregarNodoVar1(idVari);
                }

                var Wcolum = datosRT[0].NUM_COLUMNAS[0];
                variab1 = datosRT[0].nombrex[0];
                idVari = datosRT[0].ORIGEN_X[0];
                cantvar2 = Wcolum;
                cantvar1 = _ID_NODO_RT - 1;
                _top = 40;
                _left = _left + parseInt($('#nodo_1_' + cantvar1).width()) + 160;
                agregarNodoVar2(cantvar1, cantvar2, idVari);

                //datosRT[1].EJE[0]
                //datosRT[1].VALOR[0]
                var idNodo = 1;
                var desde = 0;
                var flag2 = true;
                for (var icount = 0; icount < datosRT[1].EJE.length; icount++) {
                    if (datosRT[1].EJE[icount] === "Y" && flag2) {
                        desde = 0;
                        flag2 = false;
                    }
                    if (datosRT[1].EJE[icount] === "X") {
                        if (datosRT[1].EJE[(icount + 1)] !== "X") {
                            var html = '>=<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador" style="display:none"> <= </label><label id="lblhasta" style="display:none"> ' + number_format(datosRT[1].VALOR[icount], 0, ',', '.') + ' </label>';
                            $("#nodo_1_" + idNodo).find('#cambiarRango').html(html);
                            desde = parseInt(datosRT[1].VALOR[icount]) + 1;
                            ultimoNodo = "nodo_1_" + idNodo;
                        } else {
                            var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> <= </label><label id="lblhasta"> ' + number_format(datosRT[1].VALOR[icount], 0, ',', '.') + ' </label>';
                            $("#nodo_1_" + idNodo).find('#cambiarRango').html(html);
                            desde = parseInt(datosRT[1].VALOR[icount]) + 1;
                        }


                    } else {
                        var idNodo2 = idNodo;
                        for (var iNodo2 = 0; iNodo2 < cantvar1; iNodo2++) {
                            var html = '<label id="lblDesde"> ' + number_format(desde, 0, ',', '.') + ' </label><label id="lbloperador"> <= </label><label id="lblhasta"> ' + number_format(datosRT[1].VALOR[icount], 0, ',', '.') + ' </label>';
                            $("#nodo_2_" + idNodo2).find('#cambiarRango').html(html);
                            idNodo2 += cantvar2;
                        }
                        desde = parseInt(datosRT[1].VALOR[icount]) + 1;
                    }
                    jsPlumb.repaintEverything();
                    idNodo += 1;
                }

                idNodo = contavar2;
                for (var iLetra = 0; iLetra < datosRT[2].ID_RISKTIER.length; iLetra++) {
                    $("#nodo_3_" + idNodo).find('#slLetra').find("option[value=10]").attr('selected', false);
                    $("#nodo_3_" + idNodo).find('#slLetra').find("option[value=" + datosRT[2].ID_RISKTIER[iLetra] + "]").attr('selected', true);
                    $("#nodo_3_" + idNodo).find('#slLetra').val(datosRT[2].ID_RISKTIER[iLetra]);
                    $("#nodo_3_" + idNodo).attr('onchange', 'changeLetraEdit()');
                    idNodo += 1;
                }
                desbloquearUI('limpiar');
            } else {
                if (_ID7 == 7) {
//                    sweetAlert("HOLA", "", "info");
                } else {
                    sweetAlert("No hay informaciÃ³n para mostrar", "Debe crear un nuevo Risk Tier", "warning");
                    desbloquearUI('limpiar');
                }
            }
        }
    });
    desbloquearUI('limpiar');
}

function changeLetraEdit() {
    flagEditRT = true;
    $('#btnRTI').fadeIn('slow', 0).slideDown();
}

function primerRiskTier() {
//    $.ajax({
//        url: 'Svl_Contratacion',
//        type: 'POST',
//        dataType: 'json',
//        data: {
//            accion: 'RiskTierActivos'
//        },
//        success: function (data) {
//            if (data.activos > 0) {
//                $('#modalPaso03').modal();
//            }
//        }
//    });
}

function cargarHistorialRT() {
//    var tipoAut = 0;
    // Se valida si la industria es Automotriz
//    if (industria == 1) {
//        tipoAut = $('#ind_autom').val();
//    }

    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'cargarHistorialRT',
            obRiskTier: $('#tipo').val(),
//            obVehiculo: tipoAut
        },
        beforeSend: function (xhr) {
            $('#tblHistorialRT tbody').append('<tr id="trCargando" class="odd" style="text-align: center;"><td valign="top" colspan="7" class="dataTables_empty" style="text-align: center;"><i class="fa fa-spinner fa-spin"></i>  Buscando Registros</td></tr>');
        },
        success: function (data) {
            if (data.estado == 200) {
                $('#trCargando').remove();
                $('#tblHistorialRT').DataTable().destroy();
                $('#tblHistorialRT').DataTable({
                    "language": {
                        "lengthMenu": "Mostrar _MENU_ registros por pÃ¡gina.",
                        "zeroRecords": "Lo sentimos. No se encontraron registros.",
                        "info": "Mostrando pÃ¡gina _PAGE_ de _PAGES_",
                        "infoEmpty": "No hay registros aÃºn.",
                        "infoFiltered": "(filtrados de un total de _MAX_ registros)",
                        "search": "BÃºsqueda",
                        "LoadingRecords": "Cargando ...",
                        "Processing": "Procesando...",
                        "SearchPlaceholder": "Comience a teclear...",
                        "paginate": {
                            "previous": "Anterior",
                            "next": "Siguiente"
                        }
                    },
                    "data": data.datos,
                    "columns": [
                        {
                            data: null, "render": function (data, type, row) {
                                if (data.NOMBRE == "") {
                                    return '<button type="button" class="btn btn-primary" onclick="mostrarModalRenombrar(' + data.ID_TABLARISKINDICATOR + ')">Renombrar</button>';
                                } else {
                                    return data.NOMBRE;
                                }
                            }
                        },
//                        {data: 'NOMBRE', class: 'txt-center'},
                        {data: 'NOMBRE_TCONT_X', class: 'txt-center'},
                        {data: 'NOMBRE_VAR_X', class: 'txt-center'},
                        {data: 'NOMBRE_TCONT_Y', class: 'txt-center'},
                        {data: 'NOMBRE_VAR_Y', class: 'txt-center'},
//                        {data: 'NUM_FILAS', class: 'txt-center'},
//                        {data: 'NUM_COLUMNAS', class: 'txt-center'},
                        {
                            data: null, "render": function (data, type, row) {
                                if (data.ACTIVO == 0) {
                                    return '<button type="button" class="btn btn-success" onclick="activarRT(' + data.ID_TABLARISKINDICATOR + ')">Activar</button>';
                                } else {
                                    return '<button type="button" class="btn btn-success disabled">Activado</button>';
                                }
                            }
                        }
                    ]
                });
            } else {
                $('#trCargando').remove();
                $('#tblHistorialRT').DataTable().destroy();
                $('#tblHistorialRT').DataTable().rows().remove().draw();
            }
        }
    });
}

function mostrarModalRenombrar(id) {
    _idRT = id;
    $('#modalRenombrarRT').modal({backdrop: 'static'});
}

$('#btnRenombrarRT').click(function () {
    var l = Ladda.create(this);
    l.start();
    var nombre = $('#txtRenombrarRT').val();
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'renombrarRT',
            idRT: _idRT,
            nombre: nombre
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado == 200) {
                cargarHistorialRT();
                $('#modalRenombrarRT').modal('toggle');
            }
            l.stop();
        }
    });
});

function activarRT(idRT) {
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'activarRT',
            idRT: idRT
        },
        success: function (data) {
            if (data.estado == 200) {
                limpiarPizarra();
                CargarRiskTierII();
                cargarHistorialRT();
            }
        }
    });
}