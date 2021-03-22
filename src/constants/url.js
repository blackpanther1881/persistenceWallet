const API_URL = process.env.REACT_APP_API_KEY;
export const getRewardsUrl = (address) => `${API_URL}/cosmos/distribution/v1beta1/delegators/${address}/rewards`;
export const getDelegationsUnbondUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
export const getDelegationsUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/delegations/${address}`;
export const getValidatorsUrl = () => `${API_URL}/cosmos/staking/v1beta1/validators`;
export const getValidatorUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/validators/${address}`;
export const getBalanceUrl = (address) => `${API_URL}/cosmos/bank/v1beta1/balances/${address}`;
export const getSendTransactionsUrl = (address) => `${API_URL}/txs?message.sender=${address}`;
export const getValidatorRewardsUrl = (address, validatorAddress) => `${API_URL}/cosmos/distribution/v1beta1/delegators/${address}/rewards/${validatorAddress}`;
