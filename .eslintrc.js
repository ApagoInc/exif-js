module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'jsdoc'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jsdoc/recommended'
	],
	parserOptions: {
		project: './tsconfig.json'
	},
	env: {
		node: true
	},
	rules: {
		'@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
		'@typescript-eslint/explicit-function-return-type': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-parameter-properties': ['off'],
		'@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
		'@typescript-eslint/await-thenable': ['warn'],
		'@typescript-eslint/semi': ['warn', 'always'],
		'@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
		'@typescript-eslint/explicit-member-accessibility': [
			'warn',
			{
				accessibility: 'explicit',
				overrides: {
					constructors: 'no-public'
				}
			}
		],

		// 'jsdoc/require-jsdoc': [
		// 	'error',
		// 	{
		// 		publicOnly: true,
		// 		require: {
		// 			ClassDeclaration: true,
		// 			ClassExpression: true,
		// 			FunctionDeclaration: false,
		// 			FunctionExpression: true,
		// 			MethodDefinition: true
		// 		}
		// 	}
		// ],
		// 'jsdoc/require-param-description': ['error'],

		// we get these for free from typescript
		'jsdoc/require-param-type': ['off'],
		'jsdoc/require-returns-type': ['off'],

		// ban types in jsdoc comments because we get them from typescript
		'jsdoc/no-types': ['warn'],

		'jsdoc/require-description-complete-sentence': ['warn'],
		'jsdoc/check-indentation': ['warn'],
		'jsdoc/require-hyphen-before-param-description': ['warn'],

		'dot-location': ['warn', 'property'],
		'dot-notation': ['warn'],
		'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
		'linebreak-style': ['warn', 'unix'],
		'no-console': ['off'],
		'no-extra-semi': ['warn'],
		'no-mixed-spaces-and-tabs': ['warn'],
		'no-trailing-spaces': ['warn'],
		'space-before-blocks': ['warn'],
		'no-shadow': ['warn'],
		'array-callback-return': ['warn'],
		'arrow-spacing': ['warn'],
		'comma-spacing': ['warn'],
		'comma-style': ['warn'],
		'default-case': ['warn'],
		'no-fallthrough': ['warn'],
		// eqeqeq: ['warn'],
		'keyword-spacing': ['warn'],
		'no-empty': ['warn'],
		'no-useless-escape': ['warn'],
		'one-var': ['warn', 'never']
	}
};
