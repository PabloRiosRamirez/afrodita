//classes de las letras
var _Acolor = "Acolor form-control";
var _Bcolor = "Bcolor form-control";
var _Ccolor = "Ccolor form-control";
var _Dcolor = "Dcolor form-control";
var _Ecolor = "Ecolor form-control";
var _Fcolor = "Fcolor form-control";
var _Industria = 0;

var common = {
    anchor: ["Left", "Right"],
};
var _TIPOSELECCIONx = 0;
function seleccion() {
    _TIPOSELECCIONx = $('#tipo option:selected').val();
}

function seleccionMatris(tipo) {
    $('#tipoMatris').val(tipo);
    _TIPOSELECCIONx = tipo;
}

function cambiarSeleccion() {
    _TIPOSELECCIONx = $('#tipoMatris').val();
}
function seleccionMatris2(tipo) {
    $('#tipoMatris2').val(tipo);
    _TIPOSELECCIONx = tipo;
}

function mostrarTipoVehiculo() {
    $.ajax({
        url: 'Svl_ATB_Default',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'atb_def-getIndustria'
        },
        success: function (data) {
            if (data['estado'] == 200) {
                // Si es automotriz se permite seleccionar entre autos nuevos y autos usados
                if (data['datos'].toUpperCase() == 'AUTOMOTRIZ') {
                    $('#tipo_auto').show();
                    _Industria = 1;
                } else {
                    $('#tipo_auto').hide();
                }
            }

        }
    });
}

function listarDetallesRiskTier(tipo, adminRTA) {
    $('#cargandoTipos').html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw" style="margin-top: 18px; margin-left: 10px;"></i>');
    var adminRT;
    if (adminRTA == null || adminRTA == "") {
        adminRT = $("#pestanias li.active").attr("id");
    } else {
        adminRT = adminRTA;
    }

    if (adminRT == 3) {
        listarDetallesRiskTier(tipo, 19);
    }

//    var tipoAut = 0;
    // Se valida si la industria es Automotriz
//    if(_Industria == 1){
//        tipoAut = $('#ind_autom').val();
//    }
    tipo = $('#tipoMatris2').val();
    // SÃ³lo continua si la opciÃ³n Tipo VehÃ­culo tiene seleccionado algÃºn valor
//    if(tipoAut != 1){
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            accion: 'listarDetallesRiskTier',
            tipo: tipo,
            adminRT: adminRT
        }, success: function (data) {
            if (data.estado == 200) {
                var array = data.array;
                if (array.length == 0) {
                    $('.limpiarInput').val("");
                }
                var Plazo = 1;
                var Monto = 1;
                var Tasa = 1;
                var TasaML = 1;
                var Cuota = 1;
                var TasaMora = 1;
                var TasaProrroga = 1;
                var ComisionCobranza = 1;
                var GastoCustodia = 1;
                var ltv = 1;
                var MMSU = 1;
                for (var i = 0; i < array.length; i++) {
                    //Plazo
                    if (array[i]['IDVARIABLE'] == 1) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 1 + Plazo).val(valor);
                        Plazo++;
                    }
                    //Monto
                    if (array[i]['IDVARIABLE'] == 2) {
                        var valor = array[i]['VALOR'];
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 2 + Monto).val(valor);
                        Monto++;
                    }
                    //tasa
                    if (array[i]['IDVARIABLE'] == 3) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        //$('#risktier' + 3 + Tasa).val(parseFloat(valor).toFixed(2));
                        $('#risktier' + 3 + Tasa).val(valor);
                        Tasa++;
                    }
                    //plazo
                    if (array[i]['IDVARIABLE'] == 4) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 4 + Cuota).val(valor);
                        Cuota++;
                    }
                    //TasaMora
                    if (array[i]['IDVARIABLE'] == 9) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 9 + TasaMora).val(valor);
                        TasaMora++;
                    }
                    //TasaProrroga
                    if (array[i]['IDVARIABLE'] == 10) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 10 + TasaProrroga).val(valor);
                        TasaProrroga++;
                    }
                    //ComisionCobranza
                    if (array[i]['IDVARIABLE'] == 11) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 11 + ComisionCobranza).val(valor);
                        ComisionCobranza++;
                    }
                    //GastoCustodia
                    if (array[i]['IDVARIABLE'] == 12) {
                        var valor = array[i]['VALOR']
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 12 + GastoCustodia).val(valor);
                        GastoCustodia++;
                    }
                    //LTV
                    if (array[i]['IDVARIABLE'] == 17) {
                        var valor = array[i]['VALOR'];
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 17 + ltv).val(valor);
                        ltv++;
                    }
                    //Tasa Machine Learning
                    if (array[i]['IDVARIABLE'] == 19) {
                        var valor = array[i]['VALOR'];
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 19 + TasaML).val(valor);
                        TasaML++;
                    }
                    //Tasa Machine Learning
                    if (array[i]['IDVARIABLE'] == 21) {
                        var valor = array[i]['VALOR'];
                        valor = valor.toString().replace(".", ",");
                        $('#risktier' + 21 + TasaML).val(valor);
                        TasaML++;
                    }
                    _tipoRiskTierSelect = $('#tipoMatris2').val();
                }
            } else {
                console.log("Error");
                console.log("Posiblemente no se ha ejecutado el script de crear detalles");
            }
        }
    });
