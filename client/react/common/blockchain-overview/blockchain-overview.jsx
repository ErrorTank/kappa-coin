import React from "react";

export class BlockchainOverview extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {chain} = this.props;
        return(
            <div className="blockchain-overview border-box">
                <div className="panel col-4">
                    <div className="upper">
                        <p className="label">KAP Price</p>
                        <p className="value">${process.env.USD_RATE}</p>
                    </div>
                    <div className="lower">
                        <p className="label">Latest Block</p>
                        <p className="value">{chain.latestBlock.blockNo + 1} <span className="unit">({!chain.latestBlock.isGenesis ? Number((chain.latestBlock.minedRate) / 1000) + "s": "Genesis block"})</span></p>
                    </div>
                </div>
                <div className="panel col-4">
                    <div className="upper">
                        <p className="label">Difficulty</p>
                        <p className="value">{chain.difficulty}</p>
                    </div>
                    <div className="lower">
                        <p className="label">Pending Txns</p>
                        <p className="value">{chain.pendingCount}</p>
                    </div>
                </div>
                <div className="panel col-4">
                    <div className="upper">
                        <p className="label">Mine Rate</p>
                        <p className="value">{process.env.MINE_RATE} <span className="unit">(s)</span></p>
                    </div>
                    <div className="lower">
                        <p className="label">Reward</p>
                        <p className="value">3 <span className="unit">(KAP)</span></p>
                    </div>
                </div>
            </div>
        );
    }
}