import getWeb3 from './web3';
import {
  claimContractAddressesForNetworkId,
  claimContractAbi,
  networkNameForNetworkId,
  claimWithValueTransferContractAddressesForNetworkId,
  claimWithValueTransferContractAbi
} from './contract';
const {
  REACT_APP_ERC_721_ADDRESS: ERC_721_ADDRESS,
  REACT_APP_USERFEEDS_API_ADDRESS: USERFEEDS_API_ADDRESS,
  REACT_APP_ERC_721_NETWORK: ERC_721_NETWORK,
  REACT_APP_INTERFACE_VALUE: INTERFACE_VALUE,
  REACT_APP_INTERFACE_BOOST_ADDRESS: INTERFACE_BOOST_ADDRESS,
  REACT_APP_INTERFACE_BOOST_NETWORK: INTERFACE_BOOST_NETWORK
} = process.env;

export const createUserfeedsId = entityId =>
  `${ERC_721_NETWORK}:${ERC_721_ADDRESS}:${entityId}`;

let lastFeedItemRequestTime = new Date(0);

export const getFeedItems = async entityId => {
  const entitySuffix = entityId ? `:${entityId}` : '';
  const response = await fetch(
    `${USERFEEDS_API_ADDRESS}/cryptopurr_feed;context=${ERC_721_NETWORK}:${ERC_721_ADDRESS}${entitySuffix}`,
    {
      headers: {
        'If-Modified-Since': lastFeedItemRequestTime.toGMTString()
      }
    }
  );
  let { items: feedItems } = await response.json();
  feedItems = feedItems.filter(feedItem =>
    ['regular', 'like', 'post_to', 'response', 'post_about', 'labels'].includes(
      feedItem.type
    )
  );
  lastFeedItemRequestTime = new Date();
  return feedItems;
};

export const getMyEntities = async () => {
  try {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    if (!from) return [];
    const response = await fetch(
      `${USERFEEDS_API_ADDRESS}/experimental_tokens;identity=${from.toLowerCase()};asset=${ERC_721_NETWORK}:${ERC_721_ADDRESS}/`
    );
    const { items: myEntities } = await response.json();
    return myEntities;
  } catch (e) {
    return [];
  }
};

export const getLabels = async entityId => {
  try {
    const res = await fetch(
      `${USERFEEDS_API_ADDRESS}/cryptopurr_profile;context=${createUserfeedsId(
        entityId
      )}`
    );
    const labels = await res.json();
    return labels;
  } catch (e) {
    return {};
  }
};

export const getBoosts = async () => {
  try {
    const res = await fetch(
      `${USERFEEDS_API_ADDRESS}/experimental_boost;asset=${INTERFACE_BOOST_NETWORK};context=${INTERFACE_BOOST_ADDRESS}`
    );
    const { items: boosts } = await res.json();
    const boostsMap = boosts.reduce(
      (acc, boost) =>
        boost.id.startsWith(`${ERC_721_NETWORK}:${ERC_721_ADDRESS}:`)
          ? { ...acc, [boost.id.split(':')[2]]: boost }
          : acc,
      {}
    );
    return boostsMap;
  } catch (e) {
    return {};
  }
};

export const getWeb3State = async () => {
  try {
    const web3 = await getWeb3();
    const [[from], isListening, networkId, blockNumber] = await Promise.all([
      web3.eth.getAccounts(),
      web3.eth.net.isListening(),
      web3.eth.net.getId(),
      web3.eth.getBlockNumber()
    ]);
    const networkName = networkNameForNetworkId[networkId];
    const provider = web3.currentProvider;
    return {
      from,
      isListening,
      networkId,
      blockNumber,
      web3,
      networkName,
      provider
    };
  } catch (e) {
    return {
      from: undefined,
      isListening: false,
      networkId: undefined,
      blockNumber: undefined,
      web3: undefined,
      networkName: undefined,
      provider: undefined
    };
  }
};

const getCreditsData = () => [{ type: 'interface', value: INTERFACE_VALUE }];

