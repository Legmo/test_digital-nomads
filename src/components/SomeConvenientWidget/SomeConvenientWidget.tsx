import React, { FC } from 'react';
import cat from '../../assets/cat.svg';
import styles from './SomeConvenientWidget.module.css';

export const SomeConvenientWidget: FC = () => {
	return (
		<div className={styles.WidgetImg}>
			<img src={cat} alt="Cat" />
		</div>
	);
};
