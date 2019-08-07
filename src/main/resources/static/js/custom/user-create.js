"use strict";

// Class definition
var User = function () {
    var createUser = function () {
        $("#btn_create_user").on('click', function () {
            KTApp.progress($("#btn_create_user"));
            createUser();
        });
    }
    var createUser = function () {
        var form = $("#btn_create_user").closest('form');
        form.validate({
            rules: {
                username: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                rol: {
                    required: true
                },
                password: {
                    required: true
                },
                rpassword: {
                    required: true,
                    equalTo: "#rpassword"
                }
            }
        });

        if (!form.valid()) {
            return;
        }

        Swal.fire({
            title: '¿Está seguro de guardar?',
            text: "Si guarda esto, se creará un nuevo usario para su empresa.",
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: "Atrás",
            confirmButtonText: 'Si, deseo guardar!'
        })
            .then(function (result) {
                if (result.value) {
                    if (validatorExcel.form()) {
                        KTApp.progress(btn);
                        var usuario = {}
                        usuario["username"] = $("#username").val();
                        usuario["email"] = $("#email").val();
                        usuario["pass"] = $("#password").val();
                        usuario["rol"] = $("#rol").val();
                        usuario["organization"] = $("#organization").val();

                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "/v1/rest/user/register",
                            data: JSON.stringify(usuario),
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            success: function (data, textStatus, jqXHR) {
                                KTApp.unprogress(btn);
                                Swal.fire({
                                    title: '',
                                    text: "Muchas gracias! Las instrucciones para completar el registro se han enviado al correo.",
                                    type: 'success'
                                });
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.responseJSON != undefined || jqXHR.responseJSON.error != undefined || jqXHR.responseJSON.error == 'Registered email') {
                                    Swal.fire({
                                        title: '',
                                        text: "El correo electrónico ya está registrado en el sistema.",
                                        type: 'error'
                                    });
                                } else if (jqXHR.responseJSON != undefined || jqXHR.responseJSON.error != undefined || jqXHR.responseJSON.error == 'Registered user') {
                                    Swal.fire({
                                        title: '',
                                        text: "El nombre de usuario ya está registrado en el sistema.",
                                        type: 'error'
                                    });
                                } else {
                                    Swal.fire({
                                        title: '',
                                        text: "Ha ocurrido un problema al realizar el registro, por favor intente nuevamente mas tarde. Si el problema persiste comuníquese con el administrador del sistema.",
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    }
                }
            });

    }

    return {
        // Init demos
        init: function () {
            createUser();
        }
    };
}();


// Class initialization on page load
jQuery(document).ready(function () {
    User.init();
});