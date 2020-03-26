import { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';

import Navigation from '../components/layout/navigation';

const { ipcRenderer } = window.require('electron');

class BaseLayout extends Component {
  state = {
    collapsed: true,
  };

  componentDidMount() {
    ipcRenderer.on('appendLog', (event, msg) => {
      console.log('New log', msg);
      this.props.dispatch({ type: 'limelights/appendLog', msg });
    });
    ipcRenderer.on('clearLog', (event, msg) => {
      console.log('Clear log', msg);
      this.props.dispatch({ type: 'limelights/clearLog', msg });
    });
    ipcRenderer.on('newLimelight', (event, limeLight) => {
      console.log('New limelight', limeLight);
      const { limeLights } = this.props;
      if (limeLights.findIndex(item => item.ipAddr === limeLight.ipAddr) !== -1) {
        console.log(`This limeLight already exists`, limeLight);
        return;
      }

      const { staticIP, netMask, hostName, ipAddr } = limeLight;

      //todo make red x for dynamic, green check for static - done
      //todo red text if netmask is not 255.255.255.0 - done
      //todo autoscroll text area - done
      //todo click row for select, no checkbox. double-click to open webpage - done

      switch (netMask) {
        case 24:
          limeLight.netMask = '255.255.255.0';
          break;
        case 16:
          limeLight.netMask = '255.255.0.0';
          break;
        case 8:
          this.props.dispatch({ type: 'limelights/appendLog', msg: 'bbb' });
          limeLight.netMask = '255.0.0.0';
          break;
        default:
          limeLight.netMask = '0.0.0.0';
          break;
      }

      const msg = `New Limelight found: ${ipAddr}, Static: ${staticIP}, Netmask: ${netMask}`;
      this.props.dispatch({ type: 'limelights/appendLog', msg });
      this.props.dispatch({ type: 'limelights/newLimelight', limeLight });
    });
  }

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navigation collapsed={this.state.collapsed} />
        <Layout>
          {/*<Header collapsed={this.state.collapsed} onToggl={this.toggleSider} />*/}
          {children}
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  limeLights: state.limelights.items,
});

export default connect(mapStateToProps)(BaseLayout);
