import { render } from "solid-js/web";
import Masonry from './masonry'
import './masonry.css'

const App = () => {
	const posts = [
		{
			title: "hello world",
			text: "amogus"
		},
		{
			title: "Sussy title",
			text: "Momogugus"
		}
	]
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
			each={posts}
		>
			{(item: { title: string, text: string }) => <div style={{height: randomHeight() + 'px'}}>
				<div>
					<h1>{item.title}</h1>
					<p>{item.text}</p>
				</div>
			</div>}
		</Masonry>
	)
}

render(() => <App />, document.getElementById("root"));
