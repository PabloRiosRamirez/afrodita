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
            if (validator.form()) {
                KTApp.progress(btn);
                formEl.ajaxSubmit({
                    success: function () {
                        KTApp.unprogress(btn);
                        //KTApp.unblock(formEl);

                        swal.fire({
                            "title": "",
                            "text": "The application has been successfully submitted!",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary"
                        });
                    }
                });
            }
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