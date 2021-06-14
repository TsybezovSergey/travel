if (document.querySelector('button[name="cancelTravel"]')) {
  const cancel = async (event) => {
    const { id } = event.target;
    const response = await fetch(`/travels/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result.status) {
      event.target.parentNode.parentNode.innerHTML = '<h3>Успешно отменено</h3>';
      document.querySelector('.message').remove();
    } else {
      event.target.parentNode.parentNode.innerHTML = '<h3>Упс... не удалось</h3>';
    }
  };
  document.querySelector('button[name="cancelTravel"]').addEventListener('click', cancel);
}
if (document.querySelector('button[name="comein"]')) {
  const comeIn = async (event) => {
    const { id } = event.target;
    event.target.parentNode.innerHTML = '<div class=\'loader-block\'><div class=\'loader\'></div><div class="loader-item"></div></div>';
    const response = await fetch(`/travels/${id}/join`, {
      method: 'GET',
    });
    const result = await response.json();
    if (result.status) {
      document.querySelector('.loader-block').parentNode.innerHTML = '<h3>Поздравляем, вы успешно присоединились к путешествию</h3>';
    } else if (result.free) {
      document.querySelector('.loader-block').parentNode.innerHTML = `<h3>${result.free}</h3>`;
      const parent = document.querySelector('.loader-block').parentNode;

    } else {
      document.querySelector('.loader-block').parentNode.innerHTML = '<h3>Произошла ошибка</h3>';
    }
  };
  document.querySelector('button[name="comein"]').addEventListener('click', comeIn);
}
