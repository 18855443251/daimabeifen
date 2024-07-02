//设置标题

//???????
const context = weex.requireModule('context');
export default {
    BANKGIT: (state, data) => {
        state.bankCarsInfo = data
      }
}

export function SET_TRUE(state, { bol }) {
    state.isTrue = bol;
}

export function SET_FALSE(state, { bol }) {
    state.isTrue = bol;
}