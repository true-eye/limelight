import { port, broadcastAddr } from './config';
const os = require('os');

const dgram = require('dgram');
const interface_servers = [];

const getIpList = () => {
  const list = [];
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let i in interfaces[iface]) {
      const f = interfaces[iface][i];
      if (f.family === 'IPv4' && !f.internal) {
        list.push(f.address);
        break;
      }
    }
  }
  return list;
};

const udpServer = (messageListener, appendLog /*, addNewLimelight*/) => {
  const listener = socket => {
    var address = socket.address();
    appendLog('Listening on ' + address.address + ':' + address.port);
    
  };
  const onClose = socket => {
    var address = socket.address();
    appendLog('Closed server on ' + address.address + ':' + address.port);
  };

  const onMessage = (message, info) => {
    messageListener(message.toString());
  };

  const onError = err => {
    appendLog('Error:' + err.stack);
  };

  const alreadyExists = (ip) =>{
    let hit = false;
    for(let i = 0; i < interface_servers.length; i ++){
      let tempAddr = interface_servers[i].address().address;
      if(ip === tempAddr)
      {
        hit = true;
      }
    }
    return hit;
  }

  const phoneHome = (client) =>{
    const buffer = Buffer.from('LLPhoneHome', 'ascii');
    client.send(buffer, port, broadcastAddr);
    appendLog('Broadcasting ' + '('+client.address().address+')');
  }

  const Ping_Limelights = () => {

    //if socket already exists, immediately phone home:
    interface_servers.forEach(client => {
      phoneHome(client);
    });

    //check for new interfaces (in case of network change)
    const ipList = getIpList(appendLog);
    ipList.forEach(ip => {
       if(!alreadyExists(ip))
       {
         const socket = dgram.createSocket('udp4');
         socket.on('listening', () => listener(socket));
         socket.on('message', onMessage);
         socket.on('error', onError);
         socket.on('close', () => onClose(socket))
         socket.bind(port, ip, () => {
          interface_servers.push(socket);
          socket.setBroadcast(true);
          //phone home if this is first binding
          phoneHome(socket);
         }); 
       }
    });

    // ------ test with dummy data ---------
    /*
     const dummyData = [
       {
         ipAddr: '192.168.1.32',
         staticIP: true,
         netMask: 16,
       },
       {
         ipAddr: '192.168.1.36',
         netMask: 24,
       },
       {
         ipAddr: '192.168.1.39',
         staticIP: true,
         netMask: 24,
       },
     ];
     if (Math.random() < 0.7) {
       addNewLimelight(dummyData[Math.floor(Math.random() * 3)]);
       setTimeout(() => addNewLimelight(dummyData[Math.floor(Math.random() * 3)]), 2000);
     }
    */
  };

  return { Ping_Limelights };
};

export default udpServer;
