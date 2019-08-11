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

                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: "/v1/rest/users/search?username=" + $('#username_search_edit_user').val().trim() + "&email=" + $('#username_search_edit_user').val().trim() + "&organizationId=" + $('#organization').val().trim(),
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        success: function (data, textStatus, jqXHR) {
                            $('#id_edit_user').val(data.idUser);
                            $('#rol_edit_user').val(data.role.idRole + '');
                            $('#username_edit_user').val(data.username);
                            $('#email_edit_user').val(data.email);
                            if (!data.nonLocked) {
                                $('#btn_disabled').attr('hidden', 'hidden');
                                $('#btn_enabled').removeAttr('hidden');
                            } else {
                                $('#btn_enabled').attr('hidden', 'hidden');
                                $('#btn_disabled').removeAttr('hidden');
                            }

                            $('#form_search_edit_user').attr('hidden', 'hidden');
                            $('#form_edit_user').removeAttr('hidden');
                            $('.kt-portlet__foot').removeAttr('hidden');
                            KTApp.unprogress(btn);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            KTApp.unprogress(btn);
                            if (jqXHR.status == 404) {
                                swal.fire({
                                    "title": "",
                                    "text": "Nombre de usuario no encontrado por favor intente con otro!",
                                    "type": "error",
                                    "confirmButtonClass": "btn btn-secondary"
                                });
                                $('#username_search_edit_user').addClass('is-invalid');
                                $('#username_search_edit_user').val('');
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
            if ($('#btn_search_edit_user:hidden').length == 0) {
                $('#btn_search_edit_user').click();
            } else {
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
                                user["idUser"] = $('#id_edit_user').val().trim();
                                user["username"] = $('#username_edit_user').val().trim();
                                user["email"] = $('#email_edit_user').val().trim();
                                user["organizationId"] = $('#organization').val().trim();
                                user["roleId"] = $('#rol_edit_user').val().trim();
                                user["resetPassword"] = $('#reset_edit_user:checked').val() == "on" ? '1' : '0';
                                $.ajax({
                                    type: "patch",
                                    contentType: "application/json",
                                    url: "/v1/rest/users",
                                    data: JSON.stringify(user),
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data, textStatus, jqXHR) {
                                        KTApp.unprogress(btn);
                                        if (data.autoUpdate == true) {
                                            Swal.fire({
                                                title: "",
                                                text: "Su usuario ha sido guardado correctamente, se cerrará sesión para que ingrese con los nuevos datos!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/logout"
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                title: "",
                                                text: "El usuario ha sido guardado correctamente, los cambios se reflejarán en el próximo inicio de sesión!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/users/edit"
                                                }
                                            });
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        KTApp.unprogress(btn);
                                        if (jqXHR.responseJSON.error != undefined && jqXHR.responseJSON.error == "Username Already Exist") {
                                            swal.fire({
                                                "title": "",
                                                "text": "Nombre de usuario ya registrado, por favor cámbielo por otro!",
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
                                        } else if (jqXHR.responseJSON.error != undefined && jqXHR.responseJSON.error == "You are last admin of organization, impossible disable you!!!") {
                                            swal.fire({
                                                "title": "",
                                                "text": "Este usrio es el último administrador, no puede cambiar de rol puesto que ninguna organización puede quedar sin administradores!",
                                                "type": "error",
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
                                });
                            }
                        }
                    });
            }
        });
    }

    var initDisabled = function () {
        var btn = $('#btn_disabled');
        btn.on('click', function (e) {
            e.preventDefault();
            if ($('#btn_search_edit_user:hidden').length == 0) {
                $('#btn_search_edit_user').click();
            } else {
                Swal.fire({
                    title: '¿Está seguro de deshabilitar el usuario?',
                    text: "Si deshabilita al usuario, la próxima vez que ingrese al sistema se verán reflejados los cambios.",
                    type: 'warning',
                    showCancelButton: true,
                    cancelButtonText: "Atrás",
                    confirmButtonText: 'Si, deseo deshabilitar al usuario!'
                })
                    .then(function (result) {
                        if (result.value) {
                            if (validator.form()) {
                                KTApp.progress(btn);
                                var user = {};
                                user["target"] = false;
                                $.ajax({
                                    type: "post",
                                    contentType: "application/json",
                                    url: "/v1/rest/users/" + $('#id_edit_user').val().trim() + "/activation",
                                    data: JSON.stringify(user),
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data, textStatus, jqXHR) {
                                        KTApp.unprogress(btn);
                                        if (data.autoUpdate == true) {
                                            Swal.fire({
                                                title: "",
                                                text: "Su usuario ha sido deshabilitado, se cerrará sesión!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/logout"
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                title: "",
                                                text: "El usuario ha sido deshabilitado, los cambios se reflejarán en el próximo inicio de sesión!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/users/edit"
                                                }
                                            });
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        KTApp.unprogress(btn);
                                        if (jqXHR.status == 409) {
                                            swal.fire({
                                                "title": "",
                                                "text": "No puede quedar una organización sin un usuario administrador habilitado!",
                                                "type": "error",
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
                                });
                            }
                        }
                    });
            }
        });
    }
    var initEnabled = function () {
        var btn = $('#btn_enabled');
        btn.on('click', function (e) {
            e.preventDefault();
            if ($('#btn_search_edit_user:hidden').length == 0) {
                $('#btn_search_edit_user').click();
            } else {
                Swal.fire({
                    title: '¿Está seguro de habilitar el usuario?',
                    text: "Si habilita al usuario, la próxima vez que ingrese al sistema se verán reflejados los cambios.",
                    type: 'warning',
                    showCancelButton: true,
                    cancelButtonText: "Atrás",
                    confirmButtonText: 'Si, deseo habilitar al usuario!'
                })
                    .then(function (result) {
                        if (result.value) {
                            if (validator.form()) {
                                KTApp.progress(btn);
                                var user = {};
                                user["target"] = true;
                                $.ajax({
                                    type: "post",
                                    contentType: "application/json",
                                    url: "/v1/rest/users/" + $('#id_edit_user').val().trim() + "/activation",
                                    data: JSON.stringify(user),
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data, textStatus, jqXHR) {
                                        KTApp.unprogress(btn);
                                        if (data.autoUpdate == true) {
                                            Swal.fire({
                                                title: "",
                                                text: "Su usuario ha sido habilitado, se cerrará sesión!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/logout"
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                title: "",
                                                text: "El usuario ha sido habilitado, los cambios se reflejarán en el próximo inicio de sesión!",
                                                type: "success",
                                                onClose: function () {
                                                    window.location = "/users/edit"
                                                }
                                            });
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        KTApp.unprogress(btn);
                                        swal.fire({
                                            "title": "",
                                            "text": "Ha ocurrido un error inesperado, por favor intente nuevamente!",
                                            "type": "error",
                                            "confirmButtonClass": "btn btn-secondary"
                                        });
                                    }
                                });
                            }
                        }
                    });
            }
        });
    }

    return {
        // public functions
        init: function () {
            form = $('#edit-user');
            initValidation();
            initCreate();
            initSearch();
            initDisabled();
            initEnabled();
        }
    };
}();