//    }else{
//        sweetAlert("Falta Tipo VehÃ­culo", "Favor indicar Tipo de VehÃ­culo", "error");
//    }
    $('#cargandoTipos').html('');
}
function formatoDecimal(boton) {
//    $(boton).blur(function () {
//        if ($(this).val().match('.') && $(this).val().match(',')) {
//            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
//        } else {
//            if ($(this).val().length >= 7) {
//
//                $(this).val($(this).val().substring(0, 5));
//            }
//            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
//        }
//    });

//    $(boton).blur(function () {
//        var valor = $(this).val().split('.').join("").split(',').join(".");
//        valor = number_format(valor, 2, ',', '.');
//        $(this).val(valor);

//        $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(0, ",", "."));
//        var valor = $(this).val().toString().replace(",", "").replace(".", "").trim();
//        if (valor.length == 1) {
//            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(0, ",", "."));
//        }
//        if (valor.length == 2) {
//            var numero;
//            var entero = valor.toString().substring(0, 1);
//            var coma = ",";
//            var decimales = valor.toString().substring(1, 2);
//            numero = entero + coma + decimales;
//            $(this).val(numero);
//        } else if (valor.length >= 3) {
//            var numero;
//            var entero = valor.toString().substring(0, 1);
//            var coma = ",";
//            var decimales = valor.toString().substring(1, 3);
//            numero = entero + coma + decimales;
//            $(this).val(numero);
//        }
//    });
}


//function formatoDecimal(boton) {
////    $(boton).blur(function () {
////        if ($(this).val().match('.') && $(this).val().match(',')) {
////            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
////        } else {
////            if ($(this).val().length >= 7) {
////
////                $(this).val($(this).val().substring(0, 5));
////            }
////            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
////        }
////    });
//
//    $(boton).blur(function () {
////        if ($(this).val().match('.') && $(this).val().match(',')) {
////            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
////        }else {
//
//        $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(0, ",", "."));
//        var valor = $(this).val().toString().replace(",", "").replace(".", "").trim();
//        //un numero entero
//        if (valor.length == 1) {
//            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(0, ",", "."));
//        }
////un numero y mÃ¡s de un decimal
//        if (valor.length == 2) {
//            var numero;
//            var entero = valor.toString().substring(0, 1);
//            var coma = ",";
//            var decimales = valor.toString().substring(1, 2);
//            numero = entero + coma + decimales;
//            $(this).val(numero);
//            // $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(1, ",", "."));
//        } else if (valor.length >= 3) {
//            var numero;
//            var entero = valor.toString().substring(0, 1);
//            var coma = ",";
//            var decimales = valor.toString().substring(1, 3);
//            numero = entero + coma + decimales;
//            $(this).val(numero);
//            //$(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
//        }
////}
//    });
////    $(boton).change(function () {
////        if ($(this).val().match('.') && $(this).val().match(',')) {
////            $(this).val(($(this).val().split('.').join("").split(',').join(".") * 1).formatMoney(2, ",", "."));
////        }
////    });
////
////    $(boton).keydown(function (e) {
////        var key = e.which ? e.which : event.keyCode;
////        if (key == 190 || key == 110) {
////            $(this).val($(this).val() + ',');
////            e.preventDefault();
////        }
////    });
//}

function soloJuridico() {
    $("#tipoMatris2").val("2");
    $('#tipoMatris2').prop('disabled', true);
}

function juridicoNatural() {
    $("#tipoMatris2").val("1");
    $('#tipoMatris2').prop('disabled', false);
}

