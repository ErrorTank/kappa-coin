import React from "react"

export const OverlayLoading = ({renderText = () => "Loading..."}) => (
    <div id="initial-loading">
        <div className="lds-css ng-scope">
            <div id="il-wrapper">
                <div style={{width: "100%", height: "100%"}} className="lds-eclipse">
                    <div>
                    </div>
                </div>
                <p id="il-text">{renderText()}</p>
            </div>
        </div>
    </div>
);