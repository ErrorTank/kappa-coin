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
            loading: true,

        };
        this.fetchInfo();
    };

    fetchInfo = () => {
        chainApi.getBlockDetails(this.props.match.params.blockID).then((info) => {
            if (!info) {
                customHistory.push("/");
                return;
            }
            this.setState({info, loading: false})
        });
    };


    displays = [
        {
            label: "#",
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
            label: "Previous hash",
            display: data => (
                <Copiable
                    getCopyValue={() => data.previousHash}
                >
                    <div className="hash">
                        {data.hash}
                        <i className="fas fa-copy"></i>
                    </div>

                </Copiable>


            )
        }, {
            label: "Nonce",
            display: data => (
                <p>{data.nonce}</p>
            )
        },{
            label: "Reward",
            display: data => (
                <p>{data.reward}</p>
            )
        },{
            label: "Mined rate",
            display: data => (
                <p>In {moment.duration(Number(data.minedRate)).asSeconds()} {pronounce("second", Number(data.minedRate) / 1000, "s")}</p>
            )
        },  {
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