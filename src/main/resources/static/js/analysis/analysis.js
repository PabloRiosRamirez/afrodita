"use strict";

// Class definition
var AnalysisDashboard = function () {
    var initAnalysisExcel = function () {
        $("#btn_submit_analysis_excel").on('click', function () {
            KTApp.progress($("#btn_submit_analysis_excel"));
            sendFile(document.querySelector("#analysis_file").files[0], $("#btn_submit_analysis_excel"));
        });
    }
    var sendFile = function (file, btn) {
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
    return {
        // Init demos
        init: function () {
            initAnalysisExcel();
        }
    };
}();


// Class initialization on page load
jQuery(document).ready(function () {
    AnalysisDashboard.init();
});