import * as WebSocket from 'ws';

const limelightServer = mainWindow => {
  const appendLog = msg => {
    mainWindow.webContents.send('appendLog', msg);
  };

  const addNewLimelight = limeLight => {
    mainWindow.webContents.send('newLimelight', limeLight);
  };

  const toLimelight = ws_msg => {
    return ws_msg.length >= 6
      ? {
          teamNumber: ws_msg[0],
          staticIP: ws_msg[1] === '1',
          ipAddr: ws_msg[2],
          netMask: parseInt(ws_msg[3]),
          gateWay: ws_msg[4],
          hostName: ws_msg[5].length > 0 ? 'limelight-' + ws_msg[5] : 'limelight',
        }
      : {};
  };

  const getLimelight = ipAddr => {
    return new Promise(resolve => {
      const msg = 'get_all_networking_info 0*#';
      const limelightURL = `ws://${ipAddr}:5805`;

      const ws = new WebSocket(limelightURL);
      ws.onopen = async () => {
        appendLog(`Probing ${ipAddr} ...`);
        ws.send(msg);
      };
      ws.onmessage = ({ data: response }) => {
        const [type, params] = response.split(' ');
        if (type === 'status_update') {
          return;
        }
        if (type === 'get_all_networking_info_response') {
          resolve(toLimelight(params.split(':')));
          ws.close();
        }
      };
    });
  };

  const restartLimelight = ipAddr => {
    const limelightURL = `ws://${ipAddr}:5805`;
    const ws = new WebSocket(limelightURL);
    ws.onopen = () => {
      appendLog(`Restarting ${ipAddr}`);
      ws.send('restart_vision_server 0*#');
      ws.close();
    };
  };

  const foundLimelight = async msg => {
    const terms = msg.split(':');
    // message should be in the form
    // h:<hostname>:ip:<ipaddress>
    if (terms.length !== 4 || terms[0] !== 'h' || terms[2] !== 'ip') {
      return;
    }

    const ipAddr = terms[3];

    // Request the network settings of this limelight
    const limeLight = await getLimelight(ipAddr);
    addNewLimelight(limeLight);
  };


  return { foundLimelight, appendLog, restartLimelight /*, addNewLimelight*/ };
};

export default limelightServer;
