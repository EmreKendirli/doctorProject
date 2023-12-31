import {
    checkSchema,
    validationResult
} from 'express-validator';
import AppError from "../utils/appError.js"

const resetPasswordDataValidate = [checkSchema({
    password: {
        exists: {
            errorMessage: "Lütfen Yeni Şifrenizi Giriniz"
        },
        isLength: {
            options: {
                min: 5
            },
            errorMessage: "Şifreniz en az 5 karakter içermelidir",
        },
    },
    confirm_password: {
       
            custom: {
                options: (value, {
                    req
                }) => {
                    if (String(value) !== String(req.body.password)) {
                        return false
                    } else
                    {
                        return true
                    }
                },
                errorMessage: "Girmiş olduğunuz şifreler uyuşmamaktadır."
            }
        
    }
}),

(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorObject = {};
        for (let i = 0; i < errors.errors.length; i++) {
            const key = errors.errors[i].path;
            const value = errors.errors[i].msg;
            errorObject[key] = value;
        }
        return res.status(422).json({
            succeded: false,
            data: {
                error: errorObject
            }
        });
    }
    else {
        next();
    }
}
]

const resetPasswordValidations = {
    resetPasswordDataValidate
};

export default resetPasswordValidations;