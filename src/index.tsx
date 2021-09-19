import { render } from "solid-js/web";
import Masonry from './masonry'
import './masonry.css'

const App = () => {
	const data = [1,2,3,4,5,6,7,8]
	const randomHeight = () => {
		const heightList = [150, 200, 250]
		return heightList[Math.floor(Math.random() * heightList.length)]
	}
	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1
	};
	
	return (
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className="my-masonry-grid"
			columnClassName="my-masonry-grid_column"
			each={data}
		>
			{(item) => <div style={{height: randomHeight() + 'px'}}>Item: {item}</div>}
		</Masonry>
	)
}

render(() => <App />, document.getElementById("root"));
