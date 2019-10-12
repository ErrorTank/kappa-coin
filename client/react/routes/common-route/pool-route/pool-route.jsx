import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {formatMoney} from "../../../../common/utils/common";
import moment from "moment"
import {transactionApi} from "../../../../api/common/transaction-api";
import {SearchInput} from "../../../common/search-input/search-input";

export default class PoolRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ""
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
            label:  <span>To <i className="fas fa-wallet"></i></span>,
            cellDisplay: (txns) => (
                <p className="link-text">{Object.keys(txns.outputMap)[0]}</p>
            )
        }, {
            label:  <span className="amount-label">Amount <img src={"/assets/image/kappa.png"}/></span>,
            cellDisplay: (txns) => (
                <p className="amount-cell">{formatMoney(Number(txns.outputMap[Object.keys(txns.outputMap)[0]]))} KAP</p>
            )
        }, {
            label: "Last seen",
            cellDisplay: (txns) => (
                <p>{moment(txns.input.timestamp).fromNow()}</p>
            )
        },
    ];

    render() {
        const api = (config) => transactionApi.getPendingTransactions(config).then((list) => list);
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
                                            api={api}
                                            filter={{
                                                keyword
                                            }}
                                            maxItem={10}
                                            columns={this.columns}
                                            rowLinkTo={(e, row) => `/transaction/${row._id}`}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"There are no matching entries"}
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