function guardadDetalle(idDetalle) {
    var tipoAut = 0;
    // Se valida si la industria es Automotriz
    if (_Industria == 1) {
        tipoAut = $('#ind_autom').val();
    }
    //leer datos
    var tipoRiskTier = $('#tipoMatris2').val();
    $('#risktier' + idDetalle + 1).val().trim() === "" ? $('#risktier' + idDetalle + 1).val("0") : $('#risktier' + idDetalle + 1).val();
    $('#risktier' + idDetalle + 2).val().trim() === "" ? $('#risktier' + idDetalle + 2).val("0") : $('#risktier' + idDetalle + 2).val();
    $('#risktier' + idDetalle + 3).val().trim() === "" ? $('#risktier' + idDetalle + 3).val("0") : $('#risktier' + idDetalle + 3).val();
    $('#risktier' + idDetalle + 4).val().trim() === "" ? $('#risktier' + idDetalle + 4).val("0") : $('#risktier' + idDetalle + 4).val();
    $('#risktier' + idDetalle + 5).val().trim() === "" ? $('#risktier' + idDetalle + 5).val("0") : $('#risktier' + idDetalle + 5).val();
    $('#risktier' + idDetalle + 6).val().trim() === "" ? $('#risktier' + idDetalle + 6).val("0") : $('#risktier' + idDetalle + 6).val();
    $('#risktier' + idDetalle + 7).val().trim() === "" ? $('#risktier' + idDetalle + 7).val("0") : $('#risktier' + idDetalle + 7).val();
    $('#risktier' + idDetalle + 8).val().trim() === "" ? $('#risktier' + idDetalle + 8).val("0") : $('#risktier' + idDetalle + 8).val();
    $('#risktier' + idDetalle + 9).val().trim() === "" ? $('#risktier' + idDetalle + 9).val("0") : $('#risktier' + idDetalle + 9).val();
    $('#risktier' + idDetalle + 10).val().trim() === "" ? $('#risktier' + idDetalle + 10).val("0") : $('#risktier' + idDetalle + 10).val();

    var A = $('#risktier' + idDetalle + 1).val();
    var B = $('#risktier' + idDetalle + 2).val();
    var C = $('#risktier' + idDetalle + 3).val();
    var D = $('#risktier' + idDetalle + 4).val();
    var E = $('#risktier' + idDetalle + 5).val();
    var F = $('#risktier' + idDetalle + 6).val();
    var G = $('#risktier' + idDetalle + 7).val();
    var H = $('#risktier' + idDetalle + 8).val();
    var I = $('#risktier' + idDetalle + 9).val();
    var J = $('#risktier' + idDetalle + 10).val();
    var letras = [A, B, C, D, E, F, G, H, I, J];
    // SÃ³lo continua si la opciÃ³n Tipo VehÃ­culo tiene seleccionado algÃºn valor
    if (tipoAut != 1) {
        $.ajax({
            url: 'Svl_RiskTier',
            type: 'POST',
            dataType: 'json',
            data: {
                accion: 'guardadDetalle',
                tipoRiskTier: tipoRiskTier,
                idDetalle: idDetalle,
                letras: JSON.stringify(letras),
                obVehiculo: tipoAut
            }, success: function (data, textStatus, jqXHR) {
                if (data.estado === 200) {
                    swal('OK', data.mensaje, 'success');
                } else {
                    swal('Atencion', data.mensaje, 'error');
                }
            }
        });
    } else {
        sweetAlert("Falta Tipo VehÃ­culo", "Favor indicar Tipo de VehÃ­culo", "error");
    }
}

function revisionCompleta() {

    swal({
            title: "Â¿Completar revisiÃ³n?",
            text: "EstÃ¡ seguro de querer ocupar estos valores para su Risk Tier ",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#0088cc",
            confirmButtonText: "OK",
            closeOnConfirm: false
        },
        function () {
            $.ajax({
                url: 'Svl_Contratacion',
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'revisionCompleta'
                },
                success: function (data) {
                    if (data.estado == 200) {
                        go('cmd', [{id: 'recurso', val: '8'}], undefined, 'cmd');
                    } else {
                        swal('Atencion', 'ocurrio un error sql', 'warning');
                    }
                }
            });

        });


}

var TREE = new Object();
function getPoliticasRiskTier(_idTipoAdminRiskTier, tipo) {
    bloquearUI('canvas2', 'white'); //bloquear UI
    $.ajax({
        url: 'Svl_RiskTier',
        type: 'POST',
        dataType: 'json',
        data: {
            accion: 'arbol-risk-tier'
        }, success: function (data, textStatus, jqXHR) {
            if (data.estado === 200) {
                TREE['natural'] = data.datos.natural;
                TREE['juridico'] = data.datos.juridico;
//                var datos = data.datos;
//                var top1 = 10;
//                for (var i in datos) {
//
//                    $('#canvas2').append('<div id="ejex' + top1 + '" style="top: ' + top1 + 'px;left: 250px;width: 250px;" class="window jtk-node"><strong>' + datos[i].variable + ' > ' + number_format(datos[i].valor, 0, ',', '.') + '</strong></div>');
//                    jsPlumb.connect({
//                        source: 'ejex' + top1,
//                        target: 'divInicio',
//                    }, common);
//                    top1 = top1 + 50;
//                }
            }

//            jsPlumb.draggable($(".jtk-node"));
            if (_idTipoAdminRiskTier == 'aplicarReglaNegocio')
                fillTree_arn(tipo);
            else if (_idTipoAdminRiskTier == 'configuracionReglaNegocio')
                fillTree(tipo);
        }
        /****/
    });
}

