import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";

export default class PoolRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        const api = async () => [];
        return (
            <PageTitle
                title={"Pending Transactions"}
            >
                <MainLayout>
                    <div className="exchange-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Pending Transactions</p>
                                <div className="data-table-wrapper border-box">
                                    <div className="filter-bar">

                                    </div>
                                    <CommonDataTable
                                        api={api}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}