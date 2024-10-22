$(document).ready(function() {
    $("#orderForm").validate({
        rules: {
            firstName: {
                required: true,
                minlength: 2
            },
            lastName: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                minlength: 10,
                digits: true
            },
            address: {
                required: true
            },
            city: {
                required: true
            },
            state: {
                required: true
            },
            zip: {
                required: true,
                digits: true,
                minlength: 5
            },
            cardName: {
                required: true
            },
            cardNumber: {
                required: true,
                minlength: 16,
                digits: true
            },
            expiryMonth: {
                required: true,
                digits: true,
                minlength: 2,
                maxlength: 2
            },
            expiryYear: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4
            },
     
        },
        messages: {
            firstName: "Please enter your first name",
            lastName: "Please enter your last name",
            email: "Please enter a valid email address",
            phone: "Please enter a valid phone number",
            address: "Please enter your address",
            city: "Please enter your city",
            state: "Please enter your state",
            zip: {
                required: "Please enter your zip code",
                minlength: "Your zip code must be at least 5 digits"
            },
            cardName: "Please enter the name on your card",
            cardNumber: {
                required: "Please enter your card number",
                minlength: "Your card number must be 16 digits"
            },
            expiryMonth: "Please enter a valid expiry month (MM)",
            expiryYear: "Please enter a valid expiry year (YYYY)",
        
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
});
