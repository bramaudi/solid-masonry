import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Component,
  JSXElement
} from "solid-js";

interface Props {
    breakpointCols?: { default: number, [key: number]: number } | number
		className: string;
		columnClassName?: string;
    each: readonly unknown[]
		children: (item: JSXElement, index?: number) => JSXElement
		// Custom attributes, however it is advised against
		// using these to prevent unintended issues and future conflicts
		// ...any other attribute, will be added to the container
		columnAttrs?: { style?: object } // object, added to the columns
}

const DEFAULT_COLUMNS = 2

const Masonry = ({
	breakpointCols,
	className,
	columnClassName,
  each,
	children,
	columnAttrs,
	...rest
} : Props) => {
	const [columnCount, setColumnCount] = createSignal(0)

	typeof breakpointCols == 'object'
		? setColumnCount(breakpointCols.default)
		: setColumnCount(breakpointCols || DEFAULT_COLUMNS)

	function reCalculateColumnCount() {
		const windowWidth = window && window.innerWidth || Infinity;
		let breakpointColsObject = breakpointCols;

		// Allow passing a single number to `breakpointCols` instead of an object
		if(typeof breakpointColsObject !== 'object') {
			breakpointColsObject = {
				default: breakpointColsObject || DEFAULT_COLUMNS
			}
		}

		let matchedBreakpoint = Infinity;
		let columns = breakpointColsObject.default || DEFAULT_COLUMNS;

		for(let breakpoint in breakpointColsObject) {
			const optBreakpoint = parseInt(breakpoint);
			const isCurrentBreakpoint = optBreakpoint > 0 && windowWidth <= optBreakpoint;

			if(isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
				matchedBreakpoint = optBreakpoint;
				columns = breakpointColsObject[breakpoint];
			}
		}

		columns = Math.max(1, columns || 1);

		if(columnCount() !== columns) setColumnCount(columns)
	}

	function reCalculateColumnCountDebounce() {
		if(!window || !window.requestAnimationFrame) {  // IE10+
			reCalculateColumnCount();
			return;
		}

		if(window.cancelAnimationFrame) { // IE10+
			window.cancelAnimationFrame(this._lastRecalculateAnimationFrame);
		}

		this._lastRecalculateAnimationFrame = window.requestAnimationFrame(() => {
			reCalculateColumnCount();
		});
	}

	function itemsInColumns() {
		const currentColumnCount = columnCount();
		const itemsInColumns = new Array(currentColumnCount);

		// Force children to be handled as an array
		// const items = React.Children.toArray(props.children)
		const items = each.map(children)

		for (let i = 0; i < items.length; i++) {
			const columnIndex = i % currentColumnCount;

			if(!itemsInColumns[columnIndex]) {
				itemsInColumns[columnIndex] = [];
			}

			itemsInColumns[columnIndex].push(items[i]);
		}

		return itemsInColumns;
	}

	function renderColumns() {
		const childrenInColumns = itemsInColumns()
		const columnWidth = `${100 / childrenInColumns.length}%`
		let className = columnClassName;

		if(className && typeof className !== 'string') {
			console.error('[Masonry]', 'The property "columnClassName" requires a string')

			// This is a deprecated default and will be removed soon.
			if (typeof className === 'undefined') {
				className = 'my-masonry-grid_column'
			}
		}

		const columnAttributes = {
			...columnAttrs,
			style: {
				...columnAttrs?.style,
				width: columnWidth
			},
			className
		};
    
		return (
      <For each={childrenInColumns}>
        {item => <div {...columnAttributes}>{item}</div>}
      </For>
    )
	}

	onMount(() => {
		reCalculateColumnCount()

		// window may not be available in some environments
    if(window) {
      window.addEventListener('resize', reCalculateColumnCountDebounce);
    }
	})

	createEffect(() => {
		reCalculateColumnCount()	
	})

  onCleanup(() => {
    if(window) {
      window.removeEventListener('resize', reCalculateColumnCountDebounce);
    }
  })

	let classNameOutput = className;
	if(typeof className !== 'string') {
		console.error('The property "className" requires a string');

		// This is a deprecated default and will be removed soon.
		if(typeof className === 'undefined') {
			classNameOutput = 'my-masonry-grid';
		}
	}

	return (
		<div {...rest} className={classNameOutput}>
			{renderColumns()}
		</div>
	);
}

export default Masonry