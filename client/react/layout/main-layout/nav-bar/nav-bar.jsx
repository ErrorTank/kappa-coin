import React from "react";
import classnames from "classnames"
import {customHistory} from "../../../routes/routes";
import {userInfo, walletInfo} from "../../../../common/states/common";
import {CSSTransition} from "react-transition-group";
import {Dropdown} from "../../../common/dropdown/dropdown";
import {authenCache} from "../../../../common/cache/authen-cache";

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    handleSignout = () => {
        userInfo.setState(null);
        walletInfo.setState(null);
        authenCache.clearAuthen();
    };

    navs = [
        {
            label: "Home",
            url: "/"
        },
        {
            label: "Blockchain",
            dropdownItems: [
                {
                    label: "View Blocks",
                    url: "/blocks"
                }, {
                    label: "View Pool",
                    url: "/pool"
                },
            ]
        }, {
            label: "Mining",
            url: "/mining"
        },
        {
            label: "Exchange",
            url: "/exchange"
        }, {
            cannotActive: true,
            url: "/login",
            label: () => {
                let info = userInfo.getState();
                return (
                    <>
                        <p className="full-name">
                            {info ? info.fullname : "Sign in"}

                        </p>
                        <i className="fas fa-user-circle acc-icon"></i>
                    </>
                )
            },
            dropdownCond: () => userInfo.getState(),
            dropdownItems: [
                {
                    label: "Profile",
                    url: "/profile#info",
                    isActive: () => customHistory.location.hash === "#info"
                }, {
                    label: "Wallet",
                    url: "/profile#wallet",
                    isActive: () => customHistory.location.hash === "#wallet"
                }, {
                    label: () => (
                        <div>
                            My transactions
                        </div>
                    ),
                    url: "/my-transactions",
                }, {
                    label: () => {
                        return (
                            <div className="sign-out">
                                <button className="btn btn-sign-out"
                                        onClick={this.handleSignout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )
                    },
                },
            ]
        },

    ];

    render() {

        return (
            <div className="nav-bar">
                <div className="container">
                    <div className="wrapper">
                        <div className="brand" onClick={() => customHistory.push("/")}>
                            <img src="/assets/image/kappa.png"/>
                            <span>KappaCoin</span>
                        </div>
                        <div className="navs">
                            {this.navs.map((each) => {

                                return (
                                    <Dropdown
                                        className={classnames("each-nav", {active: !each.cannotActive ? each.url ? each.url === customHistory.location.pathname : each.dropdownItems.map(i => i.url).includes(customHistory.location.pathname) : false})}
                                        onClick={() => {

                                            if(each.url && (each.dropdownCond ? !each.dropdownCond() : true)) customHistory.push(each.url)
                                        }}
                                        key={each.url || JSON.stringify(each.dropdownItems)}
                                        content={(
                                            <>
                                                {typeof each.label === "string" ? each.label : each.label()}
                                                {(each.dropdownItems && (each.dropdownCond ? each.dropdownCond() : true)) && (
                                                    <i className="fas fa-angle-down" style={{marginLeft: "8px"}}></i>
                                                )}
                                            </>
                                        )}
                                        dropdownContent={(show) => (
                                            <CSSTransition in={show} timeout={200} classNames={"lift-up"}>
                                                {(each.dropdownItems && show && (each.dropdownCond ? each.dropdownCond() : true)) ? (
                                                    <div className="dropdown-panel">
                                                        {each.dropdownItems.map((item, i) => (
                                                            <div key={i}
                                                                 className={classnames("dropdownItem", {active: item.isActive ? item.isActive() : item.url ? item.url === customHistory.location.pathname : false})}
                                                                 onClick={(e) => {
                                                                     e.stopPropagation();
                                                                     customHistory.push(item.url)
                                                                 }}
                                                            >
                                                                {typeof item.label === "string" ? item.label : item.label()}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{display: "none"}}></span>
                                                )}


                                            </CSSTransition>
                                        )}
                                    />


                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}