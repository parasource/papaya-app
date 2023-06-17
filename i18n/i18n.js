import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { ru } from '../locales/ru';
import { en } from '../locales/en';

export const i18n = new I18n({
	ru: ru,
	en: en
})
i18n.enableFallback = true
i18n.locale = Localization.locale