function fillTree_arn(_tipo) {
    $('#canvas2').empty();
    jsPlumb.ready(function () {
        $('#canvas2').append('<div class="window jtk-node" id="divInicio" style="padding: 0px;"><strong>Inicio</strong></div>');
    });
    var top1 = 10;
    var arrAux = [];
    if (_tipo == 1) {
        arrAux = TREE.natural;
    } else if (_tipo == 2) {
        arrAux = TREE.juridico;
    }
    for (var i in arrAux) {
        var divRisk = "";
        var ob = arrAux[i];
        var min;
        var max;
        divRisk = "<div>";
        divRisk += "<table border='1' style='width:100%'>";
        divRisk += "<tr>";
        divRisk += "<td colspan='2' align='center'>CH<sup>2</sup> " + Math.floor((Math.random() * (100 - 80)) + 80) + "%</td>";
        divRisk += "</tr>";
        divRisk += "<tr>";
        divRisk += "<td colspan='2' align='center'>N " + Math.floor((Math.random() * (350 - 200)) + 200) + "</td>";
        divRisk += "</tr>";
        divRisk += "<tr>";
        if (ob.risktier == "A") {
            min = Math.floor((Math.random() * (15 - 1)) + 1);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "B") {
            min = Math.floor((Math.random() * (25 - 16)) + 16);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "C") {
            min = Math.floor((Math.random() * (35 - 26)) + 26);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "D") {
            min = Math.floor((Math.random() * (45 - 36)) + 36);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "E") {
            min = Math.floor((Math.random() * (75 - 65)) + 65);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "F") {
            min = Math.floor((Math.random() * (85 - 76)) + 76);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        }
        divRisk += "</tr>";
        divRisk += "</table>";
        divRisk += "</div>";
        if (_tipo == 1) {
            $('#canvas2').append('<div id="ejex' + top1 + '" style="top: ' + top1 + 'px;left: 250px;width: 250px;" class="window jtk-node"><strong>' + ob.x + ' < ' + number_format(ob.valor_x, 0, ',', '.') + ' </strong></div>');
            if (i == 7) //conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejex' + top1 + '" style="top: ' + top1 + 'px; left: 250px;width: 250px; background: #ffd900;" class="window jtk-node"><strong>' + ob.x + ' < ' + number_format(ob.valor_x, 0, ',', '.') + ' </strong></div>');
        } else if (_tipo == 2) {
            $('#canvas2').append('<div id="ejex' + top1 + '" style="top: ' + top1 + 'px;left: 250px;width: 250px;" class="window jtk-node"><strong>' + ob.x + ' < ' + number_format(ob.valor_x, 0, ',', '.') + ' </strong></div>');
            if (i == 3) //conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejex' + top1 + '" style="top: ' + top1 + 'px; left: 250px;width: 250px; background: #ffd900;" class="window jtk-node"><strong>' + ob.x + ' < ' + number_format(ob.valor_x, 0, ',', '.') + ' </strong></div>');
        }

        jsPlumb.connect({
            source: 'ejex' + top1,
            target: 'divInicio',
            connector: ["Straight"]
        }, common);
        if (_tipo == 1) {
            $('#canvas2').append('<div id="ejey' + top1 + '" style="top: ' + top1 + 'px;left: 600px;width: 250px;" class="window jtk-node"><strong>' + ob.y + ' < ' + number_format(ob.valor_y, 0, ',', '.') + ' </strong></div>');
            if (i == 7)//conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejey' + top1 + '" style="top: ' + top1 + 'px;left: 600px;width: 250px; background: #ffd900;" class="window jtk-node"><strong>' + ob.y + ' < ' + number_format(ob.valor_y, 0, ',', '.') + ' </strong></div>');
        } else if (_tipo == 2) {
            $('#canvas2').append('<div id="ejey' + top1 + '" style="top: ' + top1 + 'px;left: 600px;width: 250px;" class="window jtk-node"><strong>' + ob.y + ' < ' + number_format(ob.valor_y, 0, ',', '.') + ' </strong></div>');
            if (i == 4)//conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejey' + top1 + '" style="top: ' + top1 + 'px;left: 600px;width: 250px; background: #ffd900;" class="window jtk-node"><strong>' + ob.y + ' < ' + number_format(ob.valor_y, 0, ',', '.') + ' </strong></div>');
        }
        jsPlumb.connect({
            source: 'ejey' + top1,
            target: 'ejex' + top1,
            connector: ["Straight"]
        }, common);
        if (_tipo == 1) {
            $('#canvas2').append('<div id="ejert' + top1 + '" style="top: ' + top1 + 'px;left: 950px;width: 50px;" class="window jtk-node"><strong>' + ob.risktier + ' </strong></div>');
            if (i == 7)//conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejert' + top1 + '" style="top: ' + top1 + 'px;left: 950px;width: 50px; background: #ffd900;" class="window jtk-node"><strong>' + ob.risktier + ' </strong></div>');
        } else if (_tipo == 2) {
            $('#canvas2').append('<div id="ejert' + top1 + '" style="top: ' + top1 + 'px;left: 950px;width: 50px;" class="window jtk-node"><strong data-container="body" data-toggle="popover" data-html="true" data-trigger="hover" data-content="' + divRisk + '">' + ob.risktier + ' </strong></div>');
            if (i == 4)//conmparar con parametro del cliente segÃºn RUT mediante WebServer:
                $('#canvas2').append('<div id="ejert' + top1 + '" style="top: ' + top1 + 'px;left: 950px;width: 50px; background: #ffd900;" class="window jtk-node"><strong data-container="body" data-toggle="popover" data-html="true" data-trigger="hover" data-content="' + divRisk + '">' + ob.risktier + ' </strong></div>');
        }

        jsPlumb.connect({
            source: 'ejert' + top1,
            target: 'ejey' + top1,
            connector: ["Straight"]
        }, common);
        top1 = top1 + 50;
    }

    jsPlumb.draggable($(".jtk-node"));
    $('[data-toggle="popover"]').popover();
}

