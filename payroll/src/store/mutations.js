//客户端扩展模块
const context = weex.requireModule('context');
export default {
    BANKGIT: (state, data) => {
        state.bankCarsInfo = data
      }
}