const getClaimContract = async () => {
  const web3 = await getWeb3();
  const { networkId } = await getWeb3State();
  const contractAddress = claimContractAddressesForNetworkId[networkId];
  const contract = new web3.eth.Contract(claimContractAbi, contractAddress);
  contract.setProvider(web3.currentProvider);
  return contract;
};

const getClaimWithValueTransferContract = async () => {
  const web3 = await getWeb3();
  const { networkId } = await getWeb3State();
  const contractAddress =
    claimWithValueTransferContractAddressesForNetworkId[networkId];
  const contract = new web3.eth.Contract(
    claimWithValueTransferContractAbi,
    contractAddress
  );
  contract.setProvider(web3.currentProvider);
  return contract;
};

const createFeedItemBase = async (transactionHash, token) => {
  const { from, blockNumber, networkName } = await getWeb3State();
  return {
    author: from,
    created_at: new Date().getTime(),
    family: networkName,
    id: `claim:${transactionHash}:0`,
    sequence: blockNumber + 1,
    context: createUserfeedsId(token)
  };
};

const claim = async data => {
  const { from } = await getWeb3State();
  const contract = await getClaimContract();
  return new Promise(resolve => {
    contract.methods
      .post(JSON.stringify(data))
      .send({ from })
      .on('transactionHash', transactionHash => resolve(transactionHash));
  });
};

const claimWithValueTransfer = async (data, value) => {
  const { from } = await getWeb3State();
  const contract = await getClaimWithValueTransferContract();
  return new Promise(resolve => {
    contract.methods
      .post(INTERFACE_BOOST_ADDRESS, JSON.stringify(data))
      .send({ from, value })
      .on('transactionHash', transactionHash => resolve(transactionHash));
  });
};

export const sendMessage = async (token, message) => {
  const data = {
    claim: { target: message },
    context: createUserfeedsId(token),
    credits: getCreditsData()
  };
  const transactionHash = await claim(data);
  const feedItemBase = await createFeedItemBase(transactionHash, token);
  return {
    ...feedItemBase,
    about: null,
    abouted: [],
    target: { id: message },
    targeted: [],
    type: 'regular'
  };
};

export const reply = async (token, message, to) => {
  const data = {
    type: ['about'],
    claim: { target: message, about: to },
    context: createUserfeedsId(token),
    credits: getCreditsData()
  };
  const transactionHash = await claim(data);
  const feedItemBase = await createFeedItemBase(transactionHash, token);
  return { ...feedItemBase, target: { id: message } };
};

export const writeTo = async (token, message, tokenTo) => {
  const entityUserfeedsId = createUserfeedsId(tokenTo);
  const data = {
    type: ['about'],
    claim: { target: message, about: entityUserfeedsId },
    context: createUserfeedsId(token),
    credits: getCreditsData()
  };
  const transactionHash = await claim(data);
  const feedItemBase = await createFeedItemBase(transactionHash, token);
  return {
    ...feedItemBase,
    about: { id: entityUserfeedsId },
    abouted: [],
    target: { id: message },
    targeted: [],
    type: 'post_to'
  };
};

export const react = async (token, to) => {
  const data = {
    type: ['labels'],
    claim: { target: to, labels: ['like'] },
    context: createUserfeedsId(token),
    credits: getCreditsData()
  };
  const transactionHash = await claim(data);
  const feedItemBase = await createFeedItemBase(transactionHash, token);
  return { ...feedItemBase, target: { id: to } };
};

export const label = async (token, message, labelType) => {
  const data = {
    type: ['labels'],
    claim: { target: message, labels: [labelType] },
    context: createUserfeedsId(token),
    credits: getCreditsData()
  };
  const transactionHash = await claim(data);
  const feedItemBase = await createFeedItemBase(transactionHash, token);
  return {
    ...feedItemBase,
    about: null,
    abouted: [],
    target: { id: message },
    targeted: [],
    type: 'labels',
    labels: [labelType]
  };
};

export const boost = async (entityId, value) => {
  const { networkName } = await getWeb3State();
  const data = {
    claim: { target: createUserfeedsId(entityId) },
    credits: getCreditsData()
  };
  const transactionHash = await claimWithValueTransfer(data, value);
  return { transactionHash, networkName };
};
