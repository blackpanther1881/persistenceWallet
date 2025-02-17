import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {LedgerSigner} from "@cosmjs/ledger-amino";
import config from "../config";
import {makeHdPath} from "./helper";
import * as Sentry from "@sentry/browser";
import {userLogout} from "../store/actions/logout";

const interactiveTimeout = 120_000;

export async function createTransport() {
    const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);
    return ledgerTransport;
}

export const fetchAddress = async (accountNumber = "0", addressIndex = "0") => {
    let transport = await createTransport();
    const signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [makeHdPath(accountNumber, addressIndex)],
        prefix: config.addressPrefix,
        ledgerAppName:config.persistenceLedgerAppName
    });
    const [firstAccount] = await signer.getAccounts();
    return firstAccount.address;
};

export const ledgerDisconnect = async (dispatch, history) =>{
    try {
        let transport = await createTransport();
        transport.on("disconnect", () => {
            alert("ledger disconnected please login again");
            history.push('/');
            dispatch(userLogout());
            localStorage.clear();
            window.location.reload();

        });
    }catch (error) {
        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        console.log(error, " error result");
    }
};