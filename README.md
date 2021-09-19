# solid-masonry

> Manually fork from [react-masonry-css](https://github.com/paulcollett/react-masonry-css).

Create a masonry layout with css-based using Solid to handle resonsive viewport.

## Installation

```
npm i solid-masonry
```

## Usage

Try it on [Playground](https://playground.solidjs.com/?hash=-1046197716&version=1.1.3)

Codesandbox - [Demo](https://hmhnj.csb.app/) | [Editor](https://codesandbox.io/s/solid-masonry-hmhnj)

```tsx
import './masonry.css'
import { render } from 'solid-js/web'
import Masonry from 'solid-masonry'

const App = () => {
	const randomHeight = () => {
		const heightList = [150, 200, 250]
		return heightList[Math.floor(Math.random() * heightList.length)]
	}

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1
	}
	
	return (
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className="my-masonry-grid"
			columnClassName="my-masonry-grid_column"
			each={[1,2,3,4,5,6,7,8]}
		>
			{(item) => <div style={{height: randomHeight() + 'px'}}>{item}</div>}
		</Masonry>
	)
}

render(() => <App />, document.getElementById("root"));
```

And here for `masonry.css`, you need to create this manually:

```css
.my-masonry-grid {
  display: -webkit-box; /* Not needed if autoprefixing */
  display: -ms-flexbox; /* Not needed if autoprefixing */
  display: flex;
  margin-left: -10px; /* gutter size offset */
  width: auto;
}
.my-masonry-grid_column {
  padding-left: 10px; /* gutter size */
  background-clip: padding-box;
}

/* Style your items */
.my-masonry-grid_column > div { /* change div to reference your elements you put in <Masonry> */
  background: grey;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```
