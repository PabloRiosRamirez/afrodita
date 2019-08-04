"use strict";

// Class definition
var AnalysisDashboard = function () {
    var initAnalysisExcel = function () {
        $("#btn_submit_analysis_excel").on('click', function () {
            KTApp.progress($("#btn_submit_analysis_excel"));
            sendByExcel(document.querySelector("#analysis_file").files[0], $("#btn_submit_analysis_excel"));
        });
    }
    var initAnalysisBureau = function () {
        $("#btn_submit_analysis_bureau").on('click', function () {
            KTApp.progress($("#btn_submit_analysis_bureau"));
            sendByBureau($("#analysis_file").val(), $("#btn_submit_analysis_bureau"));
        });
    }
    var sendByExcel = function (file, btn) {
        var formData = new FormData();
        formData.append("file", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/analysis/" + $('#organization').val() + "/excel");
        xhr.onload = function () {
            KTApp.unprogress(btn);
            if (xhr.status == 200) {
                swal.fire({
                    "title": "",
                    "text": "La configuración de Data Integration ha sido guardado correctamente!",
                    "type": "success",
                    "confirmButtonClass": "btn btn-secondary"
                });
            } else {
                swal.fire({
                    "title": "",
                    "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        }
        xhr.send(formData);
    }
    var sendByBureau = function (rut, btn) {
        KTApp.progress(btn);
        var request = {};
        request["rut"] = $('#bureau_rut').val();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/analysis/" + $('#organization').val() + "/bureau",
            data: JSON.stringify(request),
            dataType: 'json',
            cache: false,
            timeout: 60000,
            success: function (data, textStatus, jqXHR) {
                KTApp.unprogress(btn);
                Swal.fire({
                    title: "",
                    text: "La configuración de Data Integration ha sido guardado correctamente!",
                    type: "success",
                    onClose: function () {
                        window.location = "/dataintegration"
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                KTApp.unprogress(btn);
                Swal.fire({
                    "title": "",
                    "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });

            }
        });
    }
    return {
        // Init demos
        init: function () {
            initAnalysisExcel();
            initAnalysisBureau();
        }
    };
}();


// Class initialization on page load
jQuery(document).ready(function () {
    AnalysisDashboard.init();
});