import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	{
		ignores: [
			"node_modules/**",
			"coverage/**",
			"tmp/**",
			"**/*.d.ts",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.node,
			},
		},
		rules: {
			"prefer-const": "off",
			"no-constant-binary-expression": "off",
			"no-empty": "off",
			"no-constant-condition": ["error", { checkLoops: false }],
			"no-useless-escape": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},
	{
		files: ["tests/**/*.ts"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},
	eslintConfigPrettier,
);
