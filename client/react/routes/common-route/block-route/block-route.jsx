import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {InfoRowPanel} from "../../../common/info-row-panel/info-row-panel";
import {customHistory} from "../../routes";
import {Copiable} from "../../../common/copiable/copiable";
import {Badge} from "../../../common/badge/badge";
import moment from "moment";
import {KComponent} from "../../../common/k-component";
import {chainApi} from "../../../../api/common/chain-api";
import {pronounce} from "../../../../common/utils/common";

const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class BlockRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            info: null,


        };
        this.fetchInfo(props.match.params.blockID);
    };

    fetchInfo = (blockID) => {

        chainApi.getBlockDetails(blockID).then((info) => {
            if (!info) {
                customHistory.push("/");
                return;
            }
            this.setState({info})
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.blockID !== this.props.match.params.blockID) {
            this.setState({info: null});
            this.fetchInfo(nextProps.match.params.blockID);

        }
    }


    displays = [
        {
            label: "Block height(#)",
            display: data => <p>{data.blockNo + 1}</p>
        },
        {
            label: "Hash",
            display: data => (
                <Copiable
                    getCopyValue={() => data.hash}
                >
                    <div className="hash">
                        {data.hash}
                        <i className="fas fa-copy"></i>
                    </div>

                </Copiable>


            )
        }, {
            condition: data => data.minedBy,
            label: "Merkle hash",
            display: data => (
                <Copiable
                    getCopyValue={() => data.rootHash}
                >
                    <div className="hash">
                        {data.rootHash}
                        <i className="fas fa-copy"></i>
                    </div>

                </Copiable>


            )
        }, {
            condition: data => data.minedBy,
            label: "Previous hash",
            display: data => (
                <div className="address">
                    <p className="link-text no-limit"
                       onClick={() => customHistory.push(`/block/${data.previousHash}`)}>{data.previousHash}</p>
                    <Copiable
                        getCopyValue={() => data.previousHash}
                    >

                        <i className="fas fa-copy"></i>
                    </Copiable>

                </div>


            )
        }, {
            label: "Nonce",
            display: data => (
                <p>{data.nonce}</p>
            )
        }, {
            condition: data => data.minedBy,
            label: "Mined by",
            display: data => (
                <div className="mined-by">
                    <span className="link-text">{data.minedBy.wallet.address}</span><span><span
                    className="name">({data.minedBy.fullname})</span> In {moment.duration(Number(data.minedRate)).asSeconds()} {pronounce("second", Number(data.minedRate) / 1000, "s")}</span>
                </div>

            )
        }, {
            label: "Reward",
            display: data => (
                <p className="reward">{data.reward} <span>KAP</span></p>
            )
        }, {
            label: "Timestamp",
            display: data => (
                <p>{moment(data.timestamp).format("HH:mm:ss MMM DD YYYY")}</p>
            ),
        },
        {
            label: "Data",
            display: data => {
                return (
                    <div className="data">
                        <p>{data.data.length} found</p>
                        {!!data.data.length && (
                            <div className="txns">
                                {data.data.map((each, i) => (
                                    <div className="txn-info" key={each.hash}>
                                        <p className="label">{i+1}.</p>
                                        <p className="value link-text" onClick={() => customHistory.push(`/txn/${each.hash}`)}>{each.hash}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                )
            },
        },

    ];

    render() {
        let {info, loading} = this.state;
        return (
            <PageTitle
                title={`Block ${this.props.match.params.blockID}`}
            >
                <MainLayout>
                    <div className="block-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Block Details</p>
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