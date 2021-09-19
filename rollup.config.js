import withRollup from 'rollup-preset-solid'
import ts from 'rollup-plugin-ts'

export default withRollup ({
	input: "src/masonry.tsx",
	plugins: [ts()]
});