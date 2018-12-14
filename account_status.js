const PRIVATE_KEY = '0x6326BD76080716AEFa4c508EEd5c1e680b7B672B';
const rpcUrl = "https://ropsten.infura.io/v3/9ad9d80e5c1a4969aabb21d783f6365d";
const WEI = 1000000000000000000;

const usdTotal = document.querySelector(".usd-total");
const etherTotal = document.querySelector(".eth-total");
const historyList = document.querySelector(".trans-history-list");

var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const ETEHRSCAN_KEY = "7PCVNN273GTYFWAM3KGT3HNV44B6CN36U2";
const currentUrl = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
const logsUrl = `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${PRIVATE_KEY}&startblock=0&endblock=99999999&sort=asc&apikey=${ETEHRSCAN_KEY}`;

var currencyUSD;

function getCurrentCurrency() {
    fetch(currentUrl)
        .then(function(response) {
            // console.log(response)
            return response.json();
        })
        .then(function(usdValue) {
            currencyUSD = usdValue.USD;
            console.log(`#### ${currencyUSD}`)
        });
}

function paintTransaction(transaction, index, array) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const date = document.createElement("h5");
    const div_history_log = document.createElement("div");
    const div_column_title = document.createElement("div");
    const image = document.createElement("i");
    const history_preview = document.createElement("div");
    const title = document.createElement("h3");
    const tag = document.createElement("h3");
    const history_amount = document.createElement("div");
    const usd = document.createElement("h4");
    const eth = document.createElement("h5")

    const sysdate = new Date(parseInt(transaction.timeStamp)*1000);
    date.innerText = `#${array.length - parseInt(index)} - ${sysdate.toLocaleString()}`;
    title.innerText = "알 수 없는 함수";
    tag.innerText = "승인됨";
    usd.innerText = `$${weiToUSD(transaction.value, 2)} USD`;
    eth.innerText = `${weiToEth(transaction.value, 2)} eth`;

    a.classList.add("history__contents");
    li.classList.add("history__item");
    date.classList.add("history_date_time");
    div_history_log.classList.add("history_log");
    div_column_title.classList.add("history_item_column");
    div_column_title.classList.add("item_column_title");
    image.classList = "fab fa-ethereum fa-2x";
    history_preview.classList.add("history_preview");
    title.classList.add("transaction_title");
    tag.classList.add("history_tag");
    history_amount.classList.add("history_item_column");
    history_amount.classList.add("history_amount");
    usd.classList.add("usd_amount");
    eth.classList.add("eth_amount");


    history_amount.appendChild(usd);
    history_amount.appendChild(eth);

    history_preview.appendChild(title);
    history_preview.appendChild(tag);

    div_column_title.appendChild(image);
    div_column_title.appendChild(history_preview);

    div_history_log.appendChild(div_column_title);
    div_history_log.appendChild(history_amount);

    a.appendChild(date);
    a.appendChild(div_history_log);
    li.appendChild(a);

    historyList.appendChild(li);
}

function getTransactions(transaction) {
    // web3 는 account에 해당하는 transaction list를 가져오는 api가 존재 하지 않음.
    // 따라서 infura api 를 사용

    console.log(logsUrl);
    fetch(logsUrl)
        .then(function(response) {
            // console.log(response)
            return response.json();
        })
        .then(function(result) {
            const transactionList = result.result;
            // console.log(transactionList);
            transactionList.reverse().forEach(paintTransaction);
        });
}

function weiToUSD(wei, point) {
    const convertVal = parseFloat(currencyUSD) * weiToEth(wei, point);
    if (isNaN(convertVal)) {
        return 0;
    }
    return convertVal;
}

function weiToEth(wei, point) {
    return (parseInt(wei) / WEI).toFixed(point);
}

function getBalance() {
    web3.eth.getBalance(PRIVATE_KEY)
        .then(txObj => {
            const balance = (parseInt(txObj) / WEI).toFixed(4);
            console.log(balance);
            usdTotal.innerText = `${weiToUSD(txObj, 2)} USD`;
            etherTotal.innerText = `${balance} ETH`;
        });
    web3.eth.getTransactionCount(PRIVATE_KEY)
        .then(console.log);

}

function init() {
    // getCurrentCurrency();
    // getBalance();
    // getTransactions();
}

init();