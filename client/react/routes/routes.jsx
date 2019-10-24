import React, {lazy, Suspense} from "react";
import {Route, Switch, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {WithLocationRoute} from "./route-types/with-location-route";
import {AuthenRoute, GuestRoute} from "./route-types/authen-routes";
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils";

const MyTransactions = lazy(delayLoad(() => import("./authen-routes/my-transactions/my-transactions")));
const BlockRoute = lazy(delayLoad(() => import("./common-route/block-route/block-route")));
const TxnRoute = lazy(delayLoad(() => import("./common-route/txn-route/txn-route")));
const MiningRoute = lazy(delayLoad(() => import("./authen-routes/mining-route/mining-route")));
const ProfileRoute = lazy(delayLoad(() => import("./authen-routes/profile-route/profile-route")));
const HomeRoute = lazy(delayLoad(() => import("./common-route/home-route/home-route")));
const LoginRoute = lazy(delayLoad(() => import("./guest-route/login-route/login-route")));
const ExchangeRoute = lazy(delayLoad(() => import("./authen-routes/exchange-route/exchange-route")));
const PoolRoute = lazy(delayLoad(() => import("./common-route/pool-route/pool-route")));
const BlocksRoute = lazy(delayLoad(() => import("./common-route/blocks-route/blocks-route")));

export class MainRoute extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        console.log("Cac")
        return (
            <div id="main-route">
                <ModalsRegistry/>
                <Router
                    history={customHistory}
                >
                    <Suspense fallback={<OverlayLoading/>}>
                        <Switch>
                            <WithLocationRoute exact path="/" render={props => (<HomeRoute {...props}/>)}/>
                            <GuestRoute exact path="/login" render={props => <LoginRoute {...props}/>}/>
                            <AuthenRoute exact path="/my-transactions" component={MyTransactions}/>
                            <AuthenRoute exact path="/profile" component={ProfileRoute}/>
                            <AuthenRoute exact path="/exchange" component={ExchangeRoute}/>
                            <AuthenRoute exact path="/mining" component={MiningRoute}/>
                            <WithLocationRoute exact path="/pool" render={props => <PoolRoute {...props}/>}/>
                            <WithLocationRoute exact path="/txn/:txnID" render={props => <TxnRoute {...props}/>}/>
                            <WithLocationRoute exact path="/block/:blockID" render={props => <BlockRoute {...props}/>}/>
                            <WithLocationRoute exact path="/blocks" render={props => <BlocksRoute {...props}/>}/>
                        </Switch>
                    </Suspense>
                </Router>

            </div>
        );
    }
}