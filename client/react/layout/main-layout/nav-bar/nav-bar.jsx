import React from "react";
import classnames from "classnames"
import {customHistory} from "../../../routes/routes";
import {userInfo} from "../../../../common/states/common";

export class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
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
                    label: "View Transactions",
                    url: "/transactions"
                },{
                    label: "View Blocks",
                    url: "/blocks"
                },{
                    label: "View Pool",
                    url: "/pool"
                },
            ]
        },{
            label: "Mining",
            url: "/mining"
        },
        {
            label: "Exchange",
            url: "/exchange"
        },{
            label: () => {
                let info = userInfo.getState();
                return (
                    <>
                        <i className="fas fa-user-circle acc-icon"></i>
                        {info ? info.name : "Sign in"}
                    </>
                )
            },
            dropdownCond: () => userInfo.getState(),
            dropdownItems: [
                {
                    label: "Profile",
                    url: "/profile"
                },{
                    label: "Wallet",
                    url: "/wallet"
                },{
                    label: () => {
                        return (
                            <div className="sign-out">
                                <button className="btn btn-sign-out">
                                    Sign Out
                                </button>
                            </div>
                        )
                    },
                    onClick: () => {

                    }
                },
            ]
        },

    ];

    render(){
        return(
            <div className="nav-bar">
                <div className="container">
                    <div className="wrapper">
                        <div className="brand">
                            <img src="./assets/image/kappa.png"/>
                            <span>KappaCoin</span>
                        </div>
                        <div className="navs">
                            {this.navs.map((each) => {
                                return (
                                    <div className={classnames("each-nav", {active: each.url === customHistory.location.pathname})}
                                         onClick={() => each.url && customHistory.push(each.url)}
                                         key={each.url}
                                    >
                                        {typeof each.label === "string" ? each.label : each.label()}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}