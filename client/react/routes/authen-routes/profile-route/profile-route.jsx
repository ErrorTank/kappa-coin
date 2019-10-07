
import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {Avatar} from "../../../common/avatar/avatar";
import {pronounce} from "../../../../common/utils/common";
import {userApi} from "../../../../api/common/user-api";
import {userInfo} from "../../../../common/states/common";
import moment from "moment"

export default class ProfileRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            info: null,
            wallet: null,
            statistic: null
        };
        userApi.getDetailUserInfo(userInfo.getState()._id).then(data => this.setState({...data, loading: false}))
    };

    statistics = [
        {
            label: "Mined Blocks",
            icon: <i className="fas fa-cube"></i>,
            value: ({minedBlocks}) => (
                <div className="statistic-value">
                    <span className="value">{minedBlocks}</span>{pronounce("Block", Number(minedBlocks), "s")}
                </div>
            )
        },{
            label: "Proceeded TXNS",
            icon: <i className="fas fa-file-contract"></i>,
            value: ({proceedTransactions}) => (
                <div className="statistic-value">
                    <span className="value">{proceedTransactions}</span>{pronounce("TXN", Number(proceedTransactions), "s")}
                </div>
            )
        },{
            label: "Mining Profit",
            icon: <i className="fas fa-hand-holding-usd"></i>,
            value: ({profit}) => (
                <div className="statistic-value">
                    <span className="value">{profit}</span>KAP
                </div>
            )
        },
    ];

    render(){
        let {info, wallet, statistic, loading} = this.state;
        console.log(info)
        console.log(wallet)
        return(
            <PageTitle
                title={!info ? "Loading..." : (info.fullname + " profile")}
            >
                <MainLayout>
                    <div className="profile-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Profile Overview</p>
                                <div className="statistic-panel profile-panel">
                                    {!loading && (
                                        <>
                                            <div className="identify">
                                                <Avatar
                                                    className={"profile-ava"}
                                                    name={info.fullname}
                                                />
                                                <div className="user-fullname">
                                                    <p>{info.fullname}</p>
                                                    <p>Joined {moment(info.createdAt).fromNow()}</p>
                                                </div>
                                            </div>
                                            <div className="statistic">
                                                {this.statistics.map(each => (
                                                    <div key={each.label}
                                                         className={"item"}
                                                    >
                                                        <div className="icon">
                                                            {each.icon}
                                                        </div>
                                                        <div className="detail">
                                                            <p className="label">{each.label}</p>
                                                            {each.value(statistic)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                </div>
                                <div className="separate">

                                </div>
                                <div className="detail-panel profile-panel">
                                    <div>
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