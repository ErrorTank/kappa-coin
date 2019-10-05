import React, {lazy, Suspense} from "react";
import {Route, Switch, Router, Redirect} from "react-router-dom"
import { createBrowserHistory } from 'history';
import {ModalsRegistry} from "../common/modal/modals";
export const customHistory = createBrowserHistory();
import {WithLocationRoute} from "./route-types/with-location-route";
import {AuthenRoute, GuestRoute} from "./route-types/authen-routes";
import {OverlayLoading} from "../common/overlay-loading";
const HomeRoute =  lazy(delayLoad(() => import("./common-route/home-route/home-route")));


const delayLoad = fn => () => new Promise(resolve => {
    setTimeout(() => resolve(fn()), 300)
});

export class MainRoute extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div id="main-route">
                    <ModalsRegistry/>
                    <Router
                        history={customHistory}
                    >
                        <Suspense fallback={<OverlayLoading/>}>
                        <Switch>
                            <WithLocationRoute exact path="/" render={props => (<HomeRoute {...props}/>)}/>
                        </Switch>
                        </Suspense>
                    </Router>

            </div>
        );
    }
}