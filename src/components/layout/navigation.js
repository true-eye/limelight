import { Component,Fragment } from 'react';
import { Icon, Menu, Layout } from 'antd';
import { get } from 'lodash';


import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import pathToRegexp from 'path-to-regexp';

class Navigation extends Component {
  handleMenuClick = e => {
    this.setState({ selectedMenuKeys: e.keyPath });
  };

  render() {
    const pathname = get(this.props, ['location', 'pathname']);
    const match = pathToRegexp(`/(.*)`).exec(pathname);
    const keys = get(match, 1).split('/');
    const selectedMenuKeys = keys.length > 0 ? keys : ['limelights'];

    const { collapsed } = this.props;
    const appVersion = window.require('electron').remote.app.getVersion();
    return (
      <Fragment>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{
            height: collapsed ? 30 : 50,
            margin: '21px 0',
            textAlign: 'center',
          }}
        >
          <Link to="/limelights">
            <img
              src={require(`../../assets/LLICO.ico`)}
              alt="LIMELIGHT"
              style={{ height: '100%' }}
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedMenuKeys}
          onClick={this.handleMenuClick}
        >
          <Menu.Item key="limelights">
            <Link to="/limelights">
              <div>
                <Icon type="video-camera" />
                <span>Limelights</span>
              </div>
            </Link>
          </Menu.Item>
         
          {/*
          <Menu.Item key="settings">
            <Link to="/settings/">
              <div>
                <Icon type="setting" />
                <span>Settings</span>
              </div>
            </Link>
          </Menu.Item>
          */}
        </Menu>
        <p style={{color:"dimgrey", textAlign:"center", margin:"10px", position:"absolute",top:"425px"}}>{appVersion}</p>
      </Layout.Sider>
       
       </Fragment>
    );
  }
}

export default withRouter(Navigation);
