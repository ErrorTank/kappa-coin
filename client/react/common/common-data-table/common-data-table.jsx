import React from "react";
import isEqual from "lodash/isEqual"
import {Pagination} from "./pagination/pagination";
import classnames from "classnames"
import isEmpty from "lodash/isEmpty";
import {customHistory} from "../../routes/routes";

export class CommonDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            page: 0,
            loading: true,
            sort: null,
            total: null

        };
        this.loadData({skip: this.pageSize() * this.state.page, take: this.pageSize()});
    };

    loadData = (changes = {}) => {
        let options = {
            page: changes.page === undefined ? this.state.page : changes.page,
            sort: changes.sort === undefined ? this.state.sort : changes.sort,
            filter: changes.filter === undefined ? this.props.filter : changes.filter,
        };

        this.setState({page: options.page, sort: options.sort, loading: true});

        this.props.api({
            filter: options.filter,
            sort: options.sort,
            skip: this.pageSize() * (options.page - 1),
            take: this.pageSize()
        }).then((data) => {
            if (this.isDesiredLoad(options)) {
                this.setState({
                    loading: false,
                    list: data.list,
                    total: data.total,
                });
            }
        });
    };

    isDesiredLoad(options) {
        return options.page === this.state.page &&
            isEqual(options.sort, this.state.sort) &&
            isEqual(options.filter, this.props.filter)
            ;
    }


    toggleSort(sortKey) {
        if (this.state.sort === null || this.state.sort.key !== sortKey) {
            this.loadData({sort: {key: sortKey, value: "asc"}, page: 0});
        } else {
            if (this.state.sort.value === "asc") {
                this.loadData({sort: {key: sortKey, value: "desc"}, page: 0});
            } else {
                this.loadData({sort: null, page: 0});
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {filter, maxItem} = this.props;

        if (!isEqual(nextProps.filter, filter || maxItem !== nextProps.maxItem)) {
            this.loadData({page: 0, sort: null})
        }
    }

    pageSize() {
        const {maxItem = 10} = this.props;
        return maxItem;
    }

    clickRow = (e, row) =>  {
        let {rowLinkTo, onClickRow} = this.props;
        if (rowLinkTo) {
            customHistory.push(rowLinkTo(e, row));
        } else if (onClickRow) {
            onClickRow(e, row);
        }
    };

    render() {
        let {columns, className, rowTrackBy = (row, i) => i, onClickRow, rowLinkTo, rowClassName, emptyNotify = "Empty table."} = this.props;
        let {list, page, total} = this.state;

        return (
            <div className="common-data-table">
                <table className={classnames("data-table", className)}>
                    <thead>
                    <tr>
                        {columns.map(this.renderHeaderCell)}
                    </tr>
                    </thead>
                    <tbody>
                    {isEmpty(list) ? (
                        <tr>
                            <td className="no-data" colSpan={columns.length}>{emptyNotify}</td>
                        </tr>
                    ) : list.map((row, rIndex) => (
                        <tr
                            key={rowTrackBy(row, rIndex)}
                            onClick={(onClickRow == null && rowLinkTo == null) ? () => null : e => this.clickRow(e, row)}
                            className={classnames({clickable: onClickRow != null || rowLinkTo != null}, rowClassName)}
                        >
                            {columns.map(({cellClass, cellCheckbox = false, cellDisplay, show = () => true}, index) => {
                                return show({data: list}) ? (
                                    <td key={index}
                                        className={classnames(cellClass, {"checkbox-cell": cellCheckbox})}>
                                        {cellDisplay ? cellDisplay(row, rIndex) : null}
                                    </td>
                                ) : null;
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="table-footer">
                    {list && (
                        <div className="summary">
                            A total of {total} pending txns found
                        </div>
                    )}
                    <Pagination
                        value={page + 1}
                        totalPage={Math.ceil(total / this.pageSize())}
                        onChange={(newPage) => {
                            this.loadData({page: newPage - 1})
                        }}
                    />
                </div>

            </div>
        );
    }

    renderHeaderCell = (column, index) => {
        let {list} = this.state;
        let {label, sortable = false, sortKey, cellClass, customHeader = null, show = () => true} = column;
        if (!show({list})) {
            return null;
        }
        let renderHeader = () => customHeader ? customHeader(list) : label;
        if (!sortable) {
            return (
                <th className={cellClass} key={index}>
                    {renderHeader()}
                </th>
            );
        }

        if (!sortKey) {
            throw new Error(`Sortable Column "${label}" need sortFunc or sortKey property`);
        }

        return (
            <SortableHeaderCell
                key={index}
                label={label}
                className={cellClass}
                sort={this.state.sort && this.state.sort.key == sortKey && (this.state.sort.value)}
                onClick={() => this.toggleSort(sortKey)}
                header={renderHeader()}
            />
        )
    };
}

export function SortableHeaderCell(props) {
    return (
        <th onClick={props.onClick}
            className={classnames("sortable-header-cell", props.className)}
        >
              <span>
              {props.header}

                  {props.sort && (
                      <i className={`fas ${props.sort == "asc" ? 'fa-sort-down' : 'fa-sort-up'}`}/>
                  )}
              </span>
        </th>
    )
}