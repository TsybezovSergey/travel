ymaps.ready(init);

function init() {
  const { geolocation } = ymaps;
  const myMap = new ymaps.Map('map', {
    center: [55, 34],
    zoom: 1,
    controls: ['routePanelControl'],
  }, {
    searchControlProvider: 'yandex#search',
  });
  var control = myMap.controls.get('routePanelControl');
  var multiRoutePromise = control.routePanel.getRouteAsync();
  control.routePanel.options.set({
    types: {
        "auto": true,
        
    }
});

  multiRoutePromise.then(function(multiRoute) {
    // Подписка на событие обновления мультимаршрута.
    multiRoute.model.events.add('requestsuccess', function() {
        // Получение ссылки на активный маршрут.
        var activeRoute = multiRoute.getActiveRoute();
        if (activeRoute) {
            // Вывод информации об активном маршруте.
            const regexObj = new RegExp(/башкортостан/gi)
            const from = activeRoute.model.multiRoute.properties.get('waypoints')[0].address
            const to = activeRoute.model.multiRoute.properties.get('waypoints')[1].address
            for (let elem of [from, to]){
              if (!elem.match(regexObj)){
                document.getElementById('myModalRegion').classList.toggle('hide');
              }
            }
            [from, to].forEach(el => el.match(regexObj))
            const coordinate = activeRoute.model.multiRoute.properties.get('waypoints')[0].coordinates.toString()
            const coordinate2 = activeRoute.model.multiRoute.properties.get('waypoints')[1].coordinates.toString() 
            document.querySelector('input[name="from"]').value = activeRoute.model.multiRoute.properties.get('waypoints')[0].address
            document.querySelector('input[name="to"]').value = activeRoute.model.multiRoute.properties.get('waypoints')[1].address
            document.querySelector('input[name="coordinate2"]').value = coordinate2
            document.querySelector('input[name="coordinate"]').value = coordinate
            document.querySelector('input[name="distance"]').value = activeRoute.properties.get("distance").text;
            document.querySelector('input[name="timeOfTravel"]').value = activeRoute.properties.get("duration").text

        }
    });
}, function (err) {
  console.log(err); 
});  
  geolocation.get({
    provider: 'browser',
    mapStateAutoApply: true,
  }).then((result) => {
    result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
    myMap.geoObjects.add(result.geoObjects);
    document.getElementById('coordinate').value = result.geoObjects.position;
  });
  


  var result = ymaps.geoQuery(ymaps.geocode('Россия, Республика Башкортостан'));
  result.then(function () {
      //  alert('Количество найденных объектов: ' + result.getLength());
       console.log(result)
       
  }, function () {
       alert('Произошла ошибка.');
  });

  ymaps.regions.load('RU', {
    lang: 'ru',
    quality: 3
  }).then(function (result) {
    var regions = result.geoObjects; // ссылка на коллекцию GeoObjectCollection
    regions.each(function (reg) {
      if (reg.properties.get('osmId') != 77677  ) {
          // Меняем цвет на красный
          reg.options.set('fillColor', '#fdfdfd')
      } else {
        
      }
  });
    myMap.geoObjects.add(regions);
    result.geoObjects.events.add('click', function (e) {
        var region = e.get('target');
        console.log(region.properties.get('name') + ' -> ' + region.properties.get('osmId'));
    });
    
  }, function () {
  });
}


document.addEventListener('click', (event) => {
  if (event.target.id === 'closeRegionAlert') {
    document.getElementById('myModalRegion').classList.toggle('hide');
  }
});
