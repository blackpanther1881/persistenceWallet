import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import NumberView from "../../../components/NumberView";
import {formatNumber, localTime, stringToNumber} from "../../../utils/scripts";
import config from "../../../config";
import {tokenValueConversion} from "../../../utils/helper";
import ReactGA from "react-ga";

const ModalViewUnbondDetails = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleModal = () => {
        ReactGA.event({
            category: t('UNBONDING_MODAL_VIEW'),
            action: t('CLICK_UNBONDING_MODAL_VIEW')
        });
        setShow(true);
    };

    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom list-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    <h3 className="heading">
                        {t("VIEW_UNBOND_SCHEDULE")}
                    </h3>
                </Modal.Header>
                <Modal.Body className="list-modal-body">
                    <div className="unbonding-schedule-list-header">
                        <p>{t("UNBONDING_AMOUNT")}</p>
                        <p>{t("DATE")}</p>
                    </div>
                    {props.list ?
                        props.list.map((item) => {
                            return (
                                item.entries.length ?
                                    item.entries.map((entry, entryIndex) => {
                                        return (
                                            <div className="unbonding-schedule-list" key={entryIndex}>
                                                <p><span className="amount">
                                                    <NumberView
                                                        value={formatNumber(tokenValueConversion(stringToNumber(entry.balance )))}/>
                                                    {config.coinName}
                                                </span></p>
                                                <p><span
                                                    className="date">
                                                    {localTime(entry["completionTime"])}
                                                </span>
                                                </p>
                                            </div>
                                        );
                                    })
                                    : ""
                            );
                        }) : null
                    }
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal} title={`View Unbonding ${config.coinName} Schedule`}>{t("VIEW")}</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.unbond.list,
    };
};


export default connect(stateToProps)(ModalViewUnbondDetails);

