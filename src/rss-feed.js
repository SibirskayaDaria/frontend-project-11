import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import ru from './ru.js';

const app = () => {
    const i18nInstance = i18next.createInstance();
    // Инициализация
    i18nInstance.init({
        lng: 'ru',
        debug: false,
        resources: {
            ru,
        },
    }).then((translate) => {
        const elements = {
            form: document.querySelector('.rss-form'),
            feedback: document.querySelector('.feedback'),
            input: document.querySelector('#url-input'),
            btn: document.querySelector('button[type="submit"]'),
            posts: document.querySelector('.posts'),
            feeds: document.querySelector('.feeds'),
            modal: {
                modalElement: document.querySelector('.modal'),
                title: document.querySelector('.modal-title'),
                body: document.querySelector('.modal-body'),
                btn: document.querySelector('.full-article'),
            },
        };

        // Установка локали для yup
        yup.setLocale({
            mixed: { notOneOf: translate('errors.alreadyAddedRSS') },
            string: { url: translate('errors.invalidUrl'), required: translate('errors.mustNotBeEmpty') },
        });
    });
};
export default app;