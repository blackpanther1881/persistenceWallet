import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import transactions from "../../../utils/transactions";
const tmRPC = require("@cosmjs/tendermint-rpc");
const {QueryClient, setupIbcExtension} = require("@cosmjs/stargate");
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
const ModalViewAmountDetails = (props) => {
    const [ibcList, setIbcList] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setIbcList([]);
    };
    const handleModal = async () => {
        setShow(true);
        props.list.map(async (item) => {
            if (item.denom !== 'uxprt') {
                let denom = item.denom.substr(item.denom.indexOf('/') +1);
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
                    Tokens received via IBC
                </Modal.Header>
                <Modal.Body className="faq-modal-body">
                    <ul className="modal-list-data">
                        {props.list ?
                            ibcList.map((item, index) => {
                                if (item.dataResponse.denom !== 'uxprt') {
                                    return (
                                        <li className="" key={index} title={item.dataResponse.denom}><span
                                            className="amount">{transactions.XprtConversion(item.dataResponse.amount)}</span> <span
                                            className="date">{item.denomResponse.denomTrace.baseDenom}</span> <span>{item.denomResponse.denomTrace.path}</span></li>
                                    );
                                }
                            }) : null
                        }
                    </ul>
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal}>View</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.balance.list,
    };
};


export default connect(stateToProps)(ModalViewAmountDetails);

