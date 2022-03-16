module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    parserOptions: {
        parser: "@babel/eslint-parser",
        requireConfigFile: false,
        ecmaVersion: 13,
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    globals: {
        angular: true,
        M: true
    },
    extends: [
        "angular",
        "plugin:promise/recommended",
        "eslint:recommended"
    ],
    rules: {
        "angular/controller-name": 0,
        "angular/controller-as": 0,
        "angular/di": [0, "array"],
        "angular/on-watch": 0,
        "promise/always-return": 0
    }
};
