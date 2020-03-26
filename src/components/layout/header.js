import { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'dva';
import { Icon, Layout, Select, Button } from 'antd';
import { get } from 'lodash';

import Link from 'umi/link';

class Header extends Component {
  controlButtons = ['edit', 'download', 'upload', 'star'];
  componentDidMount() {
    this.props.dispatch({ type: 'organizations/list' });
  }

  render() {
    const pipeline = {
      name: 'Pipeline_Name',
    };
    return (
      <Layout.Header>
 
        <div className="inlineitem">
          <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.onToggl}
            style={{
              padding: '0 24px',
              fontSize: 18,
              cursor: 'pointer',
              transition: 'color .3s',
            }}
          />
        </div>
      </Layout.Header>
    );
  }
}

export default compose(
  connect(state => ({
    organizations: state.organizations,
  }))
)(Header);
