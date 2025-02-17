import React from 'react';
import InputFieldNumber from "../../../../components/InputFieldNumber";
import {useDispatch, useSelector} from "react-redux";
import {formatNumber, removeCommas, stringToNumber} from "../../../../utils/scripts";
import NumberView from "../../../../components/NumberView";
import {ValidateReDelegateAmount, ValidateSpecialCharacters} from "../../../../utils/validations";
import {useTranslation} from "react-i18next";
import config from "../../../../config";
import {setTxReDelegateAmount} from "../../../../store/actions/transactions/redelegate";

const Amount = () => {
    const {t} = useTranslation();
    const amount = useSelector((state) => state.redelegate.amount);
    const validatorDelegationAmount = useSelector((state) => state.validators.validatorDelegations);
    const dispatch = useDispatch();
    const onChange = (evt) => {
        let rex = /^\d*\.?\d{0,6}$/;
        if (rex.test(evt.target.value)) {
            dispatch(
                setTxReDelegateAmount({
                    value: evt.target.value,
                    error: ValidateReDelegateAmount(validatorDelegationAmount.value, (stringToNumber(evt.target.value)))
                })
            );
        } else {
            return false;
        }
    };

    const selectTotalBalanceHandler = (value) => {
        dispatch(
            setTxReDelegateAmount({
                value: value,
                error: ValidateReDelegateAmount(value, (stringToNumber(value)))
            })
        );
    };

    return (
        <div className="form-field p-0">
            <p className="label amount-label">
                <span> {t("REDELEGATION_AMOUNT")}</span>
                <span
                    className={validatorDelegationAmount.value === 0 ? "empty info-data info-link" : "info-data info-link"}
                    onClick={() => selectTotalBalanceHandler(removeCommas(formatNumber(validatorDelegationAmount.value)))}><span
                        className="title">{t("DELEGATED_AMOUNT")}:</span> <span
                        className="value">
                        <NumberView
                            value={formatNumber(validatorDelegationAmount.value)}/> {config.coinName}</span> </span>

            </p>
            <div className="amount-field">
                <InputFieldNumber
                    className="form-control"
                    min={0}
                    name="amount"
                    placeholder={t("REDELEGATION_AMOUNT")}
                    required={true}
                    type="number"
                    value={amount.value}
                    onKeyPress={ValidateSpecialCharacters}
                    error={amount.error}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};


export default Amount;
