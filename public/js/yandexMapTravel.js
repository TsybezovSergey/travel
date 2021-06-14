function init() {
  const coordinate = document
    .querySelector('li[name="coordinate"]')
    .id.split(",")
    .reverse();
  const coordinate2 = document
    .querySelector('li[name="coordinate2"]')
    .id.split(",")
    .reverse();
  const to = coordinate.map((el) => Number(el));
  const from = coordinate2.map((el) => Number(el));
  const multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      referencePoints: [to, from],

      params: {
        results: 1,
      },
    },
    {
      boundsAutoApply: true,
    }
  );

  const myMap = new ymaps.Map(
    "map",
    {
      center: [55.750625, 37.626],
      zoom: 7,
      controls: [],
    },
    {
      searchControlProvider: "yandex#search",
    }
  );

  myMap.geoObjects.add(multiRoute);

  if (document.getElementById("cancelTravel")) {
    const cancelTavel = async (event) => {
      const id = document.getElementById("cancelTravel").name;
      event.preventDefault();
      const response = await fetch(`/travels/${id}/`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status) {
        document.querySelector(
          ".profile-container"
        ).innerHTML = `<h1>${result.status}</h1>`;
        document.querySelector(".map-wrapper").remove();
      }
      console.log(result.status);
      console.log(event.target.name);
    };

    document
      .getElementById("cancelTravel")
      .addEventListener("click", cancelTavel);
  }
  if (document.getElementById("redactTravel")) {
    const redact = async (event) => {
      event.preventDefault();
      myMap.geoObjects.remove(multiRoute);
      await myMap.controls.add("routePanelControl");
      var routePanel = myMap.controls.get("routePanelControl").routePanel;
      routePanel.options.set({
        types: {
          auto: true,
        },
      });
      var multiRoutePromise = routePanel.getRouteAsync();

      multiRoutePromise.then(
        function (multiRoute) {
          multiRoute.model.events.add("requestsuccess", function () {
            var activeRoute = multiRoute.getActiveRoute();
            if (activeRoute) {
              const regexObj = new RegExp(/башкортостан/gi);
              const from =
                activeRoute.model.multiRoute.properties.get("waypoints")[0]
                  .address;
              const to =
                activeRoute.model.multiRoute.properties.get("waypoints")[1]
                  .address;
              console.log(from, to);
              for (let elem of [from, to]) {
                if (!elem.match(regexObj)) {
                  document
                    .getElementById("myModalRegion")
                    .classList.toggle("hide");
                }
              }
              [from, to].forEach((el) => el.match(regexObj));
              const coordinate = activeRoute.model.multiRoute.properties
                .get("waypoints")[0]
                .coordinates.toString();
              const coordinate2 = activeRoute.model.multiRoute.properties
                .get("waypoints")[1]
                .coordinates.toString();
              document.querySelector('input[name="from"]').value =
                activeRoute.model.multiRoute.properties.get(
                  "waypoints"
                )[0].address;
              document.querySelector('input[name="to"]').value =
                activeRoute.model.multiRoute.properties.get(
                  "waypoints"
                )[1].address;

              document.querySelector('input[name="coordinate2"]').value =
                coordinate2;
              document.querySelector('input[name="coordinate"]').value =
                coordinate;
              document.querySelector('input[name="distance"]').value =
                activeRoute.properties.get("distance").text;
              document.querySelector('input[name="timeOfTravel"]').value =
                activeRoute.properties.get("duration").text;
            }
          });
        },
        function (err) {
          console.log(err);
        }
      );
      document
        .querySelector('input[name="travelname"]')
        .classList.remove("disable");
      document.querySelector('input[name="date"]').classList.remove("disable");
      document.querySelector('input[name="count"]').classList.remove("disable");
      document.querySelector('input[name="from"]').value = "";
      document.querySelector('input[name="to"]').value = "";
      document.querySelector('input[name="coordinate"]').value = "";
      document.querySelector('input[name="coordinate2"]').value = "";
      document.querySelector('input[name="distance"]').value = "";
      document.querySelector('input[name="timeOfTravel"]').value = "";
      event.target.style.display = "none";
      event.target.parentNode.innerHTML +=
        '<button type="submit" class="btn">Сохранить</button>';
    };
    document.getElementById("redactTravel").addEventListener("click", redact);
  }
}

document.addEventListener("click", (event) => {
  if (event.target.id === "closeRegionAlert") {
    document.getElementById("myModalRegion").classList.toggle("hide");
  }
});

ymaps.ready(init);