// arma el arbol risk tier
function fillTree(_tipo) {
    $('#canvas2').empty();
    jsPlumb.ready(function () {
        $('#canvas2').append('<div class="window jtk-node" id="divInicio" style="padding: 0px;"><strong>Inicio</strong></div>');
    });
    //estilo;
    var top1 = 10;
    var arrAux = [];
    if (_tipo == 1) {
        arrAux = TREE.natural;
    } else if (_tipo == 2) {
        arrAux = TREE.juridico;
    }

    for (var i in arrAux) {

// **** X
        var divRisk = "";
        var primeroX;
        var anteriorX;
        var signoX;
        if (i == 0) {
            primeroX = (arrAux[i].valor_x * 1);
            anteriorX = 0;
            signoX = "";
        } else {
            if (primeroX < (arrAux[i].valor_x * 1)) {
                anteriorX = primeroX;
                primeroX = (arrAux[i].valor_x * 1);
                signoX = ">=";
            }
        }
//

///***y
        var inicial
        var primeroY;
        var anteriorY;
        var signoY;
        if (i == 0) {
//inicial = (arrAux[i].valor_y * 1);
            primeroY = (arrAux[i].valor_y * 1);
            anteriorY = 0;
            signoX = "";
            signoY = ">=";
        } else {

            if (primeroY < (arrAux[i].valor_y * 1)) {
                anteriorY = primeroY;
                primeroY = (arrAux[i].valor_y * 1);
                signoY = ">=";
            }
            if (primeroY > (arrAux[i].valor_y * 1)) {
                anteriorY = 0;
                primeroY = (arrAux[i].valor_y * 1);
                signoY = ">=";
            }
        }

        var ob = arrAux[i];
        var min;
        var max;
        divRisk = "<div>";
        divRisk += "<table border='1' style='width:100%'>";
        divRisk += "<tr>";
        divRisk += "<td colspan='2' align='center'>CH<sup>2</sup> " + Math.floor((Math.random() * (100 - 80)) + 80) + "%</td>";
        divRisk += "</tr>";
        divRisk += "<tr>";
        divRisk += "<td colspan='2' align='center'>N " + Math.floor((Math.random() * (350 - 200)) + 200) + "</td>";
        divRisk += "</tr>";
        divRisk += "<tr>";
        if (ob.risktier == "A") {
            min = Math.floor((Math.random() * (15 - 1)) + 1);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "B") {
            min = Math.floor((Math.random() * (25 - 16)) + 16);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "C") {
            min = Math.floor((Math.random() * (35 - 26)) + 26);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "D") {
            min = Math.floor((Math.random() * (45 - 36)) + 36);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "E") {
            min = Math.floor((Math.random() * (75 - 65)) + 65);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        } else if (ob.risktier == "F") {
            min = Math.floor((Math.random() * (85 - 76)) + 76);
            max = 100 - min;
            divRisk += "<td><sup>M</sup>" + min + "%</td>";
            divRisk += "<td><sup>B</sup>" + max + "%</td>";
        }

        divRisk += "</tr>";
        divRisk += "</table>";
        divRisk += "</div>";
        $('#canvas2').append('<div onclick="editarRiskTierEnElArbol()" id="ejex' + top1 + '" style="top: ' + top1 + 'px;left: 250px;width: 460px;" class="window jtk-node"><strong>' + ob.x + ' ' + signoX + ' ' + number_format(anteriorX, 0, ',', '.') + ' && ' + ' <= ' + number_format(primeroX, 0, ',', '.') + ' </strong></div>');
        jsPlumb.connect({
            source: 'ejex' + top1,
            target: 'divInicio',
            connector: ["Straight"]
        }, common);
        $('#canvas2').append('<div onclick="editarRiskTierEnElArbol()" id="ejey' + top1 + '" style="top: ' + top1 + 'px;left: 800px;width: 460px;" class="window jtk-node"><strong>' + ob.y + ' ' + signoY + ' ' + number_format(anteriorY, 0, ',', '.') + ' && ' + ' <= ' + number_format(primeroY, 0, ',', '.') + ' </strong></div>');
        jsPlumb.connect({
            source: 'ejey' + top1,
            target: 'ejex' + top1,
            connector: ["Straight"]
        }, common);
        $('#canvas2').append('<div id="ejert' + top1 + '" style="top: ' + top1 + 'px;left: 1350px;width: 50px;" class="window jtk-node"><strong data-container="body" data-toggle="popover" data-html="true" data-trigger="hover" data-content="' + divRisk + '">' + ob.risktier + ' </strong></div>');
        jsPlumb.connect({
            source: 'ejert' + top1,
            target: 'ejey' + top1,
            connector: ["Straight"]
        }, common);
        top1 = top1 + 50;
    }

    jsPlumb.draggable($(".jtk-node"))

    $('[data-toggle="popover"]').popover();
}

// EDITAR RISKTIER EN EL ARBOL JMora 11-09-2017 ********************************

function editarRiskTierEnElArbol() {
    $('#ModaleditarRiskTierEnElArbol').modal({backdrop: 'static'});
    //** tipo =[1 = natural. 2 = judicial], pantalla = 1 Editar Matriz Risk Tier
    var tipo = $('#tipo').val();
    if (tipo == 1) {
        $('#tituloModalEditarMatrizRisktier').html('Editar Matriz Risk Tier Natural');
        $('#tipoMatriz').val(tipo);
    } else {
        $('#tituloModalEditarMatrizRisktier').html('Editar Matriz Risk Tier Juridico');
        $('#tipoMatriz').val(tipo);
    }
    buscarRiskTier(tipo, 1);
}

