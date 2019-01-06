import _ from "lodash";
export const isValid = val => !_.isUndefined(val) && !_.isNull(val);
