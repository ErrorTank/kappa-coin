import React, {Component} from 'react';

export class LatestDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {list, title, getKey, display, emptyNotify} = this.props;
        return (
            <div className="latest-display">
                <div className="ld-header">
                    {title}
                </div>
                <div className="ld-body">
                    {list.length ? list.map(each => {
                        return (
                            <div className="item" key={getKey(each)}>
                                {display(each)}
                            </div>
                        )
                    }) : (
                        <p className="empty">{emptyNotify}</p>
                    )}
                </div>
            </div>
        );
    }
}
