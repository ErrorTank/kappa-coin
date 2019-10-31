import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {BlockchainOverview} from "../../../common/blockchain-overview/blockchain-overview";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {pronounce} from "../../../../common/utils/common";
import moment from "moment"
import {transactionApi} from "../../../../api/common/transaction-api";
import {wait} from "../../../../common/utils";
import {calculateHash} from "../../../../common/crypto";
import {chainApi} from "../../../../api/common/chain-api";
import hexToBinary from "hex-to-binary"
import pick from "lodash/pick"
import {userInfo} from "../../../../common/states/common";

const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
import io from "socket.io-client";
import {appModal} from "../../../common/modal/modals";
import {customHistory} from "../../routes";
import classnames from "classnames";
import {Badge} from "../../../common/badge/badge";

const NewBlockModal = ({data, success}) => {
    return (
        <div className={classnames("content", {fail: !success})}>
            <p className="icon">
                {success ? (
                    <i className="far fa-check-circle"></i>
                ) : (
                    <i className="far fa-times-circle"></i>
                )

                }

            </p>
            <p className="sub">
                {success ? "Congratulation! You has created a new block" : "Your transaction has been refused to update!"

                }

            </p>
            <div className="details">
                <div className="detail">
                    <span className="label">Block No:</span>
                    <span className="value">{data.blockNo + 1}</span>
                </div>
                <div className="detail">
                    <span className="label">Nonce:</span>
                    <span className="value">{data.nonce}</span>
                </div>

                <div className="detail">
                    <span className="label">Block hash:</span>
                    <span className="hash">{data.hash}</span>
                </div>
                <div className="detail">
                    <span className="label">Merkle hash:</span>
                    <span className="hash">{data.rootHash}</span>
                </div>
                <div className="detail">
                    <span className="label">Last block hash:</span>
                    <span className="hash">{data.previousHash}</span>
                </div>
                <div className="detail">
                    <span className="label">Mined at:</span>
                    <span className="value">{moment(data.timestamp).format("HH:mm:ss MMM DD YYYY")}</span>
                </div>
                <div className="detail">
                    <span className="label">Txns includes:</span>
                    <span className="value">{data.data.length} txns</span>
                </div>
                <div className="detail">
                    <span className="label">Reward</span>
                    <Badge
                        content={(
                            <span className="reward">{data.reward} <img src={"./assets/image/kappa.png"}/></span>
                        )}
                        style="success"
                    />
                </div>
            </div>
            <div className="more-info">

            </div>
        </div>
    )
}

export default class MiningRoute extends React.Component {
    constructor(props) {
        super(props);
        this.initState = {
            hash: "",
            nonce: 0,
            timestamp: null,
            txns: [],
            step: this.steps[0],
            counter: 0,
            error: null
        };
        this.state = {
            chain: null,
            ...this.initState
        };

        this.socket = io(document.location.origin + "/mine-block");
        this.socket.on('connect', () => {
            console.log(this.socket.id);
            this.socket.on("new-block-found", () => {
                console.log("new-block-found")
                this.setState({error: true});
            })
            this.socket.on("new-chain-info", (data) => {
                console.log("new-chain-info")
                console.log(data);
                this.setState({chain: {...this.state.chain, ...data}});
            })
        });
        chainApi.getBlockchainOverview().then(chain => this.setState({chain}));
    };

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    getNewMinedBlock = () => {
        return {...pick(this.state, ["txns", "nonce", "counter"]), minedBy: userInfo.getState()._id, difficulty: this.state.chain.difficulty};
    }

    startMiningProcess = async () => {
        this.setState({step: this.steps[8]});
        await wait(2000);
        let result = await chainApi.validateChain();
        if(!result.valid){

            this.setState({step: this.steps[9]});
            return ;
        }
        this.setState({step: this.steps[1]});
        let txns = await transactionApi.getValidTransactions() || [];
        this.setState({txns});
        await wait(2000);
        this.setState({step: this.steps[2]});
        await wait(2000);
        if (txns.length) {
            this.setState({step: this.steps[4]});
            this.startMining()
                .then(async () => {
                    this.setState({step: this.steps[5]});
                    await this.foundBlockEmit();
                    await wait(4000);
                })
                .then(async () => {
                    if(this.state.error){
                        return Promise.reject();

                    }
                    this.setState({step: this.steps[6]});
                    await wait(2000);
                    return chainApi.addNewBlock(this.getNewMinedBlock())

                })
                .then(async (newBlock) => {
                    await wait(2000);
                    this.setState({...this.initState});
                    appModal.confirm({
                        title: "Notification",
                        className: "new-block-modal",
                        text: (
                            <NewBlockModal
                                data={newBlock}
                                success={true}
                            />
                        ),
                        btnText: "My wallet",
                        cancelText: "Close"
                    }).then(isNavigate => isNavigate && customHistory.push("/profile#wallet"))

                })
                .catch(async (err) => {
                    console.log(err)
                    this.setState({step: this.steps[7]});
                    await wait(2000);
                });

        } else {
            this.setState({step: this.steps[3]});
            await wait(2000);
            this.setState({...this.initState});
        }
    };

