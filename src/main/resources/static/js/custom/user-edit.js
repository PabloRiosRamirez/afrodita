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
                    required: true
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
                }
            }
        });
    }

    var initEdit = function () {
        var btn = $('#btn_edit_user');
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
        	formElExcel = $('#edit-user');
            initSearch();
            initEdit();
            initValidation();
        }
    };
}();