function validarCaracteres(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8)
        return true;
    if (tecla == 9)
        return true;
    if (tecla == 11)
        return true;
    var patron = /[1234567890]/;
    var te = String.fromCharCode(tecla);
    return patron.test(te);
}

var cabecera_tabla_core_original = [];
var valor_tabla_core_original = [];

//crear matriz
function crearMatrizRiskTier(idTipo) {
    $('#tablaRiskTier').text(''); //limpiar tabla
    if (idTipo == 1) {
        var cab = arrCab[0].tipoAdminRiskTier.id == 1 ? arrCab[0] : arrCab[1];
        var row = 0;
        $('#tablaRiskTier').append('<tr><th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' / ' + cab.origenX.nombre + '</th></tr>');
        for (var i = 0; i < origenY_N.length; i++) {
            var fila = '<tr>'
            if (row == 0) {
                fila += '<th></th>';
                for (var j in origenX_N) {
                    fila += '<th style="text-align: center;"><input id="' + origenX_N[j].id + '" type="number" value="' + origenX_N[j].valor + '" onkeypress="return validarCaracteres(event)"></th>';
                    var obTemporal = new Object();
                    obTemporal.id = origenX_N[j].id;
                    obTemporal.valor = origenX_N[j].valor;
                    cabecera_tabla_core_original.push(obTemporal);
                }
                row = 1;
                i--;
            } else {
                fila += '<th style="text-align: center;"><input id="' + origenY_N[i].id + '" type="number" value="' + origenY_N[i].valor + '" onkeypress="return validarCaracteres(event)"></th>'
                var obTemporal = new Object();
                obTemporal.id = origenY_N[i].id;
                obTemporal.valor = origenY_N[i].valor;
                cabecera_tabla_core_original.push(obTemporal);
                for (var j in origenX_N) {
                    fila += '<td><select id="' + origenY_N[i].id + '_' + origenX_N[j].id + '" class="form-control" onchange="cambioDeColor(this)">';
                    for (var f in RISKTIER) {
                        switch (RISKTIER[f].id) {
                            case 1:
                                //A
                                fila += '<option class="' + _Acolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 2:
                                //B
                                fila += '<option class="' + _Bcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 3:
                                //C
                                fila += '<option class="' + _Ccolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 4:
                                //D
                                fila += '<option class="' + _Dcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 5:
                                //E
                                fila += '<option class="' + _Ecolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            default:
                                //F
                                fila += '<option class="' + _Fcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                        }
                    }
                    fila += '</select></td>';
                }
            }
            fila += '</tr>';
            $('#tablaRiskTier').append(fila);
        }

        //marco las letras
        for (var i in valor_tabla_core_Natural) {
            for (var j in RISKTIER) {
                if (RISKTIER[j].id == valor_tabla_core_Natural[i].idRiskTier) {
                    $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).val(RISKTIER[j].id);
                    $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).removeClass();
                    switch (RISKTIER[j].id) {
                        case 1:
                            //A
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Acolor);
                            break;
                        case 2:
                            //B
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Bcolor);
                            break;
                        case 3:
                            //C
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Ccolor);
                            break;
                        case 4:
                            //D
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Dcolor);
                            break;
                        case 5:
                            //E
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Ecolor);
                            break;
                        default:
                            //F
                            $('#' + valor_tabla_core_Natural[i].y.idRiskIndicator + '_' + valor_tabla_core_Natural[i].x.idRiskIndicator).addClass(_Fcolor);
                    }
                    break;
                }
            }
        }
        //capturo los valores tabla core originales
        for (var i in origenY_N) {
            for (var x in origenX_N) {
                var obTemporal = new Object();
                obTemporal.idX = origenX_N[x].id
                obTemporal.idY = origenY_N[i].id;
                obTemporal.valor = $('#' + origenY_N[i].id + '_' + origenX_N[x].id).val();
                valor_tabla_core_original.push(obTemporal);
            }
        }

    } else if (idTipo == 2) {
        var cab = arrCab[1].tipoAdminRiskTier.id == 2 ? arrCab[1] : arrCab[0];
        var row = 0;
        $('#tablaRiskTier').append('<tr><th style="text-align: center; font-size:13px; max-width: 100px;">' + cab.origenY.nombre + ' / ' + cab.origenX.nombre + '</th></tr>');
        for (var i = 0; i < origenY_J.length; i++) {
            var fila = '<tr>'
            if (row == 0) {
                fila += '<th></th>';
                for (var j in origenX_J) {
                    fila += '<th style="text-align: center;"><input id="' + origenX_J[j].id + '" type="number" value="' + origenX_J[j].valor + '" onkeypress="return validarCaracteres(event)"></th>';
                    var obTemporal = new Object();
                    obTemporal.id = origenX_J[j].id;
                    obTemporal.valor = origenX_J[j].valor;
                    cabecera_tabla_core_original.push(obTemporal);
                }
                row = 1;
                i--;
            } else {
                fila += '<th style="text-align: center;"><input id="' + origenY_J[i].id + '" type="number" value="' + origenY_J[i].valor + '" onkeypress="return validarCaracteres(event)"></th>'
                var obTemporal = new Object();
                obTemporal.id = origenY_J[i].id;
                obTemporal.valor = origenY_J[i].valor;
                cabecera_tabla_core_original.push(obTemporal);
                for (var j in origenX_J) {
                    fila += '<td><select id="' + origenY_J[i].id + '_' + origenX_J[j].id + '" class="form-control" onchange="cambioDeColor(this)">';
                    for (var f in RISKTIER) {
                        switch (RISKTIER[f].id) {
                            case 1:
                                //A
                                fila += '<option class="' + _Acolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 2:
                                //B
                                fila += '<option class="' + _Bcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 3:
                                //C
                                fila += '<option class="' + _Ccolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 4:
                                //D
                                fila += '<option class="' + _Dcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            case 5:
                                //E
                                fila += '<option class="' + _Ecolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                                break;
                            default:
                                //F
                                fila += '<option class="' + _Fcolor + '" value="' + RISKTIER[f].id + '">' + RISKTIER[f].nombre + '</option>';
                        }
                    }
                    fila += '</select></td>';
                }
            }
            fila += '</tr>';
            $('#tablaRiskTier').append(fila);
        }
        //marco las letras
        for (var i in valor_tabla_core_Judicial) {
            for (var j in RISKTIER) {
                if (RISKTIER[j].id == valor_tabla_core_Judicial[i].idRiskTier) {
                    $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).val(RISKTIER[j].id);
                    $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).removeClass();
                    switch (RISKTIER[j].id) {
                        case 1:
                            //A
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Acolor);
                            break;
                        case 2:
                            //B
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Bcolor);
                            break;
                        case 3:
                            //C
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Ccolor);
                            break;
                        case 4:
                            //D
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Dcolor);
                            break;
                        case 5:
                            //E
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Ecolor);
                            break;
                        default:
                            //F
                            $('#' + valor_tabla_core_Judicial[i].y.idRiskIndicator + '_' + valor_tabla_core_Judicial[i].x.idRiskIndicator).addClass(_Fcolor);

                    }
                    break;
                }
            }
        }
        //capturo los valores tabla core originales
        for (var i in origenY_J) {
            for (var x in origenX_J) {
                var obTemporal = new Object();
                obTemporal.idX = origenX_J[x].id
                obTemporal.idY = origenY_J[i].id;
                obTemporal.valor = $('#' + origenY_J[i].id + '_' + origenX_J[x].id).val();
                valor_tabla_core_original.push(obTemporal);
            }
        }
    }
}

