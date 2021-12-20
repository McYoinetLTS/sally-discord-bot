const colors = require('./colors');

module.exports = {
    info: colors.darkGray('[') + colors.whiteBlue('INFO') + colors.darkGray(']'),
    error: colors.darkGray('[') + colors.red('ERROR') + colors.darkGray(']'),
    warning: colors.darkGray('[') + colors.gold('WARNING') + colors.darkGray(']')
};