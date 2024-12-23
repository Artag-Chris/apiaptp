"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    DATABASE_URL: (0, env_var_1.get)('DATABASE_URL').required().asString(),
    LOGINSITE: (0, env_var_1.get)('LOGINSITE').required().asString(),
    SECRETKEYAPTP: (0, env_var_1.get)('SECRETKEYAPTP').required().asString(),
    RETURNURL: (0, env_var_1.get)('RETURNURL').required().asString(),
    URLBASE: (0, env_var_1.get)('URLBASE').required().asString(),
};
