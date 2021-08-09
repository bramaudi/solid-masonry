import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  JSXElement,
} from "solid-js";


type propTypes = {
  breakpointCols?: { default: number, [key: number]: number } | number;
  className: string;
  columnClassName?: string;

  children: JSXElement[];

  // Custom attributes, however it is advised against
  // using these to prevent unintended issues and future conflicts
  // ...any other attribute, will be added to the container
  columnAttrs?: { style?: object } // object, added to the columns

  // Deprecated props
  // The column property is deprecated.
  // It is an alias of the `columnAttrs` property
  column?: object
}

const DEFAULT_COLUMNS = 2;

const Masonry = (props: propTypes) => {
	const [columnCount, setColumnCount] = createSignal(0)

	// default state
	if (typeof props.breakpointCols === 'object') {
		setColumnCount(props.breakpointCols.default)
	} else {
		setColumnCount(props.breakpointCols || DEFAULT_COLUMNS)
	}

	function reCalculateColumnCount() {
    const windowWidth = window && window.innerWidth || Infinity;
    let breakpointColsObject = props.breakpointCols;

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

    if(columnCount() !== columns) {
      setColumnCount(columns)
    }
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
    const items = props.children

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
    const { column, columnAttrs = {}, columnClassName } = props;
    const childrenInColumns = itemsInColumns();
    const columnWidth = `${100 / childrenInColumns.length}%`;
    let className = columnClassName;

    if(className && typeof className !== 'string') {
      logDeprecated('The property "columnClassName" requires a string');

      // This is a deprecated default and will be removed soon.
      if(typeof className === 'undefined') {
        className = 'my-masonry-grid_column';
      }
    }

    const columnAttributes = {
      // NOTE: the column property is undocumented and considered deprecated.
      // It is an alias of the `columnAttrs` property
      ...column,
      ...columnAttrs,
      style: {
        ...columnAttrs.style,
        width: columnWidth
      },
      className
    };

    return (
      <For each={childrenInColumns}>
        {(items, i) => (
          <div {...columnAttributes}>
            {items}
          </div>
        )}
      </For>
    )
  }

  function logDeprecated(message) {
    console.error('[Masonry]', message);
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

	// Render
	const {
		// ignored
		children,
		breakpointCols,
		columnClassName,
		columnAttrs,
		column,

		// used
		className,

		...rest
	} = props;

	let classNameOutput = className;

	if(typeof className !== 'string') {
		logDeprecated('The property "className" requires a string');

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

export default Masonry;