function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

function upload(selecetor, options) {
  let file = '';
  const unUpload = options.onUpload ?? null;
  const input = document.getElementById('input-file');
  const preview = document.createElement('div');

  preview.classList.add('preview');

  const uploader = document.getElementById('upload');

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','));
  }
  input.insertAdjacentElement('afterend', preview);
  const triggerInput = () => input.click();
  uploader.addEventListener('click', triggerInput);

  const removePreview = (event) => {
    if (event.target.classList.contains('btn-small')) {
      file = '';
      event.target.parentNode.remove();
      uploader.style.display = 'block';
    }
  };

  preview.addEventListener('click', removePreview);

  input.addEventListener('change', (event) => {
    if (!event.target.files.length) {
      return;
    }
    const files = Array.from(event.target.files);
    file = files[0];

    if (!file.type.match('image')) {
      return;
    }
    const reader = new FileReader();

    reader.onload = (ev) => {
      const fileSend = ev.target.result;
      uploader.style.display = 'none';
      preview.insertAdjacentHTML('afterbegin', `
        <div class="preview-image">
          <div class="btn-small"></div>
          <img src="${ev.target.result}" alt="${file.name}"/>
          <div class='file-info'>
          <span>${file.name}</span>
          <span>${bytesToSize(file.size)}</span>
          </div>
          <button class="btn" id="addPhoto">Применить</button>
        </div>
      `);
      document.getElementById('addPhoto').addEventListener('click', () => {
        console.log('sdsaddas');
        document.querySelector('.preview-image').innerHTML = `
        <div class='loader-block'>
          <div class='loader'></div>
          <div class="loader-item"></div>
        </div>`;
        unUpload(file);
      });
    };

    reader.readAsDataURL(file);
  });
}

window.firebase.initializeApp({
  apiKey: 'AIzaSyB-QlFruu4tQ6yLadPS6GbVK8x4t3jw0KQ',
  authDomain: 'travelapp-bcffc.firebaseapp.com',
  databaseURL: 'https://travelapp-bcffc-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'travelapp-bcffc',
  storageBucket: 'travelapp-bcffc.appspot.com',
  messagingSenderId: '80984777286',
  appId: '1:80984777286:web:8d2c9f626e97d714832047',
});

upload('#file', {
  accept: ['.png', '.jpeg', '.jpg'],
  async onUpload(file) {
    const { id } = document.getElementById('input-file').parentNode;
    const storage = window.firebase.storage();
    const ref = storage.ref(`imagesTravel/${id}/${file.name}`);

    const task = ref.put(file);
    task.on('state_changed', async (snapshot) => {

    }, (error) => {
      console.log(error);
      document.getElementById('upload').style.display = 'block';
      document.querySelector('.loader-block').remove();
    }, async () => {
      const link = await ref.getDownloadURL();
      const responseUrl = await fetch('/upload', {
        method: 'POST',
        body: JSON.stringify({ travelUrl: link, travel: true, id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await responseUrl.json();
      if (result.status) {
        document.querySelector('.block').innerHTML = `<img src='${link}'>`;
        document.querySelector('.loader-block').remove();
      } else {
        document.querySelector('.block').innerHTML = '<h3>Ошибка загрузки</h3>';
      }
    });
  },
});
