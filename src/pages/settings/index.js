import { Component } from 'react';
import { Layout } from 'antd';
import withRouter from 'umi/withRouter';

class Limelight extends Component {
  render() {
    return <Layout.Content></Layout.Content>;
  }
}

export default withRouter(Limelight);
