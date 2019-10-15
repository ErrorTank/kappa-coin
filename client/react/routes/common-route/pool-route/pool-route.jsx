import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {formatMoney} from "../../../../common/utils/common";
import moment from "moment"
import {transactionApi} from "../../../../api/common/transaction-api";
import {SearchInput} from "../../../common/search-input/search-input";
import omit from "lodash/omit"

export default class PoolRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
        };
    };

    columns = [
        {
            label: "# Txns hash",
            cellDisplay: (txns) => (
                <p className="link-text">{txns.hash}</p>
            ),

        }, {
            label: <span>From <i className="fas fa-wallet"></i></span>,
            cellDisplay: (txns) => (
                <p className="link-text">{txns.input.address}</p>
            )
        }, {
            label:  <span>Total receiver(s)</span>,
            cellDisplay: (txns) => (
                <p>{Object.keys(txns.outputMap).length - 1}</p>
            )
        }, {
            label:  <span className="amount-label">Total amount <img src={"/assets/image/kappa.png"}/></span>,
            cellDisplay: (txns) => (
                <p className="amount-cell">{formatMoney(Number(Object.values(omit(txns.outputMap, txns.input.address)).reduce((total, cur) => total + cur,0)))} KAP</p>
            )
        }, {
            label: "Last updated",
            cellDisplay: (txns) => (
                <p>{moment(txns.updatedAt).fromNow()}</p>
            )
        },
    ];

    render() {
        const api = (config) => transactionApi.getPendingTransactions(config).then((list) => {
            this.setState({list});
            return list;
        });
        let {keyword} = this.state;
        return (
            <PageTitle
                title={"Pending Transactions"}
            >
                <MainLayout>
                    <div className="pool-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Pending Transactions</p>
                                <div className="border-box">
                                    <div className="filter-bar text-right">
                                        <SearchInput
                                            className={"search-txns"}
                                            placeholder={`Filter by address, txns's hash`}
                                            onSearch={(keyword) => this.setState({keyword})}
                                            value={keyword}
                                        />
                                    </div>
                                    <div className="data-table-wrapper">
                                        <CommonDataTable
                                            realTimeConfig={{
                                                uri: process.env.APP_URI + "pending-transaction",
                                                createHandlers: (socket, utils) => [
                                                    {
                                                        name: "new-pool",
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
                                            rowLinkTo={(e, row) => `/transaction/${row._id}`}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"There are no matching transactions"}
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