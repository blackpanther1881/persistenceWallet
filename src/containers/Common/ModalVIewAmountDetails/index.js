import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import helper, {tokenValueConversion} from "../../../utils/helper";
import {useTranslation} from "react-i18next";
import {formatNumber} from "../../../utils/scripts";
import NumberView from "../../../components/NumberView";
import config from "../../../config";
import ReactGA from "react-ga";
const tmRPC = require("@cosmjs/tendermint-rpc");
const {QueryClient, setupIbcExtension} = require("@cosmjs/stargate");
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
const ModalViewAmountDetails = (props) => {
    const {t} = useTranslation();
    const [ibcList, setIbcList] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setIbcList([]);
    };
    const handleModal = async () => {
        setShow(true);
        ReactGA.event({
            category: t('TOTAL_TOKENS_MODAL_VIEW'),
            action: t('CLICK_TOTAL_TOKENS_MODAL_VIEW')
        });
        props.list.map(async (item) => {
            if (item.denom !== config.coinDenom) {
                let denom = item.denom.substr(item.denom.indexOf('/') + 1);
                const tendermintClient = await tmRPC.Tendermint34Client.connect(tendermintRPCURL);
                const queryClient = new QueryClient(tendermintClient);
                const ibcExtension = setupIbcExtension(queryClient);
                let ibcDenomeResponse = await ibcExtension.ibc.transfer.denomTrace(denom);
                let data = {
                    dataResponse: item,
                    denomResponse: ibcDenomeResponse
                };
                setIbcList(ibcList => [...ibcList, data]);
            }
        });
    };
    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom faq-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    <h3 className="heading">
                        {t("RECEIVED_IBC_TOKENS")}
                    </h3>
                </Modal.Header>
                <Modal.Body className="faq-modal-body">
                    <ul className="modal-list-data">
                        {props.list ?
                            ibcList.map((item, index) => {
                                if (item.dataResponse.denom !== config.coinDenom) {
                                    return (
                                        <li className="" key={index} title={item.dataResponse.denom}>
                                            <NumberView
                                                value={formatNumber(tokenValueConversion(item.dataResponse.amount))}/>{helper.denomChange(item.denomResponse.denomTrace.baseDenom)} (
                                            IBC Trace path - {item.denomResponse.denomTrace.path},
                                            denom: {item.denomResponse.denomTrace.baseDenom} ) {item.dataResponse.denom}
                                        </li>
                                    );
                                }
                            }) : null
                        }
                    </ul>
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal}>{t("VIEW")}</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.balance.list,
    };
};


export default connect(stateToProps)(ModalViewAmountDetails);