    startMining = async () => {

        let nonce = 0;
        let hash, timestamp;
        this.interval = setInterval(() => {
            let {counter} = this.state;
            this.setState({counter: counter + 1});
        }, 1000);
        do {
            let {chain, txns,} = this.state;
            let {difficulty} = chain;
            nonce++;
            timestamp = Date.now();
            hash = calculateHash({data: [...txns], nonce, difficulty});
            await wait(0);
            this.setState({hash, timestamp, nonce,});
            if (this.state.error){
                clearInterval(this.interval);
                throw new Error();
            }

        } while (hexToBinary(hash).substring(0, this.state.chain.difficulty) !== "0".repeat(this.state.chain.difficulty));
        clearInterval(this.interval);

        return
    };


    foundBlockEmit = () =>  {
        let data = this.getNewMinedBlock();
        const promise = () => new Promise(resolve => {
            return this.socket.emit("new-block-found", data, () => resolve());
        });
        return Promise.all([promise(), chainApi.newBlockFound(data)]).catch(err => console.log(err));


    };

    steps = [
        {
            key: "pending",
            uiTitle: "Pending...",
            mineRender: () => (
                <button className="btn mine-btn"
                        onClick={this.startMiningProcess}
                >
                    Mine
                </button>
            )
        }, {
            key: "preparing1",
            uiTitle: "Preparing...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Collecting valid transactions</p>
                </div>
            )
        }, {
            key: "preparing2",
            uiTitle: "Preparing...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Found {this.state.txns.length} {pronounce("transaction", this.state.txns.length, "s")}</p>
                </div>
            )
        },
        {
            key: "preparing3",
            uiTitle: "Stopping...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Not enough transactions to mined!</p>
                </div>
            )
        }, {
            key: "mining",
            uiTitle: "Mining...",
            mineRender: () => (
                <div className="mine-loading">
                    <p className="counter">{moment.duration(this.state.counter, "seconds").format("hh:mm:ss")}</p>
                    <p className="sub">Calculating Hash</p>
                </div>
            )
        },
        {
            key: "finishing1",
            uiTitle: "Success!",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-check-circle"></i>
                    <p className="sub">New block is mined!</p>
                </div>
            )
        },
        {
            key: "finishing2",
            uiTitle: "Success!",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Adding new block...</p>
                </div>
            )
        }, {
            key: "fail",
            uiTitle: "Failed!",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-times-circle"></i>
                    <p className="sub">Failed to adding new block</p>
                    <button className="btn"
                            onClick={() => this.setState({...this.initState})}
                    >
                        Try again
                    </button>
                </div>
            )
        },{
            key: "preparing4",
            uiTitle: "Validating",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Validate current blockchain</p>
                </div>
            )
        },{
            key: "fail2",
            uiTitle: "Failed!",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-times-circle"></i>
                    <p className="sub">Current blockchain is invalid</p>
                    <button className="btn"
                            onClick={() => this.setState({...this.initState})}
                    >
                        Try again
                    </button>
                </div>
            )
        },
    ];

    render() {
        let {hash, nonce, timestamp, step, chain, txns} = this.state;
        let {key, uiTitle, mineRender} = step;
        return (
            <PageTitle
                title={"Mining Block"}
            >
                <MainLayout>
                    <div className="mining-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Mining Block</p>
                                {chain && (
                                    <BlockchainOverview
                                        chain={chain}
                                    />
                                )

                                }

                                <div className="mining-interface border-box">
                                    {!chain ? (
                                        <LoadingInline

                                        />
                                    ) : (
                                        <>

                                            <div className="panel mine-info col-4">
                                                <div className="panel-title">
                                                    Mining details
                                                </div>
                                                <div className="info">
                                                    <p className="label">Nonce</p>
                                                    <p className="value">
                                                        {key === "pending" ? "Not mined yet" : ["preparing1", "preparing3", "preparing4"].includes(key) ? "Loading..." : nonce}
                                                    </p>
                                                </div>
                                                <div className="info hash-info">
                                                    <p className="label">Hash</p>
                                                    <p className="value">{key === "pending" ? "Not mined yet" : ["preparing1", "preparing3", "preparing4"].includes(key) ? "Loading..." : hash}</p>
                                                </div>
                                                <div className="info">
                                                    <p className="label">Timestamp</p>
                                                    <p className="value">{key === "pending" ? "Not mined yet" : ["preparing1", "preparing3", "preparing4"].includes(key) ? "Loading..." : timestamp}</p>
                                                </div>
                                            </div>
                                            <div className="panel mine-ui col-4">
                                                <div className="panel-title">
                                                    {uiTitle}
                                                </div>
                                                <div className="mine-ui-center">
                                                    {mineRender()}
                                                </div>
                                            </div>
                                            <div className="panel transactions col-4">
                                                <div className="panel-title">
                                                    Transactions
                                                </div>
                                                <div className="txns">

                                                    {}
                                                    {key === "pending" ? (
                                                        <p className="not-mine">Not mined yet</p>
                                                    ) : ["preparing1", "preparing3", "preparing4"].includes(key) ? (
                                                        <LoadingInline/>
                                                    ) : txns.length ? (
                                                        <>
                                                            {txns.map((tran, i) => (
                                                                <div className="tran"
                                                                     key={tran._id}
                                                                >
                                                                    <span
                                                                        className="label">Transaction#{i + 1} Hash: </span>
                                                                    <span className="value">{tran.hash}</span>
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : <p className="not-mine">No transactions found!</p>}

                                                </div>
                                            </div>
                                        </>
                                    )

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}