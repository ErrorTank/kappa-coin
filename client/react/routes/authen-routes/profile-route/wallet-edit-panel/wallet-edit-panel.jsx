import React from "react";
import {Copiable} from "../../../../common/copiable/copiable";

export class WalletEditPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    walletDetails = [
        {
            label: (
                <>
                    <i className="far fa-sticky-note"></i>
                    Address (Public key)
                </>
            ),
            render: ({address}) => {
                return (
                    <Copiable
                        getCopyValue={() => address}
                    >
                        <div className="hex-contain">
                            {address}
                            <i className="fas fa-copy"></i>
                        </div>
                    </Copiable>
                )
            }
        }, {
            label: (
                <>
                    <i className="fas fa-key"></i>
                    Private key
                </>
            ),
            render: ({keyPair}) => {
                return (
                    <Copiable
                        getCopyValue={() => keyPair.privateKey}
                    >
                        <div className="hex-contain">
                            {keyPair.privateKey}
                            <i className="fas fa-copy"></i>
                        </div>
                    </Copiable>
                )
            }
        }, {
            label: (
                <>
                    <i className="fas fa-money-check"></i>
                    Balance
                </>
            ),
            render: ({balance}) => {
                return (
                    <div className="balance">
                        {balance}
                    </div>
                )
            }
        },
    ];

    render() {
        let {wallet} = this.props;

        return (
            <div className="wallet-edit-panel edit-panel border-box" id="wallet">
                <div className="panel-header">
                    <p className="header-title"><i className="fas fa-wallet"></i> Wallet Details</p>
                </div>
                <div className="panel-body">
                    {this.walletDetails.map((each, i) => {
                        return (
                            <div className="wallet-detail"
                                 key={i}
                            >
                                <div className="detail-label">{each.label}</div>
                                <div className="detail-content">
                                    {each.render(wallet)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}