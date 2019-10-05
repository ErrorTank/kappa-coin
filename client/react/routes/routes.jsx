import React from "react";
import {Route, Switch, Router, Redirect} from "react-router-dom"
import { createBrowserHistory } from 'history';
export const customHistory = createBrowserHistory();


export class MainRoute extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div id="main-route">

                    <Router
                        history={customHistory}
                    >
                        <Switch>
                            <Route exact path={"/"} component={ViewPoolRoute}/>
                        </Switch>
                    </Router>

            </div>
        );
    }
}