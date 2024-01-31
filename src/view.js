/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state", "elements"] }] */

const createElement = (tag, classNames = []) => {
  const element = document.createElement(tag);
  element.classList.add(...classNames);
  return element;
};

const createLink = (href, target = '_blank', rel = 'noopener noreferrer', classNames = []) => {
  const link = createElement('a', classNames);
  link.href = href;
  link.target = target;
  link.rel = rel;
  return link;
};

const createButton = (text, onClick, classNames = []) => {
  const button = createElement('button', ['btn', 'btn-outline-primary', 'btn-sm', ...classNames]);
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
};

const renderPosts = (state, element, translate) => {
  const listGroup = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

  state.content.posts.forEach((post) => {
    const linkClass = state.uiState.visitedLinksIds.has(post.id) ? ['fw-normal', 'link-secondary'] : 'fw-bold';
    const a = createLink(post.link, '_blank', 'noopener noreferrer', linkClass);
    a.setAttribute('data-id', post.id);
    a.textContent = post.title;

    const button = createButton(translate('preview'), () => handlePreviewClick(post.id));

    const listGroupItem = createElement('li', [
      'list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0'
    ]);
    listGroupItem.append(a, button);
    listGroup.append(listGroupItem);
  });

  element.append(listGroup);
};

const renderFeeds = (state, element) => {
  const listGroup = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

  state.content.feeds.forEach((feed) => {
    const h3 = createElement('h3', ['h6', 'm-0']);
    h3.textContent = feed.title;

    const p = createElement('p', ['m-0', 'small', 'text-black-50']);
    p.textContent = feed.description;

    const listGroupItem = createElement('li', ['list-group-item', 'border-0', 'border-end-0']);
    listGroupItem.append(h3, p);
    listGroup.append(listGroupItem);
  });

  element.append(listGroup);
};

const makeContainer = (title, state, elements, translate) => {
  const containerMapping = {
    posts: (element) => renderPosts(state, element, translate),
    feeds: (element) => renderFeeds(state, element),
  };

  elements[title].innerHTML = '';

  const card = createElement('div', ['card', 'border-0']);
  const cardBody = createElement('div', ['card-body']);
  const cardTitle = createElement('h2', ['card-title', 'h4']);
  cardTitle.textContent = translate(title);

  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[title].append(card);
  containerMapping[title](card);
};

const handlePreviewClick = (postId) => {
  const post = state.content.posts.find(({ id }) => id === postId);
  const link = post?.link;
  if (link) {
    // Обработка нажатия на кнопку "preview"
    // ...
  }
};

const errorHandler = (elements, error, translate) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = translate(`errors.${error.replace(/ /g, '')}`);
  if (error !== 'Network Error') elements.input.classList.add('is-invalid');
  elements.btn.disabled = false;
  elements.input.disabled = false;
};

const finishHandler = (elements, state, translate) => {
  elements.feedback.textContent = '';

  makeContainer('posts', state, elements, translate);
  makeContainer('feeds', state, elements, translate);

  elements.input.focus();
  elements.form.reset();
  elements.btn.disabled = false;
  elements.input.disabled = false;

  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = translate('success');
};

const openModalWindow = (elements, state, postId) => {
  const post = state.content.posts.find(({ id }) => id === postId);
  if (post) {
    const { title, description, link } = post;
    elements.modal.title.textContent = title;
    elements.modal.body.textContent = description;
    elements.modal.btn.href = link;
  }
};

const render = (state, elements, translate) => (path, value) => {
  const renderMapping = {
    filling: () => {
      elements.feedback.classList.remove('text-danger');
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = '';
    },
    sending: () => {
      elements.btn.disabled = true;
      elements.input.disabled = true;
    },
    error: () => errorHandler(elements, state.process.error, translate),
    finished: () => finishHandler(elements, state, translate),
  };

  switch (path) {
    case 'process.state':
      renderMapping[state.process.state]();
      break;
    case 'uiState.visitedLinksIds':
    case 'content.posts':
      makeContainer('posts', state, elements, translate);
      break;
    case 'uiState.modalPostId':
      openModalWindow(elements, state, value);
      break;

    default:
      break;
  }
};

export default render;
