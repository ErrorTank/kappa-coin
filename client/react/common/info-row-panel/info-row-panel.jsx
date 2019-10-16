import React from "react";
import {LoadingInline} from "../loading-inline/loading-inline";

export class InfoRowPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    };

    render() {
        let {info, displays} = this.props;
        return (
            <div className="border-box info-row-panel">
                {info ? (
                    <>
                        {displays.map((each) =>   {
                            if(!each.condition || each.condition(info)){
                                return (
                                    <div className="info-row" key={each.label}>
                                        <div className="label">
                                            {each.label}:
                                        </div>
                                        <div className="value">
                                            {each.display(info)}
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                            }

                        )}
                    </>
                ) : (
                    <LoadingInline/>
                )}
            </div>
        );
    }
}