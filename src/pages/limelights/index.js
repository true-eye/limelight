import { Component } from 'react';
import { connect } from 'dva';
import { Table, Layout, Button, Input, Icon } from 'antd';
import withRouter from 'umi/withRouter';
import { animateScroll } from 'react-scroll';

class Limelight extends Component {
  state = {
    // ------- current selected row ---------
    currentRow: -1,
  };
  columns = [
    {
      title: 'Hostname',
      dataIndex: 'hostName',
      key: 'hostName',
      align: 'center',
      className:'firstcol'
 
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddr',
      key: 'ipAddr',
      align: 'center',
    },
    {
      title: 'Team #',
      dataIndex: 'teamNumber',
      key: 'teamNumber',
      align: 'center',
    },
    {
      title: 'Static IP',
      dataIndex: 'staticIP',
      key: 'staticIP',
      align: 'center',
      render: staticIP => (
        <Icon
          type={staticIP ? 'check-circle' : 'close-circle'}
          style={{ color: staticIP ? 'green' : 'red' }}
        />
      ),
    },
    {
      title: 'Netmask',
      dataIndex: 'netMask',
      key: 'netMask',
      align: 'center',
      render: netMask => (
        <div style={{ color: netMask !== '255.255.255.0' ? 'red' : undefined }}>{netMask}</div>
      ),
    },
    {
      title: 'Gateway',
      dataIndex: 'gateWay',
      key: 'gateWay',
      align: 'center',
    },
  ];
  //final todo highlight selected row.
  componentDidMount() {
    this.textareaScrollToBottom();
  }
  componentDidUpdate(prevProps) {
    if (this.props.log !== prevProps.log) {
      this.textareaScrollToBottom();
    }
    if (this.props.limeLights.length !== prevProps.limeLights.length) {
      if (this.props.limeLights.length > 0) {
        //this.setState({ currentRow: 0 });
      } else {
        this.setState({ currentRow: -1 });
      }
    }
  }

  textareaScrollToBottom = () => {
    animateScroll.scrollToBottom({ containerId: 'textlog', duration: 500 });
  };

  findLimelights = () => {
    this.props.dispatch({ type: 'limelights/findLimelights' });
  };
  restartLimelight = () => {
    const { currentRow } = this.state;
    if (currentRow === -1) {
      return;
    }
    const ipAddr = this.props.limeLights[currentRow].ipAddr;
    this.props.dispatch({ type: 'limelights/restartLimelight', ipAddr });
  };
  editLimelight = (row = this.state.currentRow) => {
    if (row === -1) {
      return;
    }
    const ipAddr = this.props.limeLights[row].ipAddr;
    this.props.dispatch({ type: 'limelights/editLimelight', ipAddr });
  };

  selectRow = key => {
    this.setState({ currentRow: key });
  };

  render() {
    const { currentRow } = this.state;
    const { limeLights, log } = this.props;

    return (
      <Layout.Content className="limelight">
        <div className="controls">
          <Button className="pull-left" size="small" onClick={this.findLimelights}>
            Find Limelights
          </Button>
          <Button className="pull-right" size="small" onClick={this.restartLimelight}>
            Restart Selected
          </Button>
          <Button
            className="pull-right"
            size="small"
            onClick={() => this.editLimelight()}
            style={{ marginRight: 10 }}
          >
            Configure Selected
          </Button>
        </div>
        <Table
          rowSelection={{
            selectedRowKeys: currentRow === -1 ? '' : (this.props.limeLights[currentRow]?this.props.limeLights[currentRow].ipAddr:'' ),
          
           // columnWidth: 0,
            //columnWidth:'0px'
            
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }
          }}
          onRow={(record, key) => ({
            // ------- select on lick on row ----------
            onClick: () => this.selectRow(key),
            // ------- configure on double click on row ---------
            onDoubleClick: () => this.editLimelight(key),
          })}
          columns={this.columns}
          pagination={{ disabled: true, hideOnSinglePage: true }}
          dataSource={limeLights}
          size="middle"
          rowKey="ipAddr"
        />
        <Input.TextArea id="textlog" value={log} autoSize={{ minRows: 6, maxRows: 6 }} />
      </Layout.Content>
    );
  }
}

const mapStateToProps = state => ({
  limeLights: state.limelights.items,
  log: state.limelights.log,
});

export default withRouter(connect(mapStateToProps)(Limelight));
