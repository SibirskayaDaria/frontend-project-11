import * as yup from 'yup';

const validationSchema = yup.object().shape({
    feedUrl: yup.string().trim().url().required(),
});

// Import our custom CSS
import './styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', function () {
    const rssForm = document.getElementById('rssForm');
    const feedUrlInput = document.getElementById('feedUrl');
    const errorMessage = document.getElementById('error-message');
    const feedList = document.getElementById('feedList');

    rssForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Валидация с использованием yup
        try {
            await validationSchema.validate({ feedUrl: feedUrlInput.value });
        } catch (error) {
            errorMessage.textContent = error.message;
            feedUrlInput.classList.add('invalid');
            return;
        }

        // Очистка предыдущих сообщений об ошибках
        errorMessage.textContent = '';

        const feedUrl = feedUrlInput.value.trim();

        // Check for duplicates
        if (isDuplicate(feedUrl)) {
            errorMessage.textContent = 'This feed is already in the list.';
            feedUrlInput.classList.add('invalid');
            return;
        }

        // Add feed to the list
        addFeedToList(feedUrl);

        // Reset form
        rssForm.reset();
        feedUrlInput.focus();
        feedUrlInput.classList.remove('invalid');
    });

    function isDuplicate(url) {
        // Check if the URL is already in the list
        return Array.from(feedList.children).some(feed => feed.dataset.url === url);
    }

    function addFeedToList(url) {
        const listItem = document.createElement('li');
        listItem.textContent = url;
        listItem.dataset.url = url;
        feedList.appendChild(listItem);
    }
});
