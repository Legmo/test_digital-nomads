import React from 'react';
import styles from './App.module.scss';
import WidgetPreloader from '../WidgetPreloader/WidgetPreloader';
import { SomeConvenientWidget } from '../SomeConvenientWidget/SomeConvenientWidget';

function App() {
	return (
		<div className={styles.App}>
			<WidgetPreloader>
				<SomeConvenientWidget />
			</WidgetPreloader>
		</div>
	);
}

export default App;
