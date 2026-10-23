async function consultarClima() {
  const city = document.getElementById("ciudad").value.trim();
  if (!city) {
    alert("Por favor, ingrese el nombre de una ciudad.");
    return;
  }
  try {
    document.getElementById("mensaje").textContent = "";
    document.getElementById("nombre-ciudad").textContent = "";
    document.getElementById("temperatura").textContent = "";
    document.getElementById("viento").textContent = "";
    const urlCoordenadas = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const respuesta = await fetch(urlCoordenadas);

    if (!respuesta.ok) {
      throw new Error(
        "Error en la solicitud de coordenadas" + respuesta.status,
      );
    }

    const datos = await respuesta.json();

    if (!datos.results) {
      document.getElementById("mensaje").textContent = "Ciudad no encontrada";
      return;
    }
    const lugar = datos.results[0];

    const name = lugar.name;
    const country = lugar.country;
    const latitude = lugar.latitude;
    const longitude = lugar.longitude;

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
    const resultadosClima = await fetch(urlClima);

    if (!resultadosClima.ok) {
      throw new Error(
        "Error en la solicitud de datos climáticos" + resultadosClima.status,
      );
    }

    const datosClima = await resultadosClima.json();
    const temperatura = datosClima.current.temperature_2m;
    const viento = datosClima.current.wind_speed_10m;

    document.getElementById("nombre-ciudad").textContent =
      "En la ciudad de " + name + ", " + country;
    document.getElementById("temperatura").textContent =
      "La temperatura es " + temperatura + " °C";
    document.getElementById("viento").textContent =
      "La velocidad del viento es de " + viento + " km/h";
  } catch (error) {
    document.getElementById("mensaje").textContent =
      "Error al obtener los datos de la ciudad, intentalo de nuevo";
  }
}

document
  .getElementById("boton-consultar")
  .addEventListener("click", consultarClima);

const inputCity = document.getElementById("ciudad");

inputCity.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    consultarClima();
  }
});
