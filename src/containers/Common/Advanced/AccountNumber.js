import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {useDispatch, useSelector} from "react-redux";
import {ValidateAccountIndex, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {setAccountNumber} from "../../../store/actions/transactions/advanced";
import config from "../../../config";

const AccountNumber = () => {
    const {t} = useTranslation();
    const accountNumber = useSelector((state) => state.advanced.accountNumber);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setAccountNumber({
            value: (evt.target.value),
            error: ValidateAccountIndex(evt.target.value)
        }));
    };


    return (
        <div className="form-field">
            <p className="label">{t("ACCOUNT_NUMBER")}</p>
            <InputFieldNumber
                max={config.maxAccountNumber}
                name="delegateAccountNumber"
                placeholder={t("ACCOUNT_NUMBER")}
                type="number"
                className="form-control"
                value={accountNumber.value}
                error={accountNumber.error}
                onChange={onChange}
                onKeyPress={ValidateSpecialCharacters}
                required={false}
            />
        </div>
    );
};


export default AccountNumber;
