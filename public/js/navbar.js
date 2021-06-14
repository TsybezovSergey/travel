document.addEventListener('click', (event) => {
  
  // if (event.target.classList.contains('nav-link')){
  //   event.target.classList.toggle('nav-link');
  //   event.target.classList.toggle('nav-link-active');
  // }
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

// const container = document.getElementById('container')
// window.addEventListener("scroll", function(){
//   container.classList.toggle('sticky', window.scrollY>0);
// })

// const hideBar=document.getElementById('hideBar');
// const burger=document.getElementById('burger');
// const menu=document.getElementByIdAll('li');

// hideBar.addEventListener("click", function(){
//   burger.classList.toggle("burgerClick")
//   burger.classList.toggle("burgerAnim")
//   for (i=0; i<menu.length-1; i++){
//     menu[i].classList.toggle("menu_opacity")
//   }
//  document.getElementById('#hideBar').innerHTML==="Hide" ? document.getElementById('#hideBar').innerHTML="Show" :
//  document.getElementById('#hideBar').innerHTML="Hide"

//   console.log("!")
//   })

// var names = ['HTML', 'CSS', 'JavaScript'];

// var nameLengths = names.map(function(name) {
//   return name.length;
// });
