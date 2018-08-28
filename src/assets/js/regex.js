let reg = {}

const intOrDecimal = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
reg.intOrDecimal = intOrDecimal

// 正负数
const pnnumber = /^-?[0-9]+\.{0,1}[0-9]{0,2}$/
reg.pnNumber = pnnumber

// 正整数
const pInteger = /^\d+$/
reg.pInteger = pInteger

export default reg
