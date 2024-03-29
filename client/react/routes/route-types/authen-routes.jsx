import React from "react";
import { userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";
import {authenCache} from "../../../common/cache/authen-cache";
import {KComponent} from "../../common/k-component";
import {customHistory} from "../routes";


export class GuestRoute extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // this.onUnmount(userInfo.onChange(() => {
    //   this.forceUpdate();
    // }));
  };

  render() {
    let {render, component: Component, ...rest} = this.props;

    return (
      <Route
        {...rest}
        render={props => !authenCache.getAuthen() ? render ? render(props) : (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )}
      />
    );
  }
}

export const AuthenRoute = ({component: Component, excludeRoles = null, ...rest}) => {
  let getComp = (props) => {
    let info = userInfo.getState();
    if (!authenCache.getAuthen()) {

      return (
        <Redirect to={{pathname: "/"}}/>
      )
    }
    if (info && excludeRoles && excludeRoles.length) {

      if (excludeRoles.includes(info.role)) {
        return (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    }
    // return (
    //   <AuthenLayout location={props.location} match={props.match}>
    //     <Component {...props}/>
    //   </AuthenLayout>
    // )
    return (
      <AuthenCheck {...props}>
        <Component {...props}/>
      </AuthenCheck>
    )
  };
  return (
    <Route
      {...rest}
      render={props => {
        return (
          <TrackLocation
            location={props.match.url}
            render={() => getComp(props)}
          />


        )
      }}
    />
  );
};


export class AuthenCheck extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onUnmount(userInfo.onChange((newState, oldState) => {
      if (!newState || !oldState) {
        customHistory.push("/");
      }


    }))
  };

  render() {
    return this.props.children
  }
}