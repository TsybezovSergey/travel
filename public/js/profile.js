if (document.getElementById('removePhoto')) {
  const removePhoto = async (event) => {
    const { id } = event.target.parentNode;
    const response = await fetch(`/profile/${id}/photo`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        window.location = 'http://localhost:3000/profile';
      } else {
        document.getElementById('submessagePhoto').textContent = 'Не удалось';
      }
    });
  };
  document.getElementById('removePhoto').addEventListener('click', removePhoto);
}
if (document.querySelector('button[name="comeout"]')) {
  const comeout = async (event) => {
    const { id } = event.target;
    const response = await fetch(`/travels/${id}/out`, {
      method: 'PUT',
    });
    const result = await response.json();
    if (result.status) {
      event.target.parentNode.innerHTML = `<h3>${result.message}</h3>`;
      setTimeout(() => {window.location = 'http://localhost:3000/mytravels'}, 400)
    } else {
      event.target.parentNode.innerHTML = `<h3>${result.message}</h3>`;
    }
  };
  document.querySelector('button[name="comeout"]').addEventListener('click', comeout);
}
if (document.querySelector('.btn-send')) {
  const send = async (event) => {
    const { id } = event.target;
    const ctx = event.target.previousElementSibling.value;

    const response = await fetch(`/travels/${id}/ctx`, {
      method: 'POST',
      body: JSON.stringify({ id, ctx }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const msg = await response.json();
    if (msg) {
      const elem = event.target.previousElementSibling.previousElementSibling;
      elem.insertAdjacentHTML('afterend', '<h3>Отправлено успешно</h3>');
      event.target.previousElementSibling.value = '';
      event.target.remove();
    }
  };
  for (const elem of document.querySelectorAll('.btn-send')) {
    elem.addEventListener('click', send);
  }
}
