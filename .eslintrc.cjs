module.exports = {
    env: {
        node: true,
        es2022: true,
        jest: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        'import',
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    settings: {
        'import/resolver': {
            typescript: true
        }
    },
    rules: {
        'import/no-unresolved': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' }
        ]
    }
};
