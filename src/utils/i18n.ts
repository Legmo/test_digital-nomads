import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationsFromServer } from './translationsFromServer';

type availableLang = 'ru' | 'en';
type Translations = {
	[translation: string]: {
		[str: string]: string;
	};
};
type Locales = {
	[str in availableLang]: Translations;
};

const DEFAULT_LANGUAGE: availableLang = 'ru';

//Local translation strings (before getting from server).
const localesEn: Translations = {
	translation: {
		'Error.WidgetErrorConsole':
			'Something went wrong while loading the widget...',
	},
};
const localesRu: Translations = {
	translation: {
		'Error.WidgetErrorConsole': 'При загрузке виджета что-то пошло не так...',
	},
};
const locales: Locales = {
	ru: localesRu,
	en: localesEn,
};

//Adding translation strings from server.
locales[DEFAULT_LANGUAGE] = {
	translation: {
		...locales[DEFAULT_LANGUAGE].translation,
		...translationsFromServer,
	},
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		// lng = language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
		// you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
		// if you're using a language detector, do not define the lng option
		lng: DEFAULT_LANGUAGE,
		resources: { ...locales },
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
