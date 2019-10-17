import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {InfoRowPanel} from "../../../common/info-row-panel/info-row-panel";
import {transactionApi} from "../../../../api/common/transaction-api";
import {customHistory} from "../../routes";
import {Copiable} from "../../../common/copiable/copiable";
import {Badge} from "../../../common/badge/badge";
import moment from "moment";
import {KComponent} from "../../../common/k-component";
import io from "socket.io-client";

export default class TxnRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            updating: false,

        };
        this.fetchInfo(props.match.params.txnID);

        this.socket1 = io(process.env.APP_URI + "mine-block");
        this.socket2 = io(process.env.APP_URI + "pending-transaction");

        this.socket1.on('connect', () => {
            this.socket1.on("new-chain-info", (data) => {
                if(data.latestBlock.data.find(each => each.hash === this.props.match.params.txnID)){
                    this.setState({updating: true});
                    this.fetchInfo(this.props.match.params.txnID);
                }
            })
        });
        this.socket2.on('connect', () => {
            this.socket2.on("transaction-update", (hash) => {

                if(hash === this.props.match.params.txnID){
                    this.setState({updating: true});
                    this.fetchInfo(this.props.match.params.txnID);
                }
            });
        });
    };

    fetchInfo = (txnID) => {
        transactionApi.getTransactionDetails(txnID).then((info) => {
            if (!info) {
                customHistory.push("/");
                return;
            }
            this.setState({info, updating: false})
        });
    };

    componentWillUnmount() {
        this.socket1 && this.socket1.disconnect();
        this.socket2 && this.socket2.disconnect();
    }

    displays = [
        {
            label: "Hash",
            display: data => (
                <Copiable
                    getCopyValue={() => data.txn.hash}
                >
                    <div className="hash">
                        {data.txn.hash}
                        <i className="fas fa-copy"></i>
                    </div>

                </Copiable>


            )
        }, {
            label: "Status",
            display: data => (
                <Badge
                    content={data.txn.status === "pending" ? "Pending" : "Proceed"}
                    style={data.txn.status === "pending" ? "danger" : "success"}
                />
            )
        }, {
            label: "Block",
            display: data => (
                <p className="link-text d-inline-block" onClick={() => customHistory.push(`/block/${data.block.hash}`)}>{data.block.blockNo + 1}</p>
            ),
            condition: data => data.block
        }, {
            label: "Timestamp",
            display: data => (
                <p>{moment(data.txn.timestamp).format("HH:mm:ss MMM DD YYYY")}</p>
            ),
        }, {
            label: "Last updated",
            display: data => (
                <p>{moment(data.txn.updatedAt).fromNow()}</p>
            ),
        },
        {
            label: "From",
            display: data => (
                <div className="address">
                    <p className="link-text">{data.txn.input.address}</p>
                    <Copiable
                        getCopyValue={() => data.txn.input.address}
                    >

                        <i className="fas fa-copy"></i>
                    </Copiable>

                </div>


            ),
        },
        {
            label: "To",
            display: data => {

                return (
                    <div className="to-addresses">
                        <p>{Object.keys(data.txn.outputMap).length - 1} found</p>
                        <div className="addresses">
                            {Object.keys(data.txn.outputMap).filter(each => each !== data.txn.input.address).map((each) => (
                                <div className="info" key={each}>
                                    <span className="label">{each}</span>
                                    :
                                    <span className="value">{data.txn.outputMap[each]} <span className="unit">KAP</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            },
        },
        {
            label: "Description",
            display: data => (
                <p>{data.txn.description}</p>
            ),
        },
    ];

    render() {
        let {info, updating} = this.state;
        return (
            <PageTitle
                title={`Transaction ${this.props.match.params.txnID}`}
            >
                <MainLayout>
                    <div className="txn-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Transaction Details</p>
                                {updating && (
                                    <p className="updating">Updating...</p>
                                )}
                                <InfoRowPanel
                                    info={info}
                                    displays={this.displays}
                                />
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}