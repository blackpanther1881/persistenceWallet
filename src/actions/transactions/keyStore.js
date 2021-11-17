import {TX_KEY_STORE_SET, TX_KEY_STORE_PASSWORD_SET} from "../../constants/keyStore";
import transactions from "../../utils/transactions";
import {KEYSTORE_MODAL_HIDE, KEYSTORE_MODAL_SHOW} from "../../constants/keyStore";
import {txSendFailed, txSendResponse, txSendSuccess} from "./send";
import {showTxResultModal} from "./common";

export const setTxKeyStore = (data) => {
    return {
        type: TX_KEY_STORE_SET,
        data,
    };
};

export const setTxKeyStorePassword = (data) => {
    return {
        type: TX_KEY_STORE_PASSWORD_SET,
        data,
    };
};

export const showKeyStoreModal = (data) => {
    console.log("here");
    return {
        type: KEYSTORE_MODAL_SHOW,
        data,
    };
};

export const hideKeyStoreModal = (data) => {
    return {
        type: KEYSTORE_MODAL_HIDE,
        data,
    };
};

export const  keyStoreSubmit = (loginAddress, loginMode) => {
    return async (dispatch, getState) => {
        const password = getState().keyStore.password;
        const keyStoreData = getState().keyStore.keyStore;

        const accountNumber = getState().advanced.accountNumber.value;
        const accountIndex = getState().advanced.accountIndex.value;
        const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

        const formData = getState().common.txInfo.value.data;
        const txName = getState().common.txInfo.value.name;

        const fee = getState().fee.fee.value.fee;
        const gas = getState().gas.gas.value;
        let mnemonic = "";
        if(loginMode !=="ledger"){
            mnemonic = await transactions.PrivateKeyReader(keyStoreData.value, password.value, loginAddress);
        }
        console.log(formData, loginAddress, fee, gas, mnemonic,txName, accountNumber, accountIndex, bip39PassPhrase, "mnemonic");
        let response = transactions.getTransactionResponse(loginAddress, formData, fee, gas, mnemonic,txName, accountNumber, accountIndex, bip39PassPhrase);
        console.log(response, "txn response");
        response.then(result => {
            if (result.code !== undefined) {
                dispatch(txSendSuccess());
                dispatch(txSendResponse(result));
                dispatch(showTxResultModal());
                console.log(result, "result");
                // helper.accountChangeCheck(result.rawLog);
            }else {
                console.log(result, "final result");
            }
        }).catch(err => {
            dispatch(txSendFailed(err.message));
            // helper.accountChangeCheck(err.message);
        });
    };
};

