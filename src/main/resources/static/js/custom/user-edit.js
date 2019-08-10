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
                username_search_edit_user: {
                    required: true
                },
                rol_edit_user: {
                    required: true
                },
                username_edit_user: {
                    required: true
                },
                email_edit_user: {
                    required: true,
                    email: true
                }
            }
        });
    }

    var initSearch = function () {
        var btn = $('#btn_search_edit_user');
        btn.on('click', function (e) {
            e.preventDefault();
            if (validator.form()) {
                KTApp.progress(btn);
                if ($('#username_search_edit_user').val().length > 0) {

                    
                    $('#form_search_edit_user').attr('hidden', 'hidden');
                    $('#form_edit_user').removeAttr('hidden');
                    $('.kt-portlet__foot').removeAttr('hidden');
                }
            }
        });
        $('#btn_back_search_edit_user').on('click', function (e) {
            e.preventDefault();
            $('#form_search_edit_user').removeAttr('hidden');
            $('#form_edit_user').attr('hidden', 'hidden');
            $('#username_search_edit_user').val('');
            $('.kt-portlet__foot').attr('hidden', 'hidden');
        });

    }

    var initCreate = function () {
        var btn = $('#btn_edit_user');
        btn.on('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Está seguro de editar el usuario?',
                text: "Si edita al usuario, la próxima vez que ingrese al sistema se verán reflejados los cambios.",
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
                            user["username"] = $('#username_edit_user').val().trim();
                            user["email"] = $('#email_edit_user').val().trim();
                            user["pass"] = $('#pass_edit_user').val().trim();
                            user["organizationId"] = $('#organization').val().trim();
                            user["roleId"] = $('#rol_edit_user').val().trim();
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
                                            window.location = "/users/edit"
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
                                        $('#username_edit_user').addClass('is-invalid');
                                        $('#username_edit_user').val('');
                                    } else if (jqXHR.responseJSON.error != undefined && jqXHR.responseJSON.error == "Email Already Exist") {
                                        swal.fire({
                                            "title": "",
                                            "text": "Correo electrónico ya registrado, por favor ocupe otro!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });
                                        $('#email_edit_user').addClass('is-invalid');
                                        $('#email_edit_user').val('');
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
            form = $('#edit-user');
            initValidation();
            initCreate();
            initSearch();
        }
    };
}();