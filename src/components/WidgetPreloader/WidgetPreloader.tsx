import React, { FC, useEffect, useState } from 'react';
import preloader from '../../assets/preloader.svg';
import { useTranslation } from 'react-i18next';
import { statusMessages } from './messagesList';
import styles from './WidgetPreloader.module.css';

type PropsType = {
	children: React.ReactNode;
};

//Messages
const messagesLength = statusMessages.length;
enum MessagesIndex {
	lastStep = messagesLength - 3, //Last message index. Without «Error» & «Success» messages
	error = messagesLength - 2, //«Error» message index.
	success = messagesLength - 1, //«Success» message index.
}

//Timers
//If waitingAll > downloadWidget — download will be successful.
enum Time {
	downloadWidget = 3000, //How long will the download take.
	waitingAll = 4500, // How long to wait for loading before an error is displayed.
	waitingPart = Time.waitingAll / (MessagesIndex.lastStep + 1), //How long each download status message will be displayed.
}

const WidgetPreloader: FC<PropsType> = ({ children }) => {
	const [messageIndex, setMessageIndex] = useState(0);
	const [state, setState] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const { t } = useTranslation();

	//Get widget. Display result message (success/error).
	useEffect(() => {
		let waitingTimerId: ReturnType<typeof setTimeout>;
		let getWidgetTimerId: ReturnType<typeof setTimeout>;

		const getWidget = async () => {
			await new Promise<void | string>((resolve, reject) => {
				//Start widget download
				getWidgetTimerId = setTimeout(() => {
					resolve();
				}, Time.downloadWidget);

				//Start widget waiting
				waitingTimerId = setTimeout(() => {
					clearTimeout(getWidgetTimerId);
					reject(new Error(t('Error.WidgetErrorConsole')));
				}, Time.waitingAll);
			});
			//If the widget loaded successfully
			setMessageIndex(MessagesIndex.success);
			setState('success');
			clearTimeout(waitingTimerId);
		};
		getWidget().catch((err) => {
			//If the widget is not loaded (error)
			setState('error');
			setMessageIndex(MessagesIndex.error);
			console.error(err);
		});

		return () => {
			//Timers cleaning — if we unmount the component before the end of loading/waiting.
			clearTimeout(getWidgetTimerId);
			clearTimeout(waitingTimerId);
		};
	}, []);

	//Display loading steps messages during waiting.
	useEffect(() => {
		if (state === 'loading' && messageIndex < MessagesIndex.lastStep) {
			const id = setInterval(() => {
				setMessageIndex((messageIndex) => messageIndex + 1);
			}, Time.waitingPart);
			return () => clearInterval(id);
		}
	}, [state, messageIndex]);

	if (state === 'loading')
		return (
			<>
				<img src={preloader} className={styles.Preloader} alt="Preloader" />
				<div>
					<p>{t(statusMessages[messageIndex])}</p>
				</div>
			</>
		);

	if (state === 'success')
		return (
			<>
				{children}
				<p>{t(statusMessages[MessagesIndex.success])}</p>
			</>
		);
	else
		return (
			<div>
				<p>{t(statusMessages[MessagesIndex.error])}</p>
			</div>
		);
};

export default WidgetPreloader;
