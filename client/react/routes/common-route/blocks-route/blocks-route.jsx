import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {formatMoney} from "../../../../common/utils/common";
import moment from "moment"
import {transactionApi} from "../../../../api/common/transaction-api";
import {SearchInput} from "../../../common/search-input/search-input";
import omit from "lodash/omit"
import {chainApi} from "../../../../api/common/chain-api";

export default class BlocksRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            checking: true,
            valid: true
        };


        this.autoCheck = setInterval(this.validateChain, 10000);

    };

    componentDidMount() {
        this.validateChain();
    }

    validateChain = () => {
        this.setState({checking: true});
        chainApi.validateChain().then(({valid}) => this.setState({valid, checking: false}));
    };

    componentWillUnmount() {
        clearInterval(this.autoCheck);
    }

    columns = [
        {
            label: "Block",
            cellDisplay: (block) => (
                <p>{block.blockNo + 1}</p>
            ),

        },
        {
            label: "Hash",
            cellDisplay: (block) => (
                <p className="link-text">{block.hash}</p>
            ),

        },{
            label: "MerkleHash",
            cellDisplay: (block) => (
                <p className="link-text">{block.rootHash || "GENESIS"}</p>
            ),

        }, {
            label: "Miner",
            cellDisplay: (block) => {

                return (

                    <p className="link-text">{block.minedBy ? block.minedBy.fullname : "GENESIS"}</p>
                )
            }
        },{
            label: "Age",
            cellDisplay: (block) => (
                <p>{moment(block.timestamp).fromNow()}</p>
            )
        },
    ];





    render() {

        const api = (config) => chainApi.getBlocks(config).then((list) => {
            this.setState({list});

            return list;
        });
        let {keyword, valid, checking} = this.state;
        return (
            <PageTitle
                title={"All Blocks"}
            >
                <MainLayout>
                    <div className="pool-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">All KappaCoin Blocks</p>
                                <div className="border-box">
                                    <div className="filter-bar text-right">
                                        <SearchInput
                                            className={"search-txns"}
                                            placeholder={`Filter by block's hash, merkle root hash`}
                                            onSearch={(keyword) => this.setState({keyword})}
                                            value={keyword}
                                        />
                                        <div className="auto-validate">
                                            {checking ?
                                                <span className="checking">Checking...</span>
                                                : valid ?
                                                    <span className="checking valid"><i className="far fa-check-circle"></i> Chain is valid  <i className="fas fa-sync-alt force" onClick={this.validateChain}></i></span>
                                                    :
                                                    <span className="checking in-valid"><i className="far fa-times-circle"></i> Chain is invalid <i className="fas fa-sync-alt force" onClick={this.validateChain}></i></span>
                                            }
                                        </div>
                                    </div>
                                    <div className="data-table-wrapper">
                                        <CommonDataTable
                                            totalText={total => `A total of ${total} blocks found`}
                                            realTimeConfig={{
                                                uri: document.location.origin + "/mine-block",
                                                createHandlers: (socket, utils) => [
                                                    {
                                                        name: "new-chain",
                                                        handler: ({list, total}, state) => {
                                                            if(!this.state.keyword && state.page === 0)
                                                                utils.setState({list, total});
                                                        }
                                                    },
                                                ]
                                            }}
                                            api={api}
                                            filter={{
                                                keyword
                                            }}
                                            maxItem={5}
                                            columns={this.columns}
                                            rowLinkTo={(e, row) => `/block/${row.hash}`}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"There are no matching blocks"}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}