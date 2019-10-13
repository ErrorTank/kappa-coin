import ReactDOM from "react-dom";
import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {Avatar} from "../../../common/avatar/avatar";
import {pronounce} from "../../../../common/utils/common";
import {userApi} from "../../../../api/common/user-api";
import {userInfo, walletInfo} from "../../../../common/states/common";
import moment from "moment"
import {InfoEditPanel} from "./info-edit-panel/info-edit-panel";
import {WalletEditPanel} from "./wallet-edit-panel/wallet-edit-panel";
import {customHistory} from "../../routes";
import {KComponent} from "../../../common/k-component";

export default class ProfileRoute extends KComponent{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            info: null,
            wallet: null,
            statistic: null
        };
        userApi.getDetailUserInfo(userInfo.getState()._id).then(data => this.setState({...data, loading: false}))
        this.onUnmount(walletInfo.onChange((newState, oldState) => {

            this.setState({wallet: newState});


        })) ;
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const id = customHistory.location.hash.substring(1);
        const yOffset = -60;
        const element = document.getElementById(id);
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }

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
                                <div className="statistic-panel profile-panel border-box">

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
                                    {!loading && (
                                        <>
                                            <InfoEditPanel
                                                info={info}
                                                onEdit={data => this.setState({info: {...data}})}
                                            />
                                            <WalletEditPanel
                                                wallet={wallet}
                                            />
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