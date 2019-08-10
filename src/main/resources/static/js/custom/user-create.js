jQuery(document).ready(function () {
    KTWizard3.init();
});
var KTWizard3 = function () {
    var form;
    var validator;

    var initValidation = function () {
        validator = form.validate({
            ignore: ":hidden",
            rules: {
                //= Step 1
                rol_create_user: {
                    required: true
                },
                username_create_user: {
                    required: true
                },
                email_create_user: {
                    required: true,
                    email: true
                },
                pass_create_user: {
                    required: true
                },
                rpass_create_user: {
                    required: true,
                    equalTo: "#pass_create_user"
                }
            }
        });
    }

    var initCreate = function () {
        var btn = $('#btn_create_user');
        btn.on('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Está seguro de guardar el usuario?',
                text: "Si guarda esto, para que el usuario pueda ingresar al sistema deberá activar su cuenta a través del buzón de correo electrónico.",
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Atrás",
                confirmButtonText: 'Si, deseo guardar!'
            })
                .then(function (result) {
                    if (result.value) {
                        if (validator.form()) {
                            KTApp.progress(btn);
                            var user = {};
                            user["username"] = $('#username_create_user').val().trim();
                            user["email"] = $('#email_create_user').val().trim();
                            user["pass"] = $('#pass_create_user').val().trim();
                            user["organizationId"] = $('#organization').val().trim();
                            user["roleId"] = $('#rol_create_user').val().trim();
                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: "/v1/rest/users",
                                data: JSON.stringify(user),
                                dataType: 'json',
                                cache: false,
                                timeout: 60000,
                                success: function (data, textStatus, jqXHR) {
                                    KTApp.unprogress(btn);
                                    Swal.fire({
                                        title: "",
                                        text: "El usuario ha sido guardado correctamente, se han enviado las instrucciones de activación de cuenta al correo!",
                                        type: "success",
                                        onClose: function () {
                                            window.location = "/users/create"
                                        }
                                    });
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    KTApp.unprogress(btn);
                                    if (jqXHR.responseJSON.error != undefined && jqXHR.responseJSON.error == "Username Already Exist") {
                                        swal.fire({
                                            "title": "",
                                            "text": "Nombre de usuario ya registrado, por favor cambielo por otro!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });
                                        $('#username_create_user').addClass('is-invalid');
                                        $('#username_create_user').val('');
                                    } else if (jqXHR.responseJSON.error != undefined && jqXHR.responseJSON.error == "Email Already Exist") {
                                        swal.fire({
                                            "title": "",
                                            "text": "Correo electrónico ya registrado, por favor ocupe otro!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });
                                        $('#email_create_user').addClass('is-invalid');
                                        $('#email_create_user').val('');
                                    } else {
                                        swal.fire({
                                            "title": "",
                                            "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
        });
    }

    return {
        // public functions
        init: function () {
            form = $('#create-user');
            initCreate();
            initValidation();
        }
    };
}();