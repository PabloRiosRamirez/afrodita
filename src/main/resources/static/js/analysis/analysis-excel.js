"use strict";

// Class definition
var KTDashboard = function () {

    var initSendFileExcel = function () {
        $("#btn_submit_analysis_excel").on('click', function () {
            sendFile(document.querySelector("#file_analysis").files[0], $("#btn_submit_analysis_excel"));
        });
    }

    var sendFile = function (file, btn) {
        var formData = new FormData();
        formData.append("file", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/v1/rest/analysis/" + $('#organization').val() + "/file");
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
            initSendFileExcel();
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    // KTDashboard.init();
});