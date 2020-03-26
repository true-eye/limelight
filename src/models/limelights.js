import * as limelightService from '../services/limelights';

export default {
  namespace: 'limelights',

  state: {
    items: [],
    log: '',
  },

  effects: {
    *findLimelights({}, { call, put }) {
      yield put({ type: 'setLimelights', limeLights: [] });
      yield call(limelightService.findLimelights);
    },
    *restartLimelight({ ipAddr }, { call }) {
      yield call(limelightService.restartLimelight, ipAddr);
    },
    *editLimelight({ ipAddr }, { call }) {
      yield call(limelightService.editLimelight, ipAddr);
    },
  },

  reducers: {
    setLimelights(state, { limeLights }) {
      return { ...state, items: limeLights };
    },
    newLimelight(state, { limeLight }) {
      const items = state.items.slice(0);
      items.unshift(limeLight);
      return { ...state, items };
    },
    appendLog(state, { msg }) {
      const { log } = state;
      return { ...state, log: log + msg + '\r\n' };
    },
    clearLog(state, { msg }) {
      const { log } = state;
      return { ...state, log: '' };
    }
  },
};
