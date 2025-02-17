import React from 'react';
import InputFieldNumber from "../../../../components/InputFieldNumber";
import {useDispatch, useSelector} from "react-redux";
import {ValidateAccountIndex, ValidateSpecialCharacters} from "../../../../utils/validations";
import {useTranslation} from "react-i18next";
import {setAccountIndex} from "../../../../store/actions/signIn/ledger";
import config from "../../../../config";

const AccountIndex = () => {
    const {t} = useTranslation();
    const accountIndex = useSelector((state) => state.signInLedger.accountIndex);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setAccountIndex({
            value: (evt.target.value),
            error: ValidateAccountIndex(evt.target.value)
        }));
    };


    return (
        <div className="form-field">
            <p className="label">{t("ACCOUNT_INDEX")}</p>
            <InputFieldNumber
                max={config.maxAccountIndex}
                name="ledgerAccountIndex"
                placeholder={t("ACCOUNT_INDEX")}
                type="number"
                className="form-control"
                value={accountIndex.value}
                error={accountIndex.error}
                onChange={onChange}
                onKeyPress={ValidateSpecialCharacters}
                required={false}
            />
        </div>
    );
};


export default AccountIndex;
