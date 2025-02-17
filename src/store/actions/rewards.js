import {
    FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS,
    FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
    FETCH_VALIDATORS_REWARDS_SUCCESS,
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    REWARDS_LIST_FETCH_SUCCESS
} from "../../constants/rewards";
import transactions from "../../utils/transactions";
import {QueryClientImpl} from "cosmjs-types/cosmos/distribution/v1beta1/query";
import ActionHelper from "../../utils/actions";
import {QueryClientImpl as StakingQueryClientImpl} from "cosmjs-types/cosmos/staking/v1beta1/query";
import * as Sentry from "@sentry/browser";
import config from "../../config";
import {decimalConversion, stringToNumber} from "../../utils/scripts";
import {checkValidatorAccountAddress, tokenValueConversion} from "../../utils/helper";

export const fetchRewardsProgress = () => {
    return {
        type: REWARDS_FETCH_IN_PROGRESS,
    };
};
export const fetchRewardsListProgress = (list) => {
    return {
        type: REWARDS_LIST_FETCH_SUCCESS,
        list
    };
};
export const fetchRewardsSuccess = (data) => {
    return {
        type: REWARDS_FETCH_SUCCESS,
        data,
    };
};
export const fetchRewardsError = (data) => {
    return {
        type: REWARDS_FETCH_ERROR,
        data,
    };
};

export const fetchValidatorRewardsListError = (data) => {
    return {
        type: FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
        data,
    };
};

export const fetchValidatorRewardsListSuccess = (list) => {
    return {
        type: FETCH_VALIDATORS_REWARDS_SUCCESS,
        list,
    };
};

export const fetchValidatorCommissionInfoSuccess = (list) => {

    return {
        type: FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS,
        list,
    };
};

export const fetchTotalRewards = (address) => {
    return async dispatch => {
        try {
            dispatch(fetchRewardsProgress());
            const rpcClient = await transactions.RpcClient();
            const distributionQueryService = new QueryClientImpl(rpcClient);
            await distributionQueryService.DelegationTotalRewards({
                delegatorAddress: address,
            }).then(async (delegatorRewardsResponse) => {
                if (delegatorRewardsResponse.total.length) {
                    let rewards = decimalConversion(delegatorRewardsResponse.total[0].amount, 18);
                    const fixedRewardsResponse = tokenValueConversion(stringToNumber(rewards));
                    dispatch(fetchRewardsSuccess(fixedRewardsResponse.toFixed(6)));
                }
            }).catch((error) => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                console.log(error.response
                    ? error.response.data.message
                    : error.message);
            });
        } catch (error) {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.response
                ? error.response.data.message
                : error.message);
        }
    };
};

export const fetchRewards = (address) => {
    return async dispatch => {
        try {
            dispatch(fetchRewardsProgress());
            const rpcClient = await transactions.RpcClient();
            const distributionQueryService = new QueryClientImpl(rpcClient);
            await distributionQueryService.DelegationTotalRewards({
                delegatorAddress: address,
            }).then(async (delegatorRewardsResponse) => {
                if (delegatorRewardsResponse.rewards.length) {
                    let options = [];

                    if (delegatorRewardsResponse.rewards.length) {
                        for (const item of delegatorRewardsResponse.rewards) {
                            const stakingQueryService = new StakingQueryClientImpl(rpcClient);

                            await stakingQueryService.Validator({
                                validatorAddr: item.validatorAddress,
                            }).then(async (res) => {
                                const data = {
                                    label: `${res.validator.description.moniker} - ${tokenValueConversion(decimalConversion(item.reward[0] && item.reward[0].amount)).toLocaleString(undefined, {minimumFractionDigits: 6})} ${config.coinName}`,
                                    value: res.validator.operatorAddress,
                                    rewards: decimalConversion(item.reward[0] && item.reward[0].amount)
                                };

                                if (checkValidatorAccountAddress(res.validator.operatorAddress, address)) {
                                    let commissionInfo = await ActionHelper.getValidatorCommission(res.validator.operatorAddress);
                                    dispatch(fetchValidatorCommissionInfoSuccess([commissionInfo, res.validator.operatorAddress, true]));
                                }
                                options.push(data);
                            }).catch((error) => {
                                Sentry.captureException(error.response
                                    ? error.response.data.message
                                    : error.message);
                                dispatch(fetchValidatorRewardsListError(error.response
                                    ? error.response.data.message
                                    : error.message));
                            });
                        }
                    }
                    dispatch(fetchValidatorRewardsListSuccess(options));
                    dispatch(fetchRewardsListProgress(delegatorRewardsResponse.rewards));
                }
            }).catch((error) => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                dispatch(fetchRewardsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
        }catch (error) {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
        }
    };
};
