# Papaya App

Мобильное приложение (iOS-first) для подбора образов/гардероба: лента «луков», статьи, поиск, избранное, гардероб. Бэкенд — REST API (axios), деплой-домен papaya.sozvuchno.ru (бывший papaya.pw, домен сменён в июне 2026), диплинки `papaya://` и `https://papaya.sozvuchno.ru/looks|topics|article/...`.

## Стек (после апгрейда, июнь 2026)

- **Expo SDK 54** (expo ~54.0.0), React Native 0.81.5, React 19.1.0
  - SDK 54 выбран сознательно: App Store-версия Expo Go поддерживает только SDK 54 (Expo Go для SDK 55/56 — только TestFlight/eas go). Проект изначально был на SDK 46, был поднят до 56, затем откачен до 54.
- Навигация: @react-navigation v7 (native-stack + bottom-tabs)
- Состояние: redux 4 + redux-thunk 2 + react-redux 9 (классический `createStore` в `src/redux/store.js`)
- UI: @rneui/themed (бывший react-native-elements), кастомные шрифты Gilroy + SF Compact (`src/hooks/useFont.js`)
- Анимации: reanimated 4 + react-native-worklets (babel-плагин `react-native-worklets/plugin` в `babel.config.js` — НЕ `react-native-reanimated/plugin`)
- SVG как компоненты: react-native-svg-transformer (настроен в `metro.config.js` через `expo/metro-config`)
- Локализация: i18n-js + expo-localization (`i18n/i18n.js`, локали в `locales/*.js`), язык берётся из `getLocales()[0].languageTag`
- `.npmrc` с `legacy-peer-deps=true` — обязателен, без него npm i падает на peer-конфликтах

## Структура

- `App.js` — вход: шрифты, splash (expo-splash-screen), пуши (expo-notifications, только iOS), глобальный обработчик ошибок шлёт логи на бэкенд через `authAPI.sendLogs`
- `src/components/AppContainer.js` — корневая навигация (стек Share), диплинки, bottom sheet, экраны логина (Apple/Google) и выбора пола при первом запуске
- `src/pages/` — экраны; `src/components/` — Feed/Search/Wardrobe/UI и пр.
- `src/redux/` — auth-, looks-, wardrobe-, search-reducer
- `src/api/api.js` — axios + axios-auth-refresh, токены в expo-secure-store

## Что изменилось при апгрейде SDK 46 → 54 (история)

- Удалены мёртвые пакеты: expo-app-loading (заменён expo-splash-screen), expo-firebase-analytics и expo-firebase-core (**аналитика вырезана** из AppContainer.js и LookPage.js — вызовы `Analytics.logEvent` удалены; при желании вернуть — через @react-native-firebase/analytics), expo-permissions, expo-random, expo-video-player (не использовался), react-native-elements (→ @rneui/themed), react-navigation-shared-element + react-native-shared-element (**shared-element переходы заменены обычным native-stack**, анимация «перелёта» карточки из FeedCard потеряна)
- `metro.config.js` переписан на `expo/metro-config`
- В `app.json`: убраны `useNextNotificationsApi`, `packagerOpts`, `locales` (ссылался на несуществующий locales/ru.json); `ios.deploymentTarget` поднят до 16.4 (для SDK 54 минимум 15.1)
- expo-notifications: `removeNotificationSubscription` → `subscription.remove()`, в handler добавлены `shouldShowBanner/shouldShowList`
- `react-native-dropdownalert` зафиксирован на 4.5.1 — его требует react-native-internet-connection-alert (сам в коде не используется)
- GoogleService-Info.plist и firebase-конфиг в app.json (web) оставлены, но не используются

## Команды

```bash
npm i               # .npmrc уже включает legacy-peer-deps
ulimit -n 65536     # обязательно, если не установлен watchman (EMFILE: too many open files)
npx expo start -c   # -c сбрасывает кэш Metro
```

Запуск на телефоне: Expo Go из App Store (поддерживает ровно SDK 54), телефон и Mac в одной Wi-Fi.

## Известные грабли

- **НЕ устанавливать npm-пакеты из Cowork/сэндбокса в эту папку**: синхронизация смонтированной папки портит node_modules (случайные «Unable to resolve …» из-за пропавших файлов). Установка — только локально на Mac; из сессии Cowork — только правки кода. Обратное тоже верно: на время локального `npm i` закрывать сессию Cowork, иначе синхронизация конкурирует с npm и точно так же портит node_modules.
- Версии react, react-native, netinfo, react-native-svg и react-native-worklets в package.json запинены точно (без `^`/`~`) — каретки уже приводили к дрейфу (react уезжал на 19.2.x и ломал бандлинг). Новые версии — только осознанно, сверяясь с ожиданиями SDK 54 (`npx expo install --fix`).
- Если «Unable to resolve <модуль>»: `rm -rf node_modules && npm i && npx expo start -c`; проверить, что Metro не висит старым процессом (`pkill -f expo`).
- brew/ghcr.io у владельца блокируется провайдером — watchman ставить через VPN, иначе использовать `ulimit -n 65536` в каждой сессии терминала.
- `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` уже выполнен (Expo не видел Xcode из-за Command Line Tools).
- Нативная сборка (`expo run:ios`) после апгрейда не проверялась — проверен только JS-бандл (`expo export`). Для сборки под Xcode 26.5 возможны доработки.
- Runtime по экранам протестирован не полностью: непроверенные кандидаты на проблемы — reanimated-carousel v4 (API изменился с v3 в ArticlesCarousel.js), @rneui Image/Switch, react-native-render-html на React 19.
