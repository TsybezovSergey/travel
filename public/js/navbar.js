document.addEventListener('click', (event) => {
  if (event.target.id === 'getModal') {
    document.getElementById('myModal').classList.toggle('hide');
  }

  if (event.target.id === 'closeModal') {
    event.preventDefault()
    document.getElementById('myModal').classList.toggle('hide');
  }
  if (event.target.id === 'registr') {
    document.getElementById('myModal').classList.toggle('hide');
    document.getElementById('myModal2').classList.toggle('hide2');
  }
  if (event.target.id === 'closeModal2') {
    document.getElementById('myModal2').classList.toggle('hide2');
  }
});
