const { ipcRenderer, shell } = window.require('electron');

export const findLimelights = () => {
  ipcRenderer.send('findLimelights');
};

export const restartLimelight = ipAddr => {
  ipcRenderer.send('restartLimelight', ipAddr);
};

export const editLimelight = ipAddr => {
  shell.openExternal(`http://${ipAddr}:5801`);
};
