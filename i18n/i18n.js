import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { ru } from '../locales/ru';

export const i18n = new I18n({
	ru: ru
})
i18n.enableFallback = true
// i18n.locale = Localization.locale
i18n.locale = 'ru'
