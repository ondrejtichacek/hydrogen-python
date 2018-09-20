'use babel';

import { CompositeDisposable } from "atom";
import React from "react";
import ReactTable from "react-table";

// This component is in charge of getting state into the React system.
export default class VariableExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
    this.subscriptions = null;
  }

  handleUpdateVars(data) {
    this.setState(prevState => ({
      tableData: data
    }));
  }

  componentDidMount() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      this.props.emitter.on('did-update-vars', this.handleUpdateVars.bind(this)),
    );
  }

  componentWillUnmount() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
      this.subscriptions = null;
    }
  }

  render() {
    return (
      <VariableExplorerRenderer data={this.state} />
    );
  }
}

class VariableExplorerRenderer extends React.Component {
  render() {
    return (
      <div class="hpy-variable-explorer">
        <ReactTable
          data={this.props.data.tableData}
          columns={[
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Type",
              accessor: "type",
              maxWidth: 75,
              Cell: row => (
                <span>
                  <span style={{
                    backgroundColor: row.value === 'module' ? '#595457'
                      : row.value === 'int' ? '#4d6cfa'
                      : row.value === 'float' ? '#de0d92'
                      : row.value === 'float64' ? '#9e1946'
                      : row.value === 'ndarray' ? '#390099'
                      : row.value === 'str' ? '#7ac74f'
                      : row.value === 'dict' ? '#56cbf9'
                      : row.value === 'list' ? '#d9f9a5'
                      : row.value === 'set' ? '#00cfc1'
                      : row.value === 'tuple' ? '#c73e1d'
                      : row.value === 'complex' ? '#f18f01'
                      : row.value === 'DataFrame' ? '#a1cf6b'
                      : '#595457',
                    transition: 'all .3s ease'
                  }}> __
                  </span> {
                    row.value
                  }
                </span>
              )
            },
            {
              Header: "Size",
              accessor: "size",
              maxWidth: 75,
              // accessor: d => d.size
            },
            {
              Header: "Value",
              accessor: "value",
            },
          ]}
          defaultPageSize={100}
          showPageSizeOptions={false}
          minRows={20}
          className="-striped -highlight hpy-variable-table"
          noDataText="Variable explorer will initialize once you run a chunk of code. This experimental feature was tested with Python 3 only."
        />
      </div>
    );
  }
}