function cambioDeColor(select) {
    var id = select.id;
    var claseOpcion = $("#" + id + " option:selected").attr("class");
    $("#" + id).removeClass();
    $("#" + id).addClass(claseOpcion);
}

function editarMatrizRiskTierEnElArbol(idTipo) {
    var cabecera_tabla_core_temporal = [];
    var cabecera_tabla_core_temporalX = [];
    var cabecera_tabla_core_temporalY = [];
    var valor_tabla_core_temporal = [];

    var cabecera_tabla_core_FINAL = [];
    var valor_tabla_core_FINAL = [];
    //******************* CAPTURO DATOS **************************************//
    var tipo = $('#tipoMatriz').val();
    if (tipo == 1) {
        //************************************************ RISKTIER NATURAL
        /***** cabecera_tabla_core ******/
        // eje X
        for (var j in origenX_N) {
            var obTemporal = new Object();
            obTemporal.id = $('#' + origenX_N[j].id).attr("id");
            obTemporal.valor = $('#' + origenX_N[j].id).val();
            cabecera_tabla_core_temporal.push(obTemporal);
            cabecera_tabla_core_temporalX.push(obTemporal);
        }
        // eje Y
        for (var F in origenY_N) {
            var obTemporal = new Object();
            obTemporal.id = $('#' + origenY_N[F].id).attr("id");
            obTemporal.valor = $('#' + origenY_N[F].id).val();
            cabecera_tabla_core_temporal.push(obTemporal);
            cabecera_tabla_core_temporalY.push(obTemporal);
        }
        /***** valor_tabla_core *****/
        for (var i in origenY_N) {
            for (var x in origenX_N) {
                var obTemporal = new Object();
                obTemporal.idX = origenX_N[x].id
                obTemporal.idY = origenY_N[i].id;
                obTemporal.valor = $('#' + origenY_N[i].id + '_' + origenX_N[x].id).val();
                valor_tabla_core_temporal.push(obTemporal);
            }
        }
    } else {
        //************************************************ RISKTIER JUDICIAL
        /***** cabecera_tabla_core ******/
        // eje X
        for (var j in origenX_J) {
            var obTemporal = new Object();
            obTemporal.id = $('#' + origenX_J[j].id).attr("id");
            obTemporal.valor = $('#' + origenX_J[j].id).val();
            cabecera_tabla_core_temporal.push(obTemporal);
            cabecera_tabla_core_temporalX.push(obTemporal);
        }
        // eje Y
        for (var F in origenY_J) {
            var obTemporal = new Object();
            obTemporal.id = $('#' + origenY_J[F].id).attr("id");
            obTemporal.valor = $('#' + origenY_J[F].id).val();
            cabecera_tabla_core_temporal.push(obTemporal);
            cabecera_tabla_core_temporalY.push(obTemporal);
        }
        /***** valor_tabla_core *****/
        for (var i in origenY_J) {
            for (var x in origenX_J) {
                var obTemporal = new Object();
                obTemporal.idX = origenX_J[x].id
                obTemporal.idY = origenY_J[i].id;
                obTemporal.valor = $('#' + origenY_J[i].id + '_' + origenX_J[x].id).val();
                valor_tabla_core_temporal.push(obTemporal);
            }
        }
    }
//******************* VALIDACIONES DE LOS NUEVOS DATOS *******************//
// validar que vengan datos
    var error = 0;
    for (var i in cabecera_tabla_core_original) {
        if (cabecera_tabla_core_temporal[i].valor != cabecera_tabla_core_original[i].valor) {
            cabecera_tabla_core_FINAL.push(cabecera_tabla_core_temporal[i]);
        }
    }
    for (var i in valor_tabla_core_original) {
        if (valor_tabla_core_temporal[i].valor != valor_tabla_core_original[i].valor) {
            valor_tabla_core_FINAL.push(valor_tabla_core_temporal[i]);
        }
    }
    if (cabecera_tabla_core_FINAL.length == 0 && valor_tabla_core_FINAL.length == 0) {
        swal('Atencion', 'Debe realizar un cambio para poder editar. ', 'info');
        error++;
        return;
    }
    //validar que el valor sigiente en la cabecera siempre sea mayor
    // eje X
    if ((cabecera_tabla_core_temporalX[0].valor * 1) <= 0) {
        swal('Atencion', 'El valor inicial de una cabecera no puede ser 0. ', 'info');
        error++;
        return;
    }
    var x = 1;
    for (var i in cabecera_tabla_core_temporalX) {
        if (x != (cabecera_tabla_core_temporalX.length - 1)) {
            if ((cabecera_tabla_core_temporalX[i].valor * 1) >= (cabecera_tabla_core_temporalX[x].valor * 1)) {
                swal('Atencion', 'El valor ' + cabecera_tabla_core_temporalX[i].valor + ' no puede ser mayor que el valor ' + cabecera_tabla_core_temporalX[x].valor + ' ', 'info');
                error++;
                return;
            }
            x++;
        } else {
            if ((cabecera_tabla_core_temporalX[(i - 1)].valor * 1) >= (cabecera_tabla_core_temporalX[x].valor * 1)) {
                swal('Atencion', 'El valor ' + cabecera_tabla_core_temporalX[(i - 1)].valor + ' no puede ser mayor que el valor ' + cabecera_tabla_core_temporalX[x].valor + ' ', 'info');
                error++;
                return;
            }
        }
    }

    // eje Y
    if ((cabecera_tabla_core_temporalY[0].valor * 1) <= 0) {
        swal('Atencion', 'El valor inicial de una cabecera no puede ser 0. ', 'info');
        error++;
        return;
    }
    var x = 1;
    for (var i in cabecera_tabla_core_temporalY) {
        if (x != (cabecera_tabla_core_temporalY.length - 1)) {
            if ((cabecera_tabla_core_temporalY[i].valor * 1) >= (cabecera_tabla_core_temporalY[x].valor * 1)) {
                swal('Atencion', 'El valor ' + cabecera_tabla_core_temporalY[i].valor + ' no puede ser mayor que el valor ' + cabecera_tabla_core_temporalY[x].valor + ' ', 'info');
                error++;
                return;
            }
            x++;
        } else {
            if ((cabecera_tabla_core_temporalY[(i - 1)].valor * 1) >= (cabecera_tabla_core_temporalY[x].valor * 1)) {
                swal('Atencion', 'El valor ' + cabecera_tabla_core_temporalY[(i - 1)].valor + ' no puede ser mayor que el valor ' + cabecera_tabla_core_temporalY[x].valor + ' ', 'info');
                error++;
                return;
            }
        }
    }

    if (error == 0) {
        swal({
                title: "Â¿Editar?",
                text: "Los cambios no podrÃ¡n revertirse ",
                /*tipo de swal*/
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0088cc",
                confirmButtonText: "Editar",
                closeOnConfirm: false
            },
            function () {
                $.ajax({
                    url: 'Svl_RiskTier',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'editarMatrizRiskTier',
                        cabecera_tabla_core_FINAL: JSON.stringify(cabecera_tabla_core_FINAL),
                        valor_tabla_core_FINAL: JSON.stringify(valor_tabla_core_FINAL)
                    }, success: function (data, textStatus, jqXHR) {
                        if (data.estado === 200) {
                            swal('OK', 'La Matriz Risk Tier se editÃ³ correctamente ', 'success');
                            getPoliticasRiskTier('configuracionReglaNegocio', _tipoRiskTierSelect);
                        } else {
                            swal('Atencion', data.mensaje, 'error');
                        }
                    }
                });

            });
    }

}


