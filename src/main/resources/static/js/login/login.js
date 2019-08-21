"use strict";

var showErrorMsg = function (form, type, msg) {
    var alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

    form.find('.alert').remove();
    alert.prependTo(form);
    //alert.animateClass('fadeIn animated');
    KTUtil.animateClass(alert[0], 'fadeIn animated');
    alert.find('span').html(msg);
}

// Class Definition
var KTLoginGeneral = function () {

    var login = $('#kt_login');

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');

    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            form.submit();
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');
            $.validator.addMethod('validateRut', function (value, element, param) {
                return $.validateRut(value);
            }, 'Rut invalido');
            $.validator.addMethod('forcePassword', function (value, element, param) {
                return value.match(/^(?=.*\d)(?=.*[\u0021-\u002b\u002d-\u002e\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/);
            }, 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico.');
            form.validate({
                rules: {
                    username: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        forcePassword: true
                    },
                    rpassword: {
                        required: true,
                        equalTo: "#kt-login__signup-password"
                    },
                    rut_organization: {
                        required: true,
                        validateRut: true
                    },
                    name_organization: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);


            var organization = {}
            organization["name"] = $("#kt-login__signup-name_organization").val();
            organization["rut"] = $("#kt-login__signup-rut_organization").val();

            var usuario = {}
            usuario["username"] = $("#kt-login__signup-username").val();
            usuario["email"] = $("#kt-login__signup-email").val();
            usuario["pass"] = $("#kt-login__signup-password").val();
            usuario["organization"] = organization;

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/v1/rest/user/register-by-login",
                data: JSON.stringify(usuario),
                dataType: 'json',
                cache: false,
                timeout: 60000,
                success: function (data, textStatus, jqXHR) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();

                    displaySignInForm();
                    var signInForm = login.find('.kt-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();

                    showErrorMsg(signInForm, 'success', 'Muchas gracias! Las instrucciones para completar tu registro han sido enviado a tu correo.');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();

                    // display signup form
                    displaySignInForm();
                    var signInForm = login.find('.kt-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();

                    if (jqXHR.responseJSON != undefined || jqXHR.responseJSON.error != undefined || jqXHR.responseJSON.error == 'Registered organization') {
                        showErrorMsg(signInForm, 'danger', 'El rut comercial de la empresa ya está registrado en el sistema.');
                    } else if (jqXHR.responseJSON != undefined || jqXHR.responseJSON.error != undefined || jqXHR.responseJSON.error == 'Registered user') {
                        showErrorMsg(signInForm, 'danger', 'El nombre de usuario o correo electrónico ya está registrado en el sistema.');
                    } else {
                        showErrorMsg(signInForm, 'danger', 'Ha ocurrido un problema al realizar el registro, por favor intente nuevamente mas tarde. Si el problema persiste comuníquese con el administrador del sistema.');
                    }
                }
            });
        });
    }

    var initValidateRut = function () {
        $('#kt-login__signup-rut_organization').on('keyup', function (e) {
            e.preventDefault();
            $('#kt-login__signup-rut_organization').val($.formatRut($('#kt-login__signup-rut_organization').val()));
        });
    }
    var handleForgotFormSubmit = function () {
        $('#kt_login_forgot_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            var requestJson = {};
            requestJson["email"] = $("#kt-login__forgot-email").val();
            var signInForm = login.find('.kt-login__signin form');
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/v1/rest/user/reset-by-login',
                data: JSON.stringify(requestJson),
                dataType: 'json',
                cache: false,
                timeout: 60000,
                complete: function (data) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();
                    displaySignInForm();
                    signInForm.clearForm();
                    signInForm.validate().resetForm();
                },
                success: function (data, textStatus, jqXHR) {
                    showErrorMsg(login.find('.kt-login__signin form'), 'success', 'Genial! Las instrucciones de recuperación de contraseña han sido enviado a tu correo.');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.responseJSON != undefined || jqXHR.responseJSON.error != undefined || jqXHR.responseJSON.error == 'Unregistered user') {
                        showErrorMsg(signInForm, 'danger', 'El correo electrónico ingresado no está registrado en el sistema.');
                    } else {
                        showErrorMsg(signInForm, 'danger', 'Ha ocurrido un problema al realizar el registro, por favor intente nuevamente mas tarde. Si el problema persiste comuníquese con el administrador del sistema.');
                    }
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
            initValidateRut();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginGeneral.init();
});