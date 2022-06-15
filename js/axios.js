/* @ Author: Daniel Felipe Marin
*Aplicación de CRUD con API falsa que almacena los datos tipos json de manera local
*archivo.js que contiene la lógica del crud en axios para comunicar con la api
*/

const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

const getAll = async () => {
try {
  let res = await axios.get("http://localhost:3000/sofkianos"),
    json = await res.data;

  console.log(json);

  json.forEach(el => {
    $template.querySelector(".name").textContent = el.nombre;
    $template.querySelector(".correo").textContent = el.correo;
    $template.querySelector(".edit").dataset.id = el.id;
    $template.querySelector(".edit").dataset.name = el.nombre;
    $template.querySelector(".edit").dataset.correo = el.correo;
    $template.querySelector(".delete").dataset.id = el.id;

    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
  });

  $table.querySelector("tbody").appendChild($fragment);
} catch (err) {
  let message = err.statusText || "Ocurrió un error";
  $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
}
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
if (e.target === $form) {
  e.preventDefault();

  if (!e.target.id.value) {
    //Create - POST
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          correo: e.target.correo.value
        })
      },
        res = await axios("http://localhost:3000/sofkianos", options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  } else {
    //Update - PUT
    try {
      let options = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          correo: e.target.correo.value
        })
      },
        res = await axios(`http://localhost:3000/sofkianos/${e.target.id.value}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  }
}
});

d.addEventListener("click", async e => {
if (e.target.matches(".edit")) {
  $title.textContent = "Editar Sofkiano";
  $form.nombre.value = e.target.dataset.name;
  $form.correo.value = e.target.dataset.correo;
  $form.id.value = e.target.dataset.id;
}

if (e.target.matches(".delete")) {
  let isDelete = confirm(`¿Estás seguro de eliminar el registro con Id:  ${e.target.dataset.id}?`);

  if (isDelete) {
    //Delete - DELETE
    try {
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        }
      },
        res = await axios(`http://localhost:3000/sofkianos/${e.target.dataset.id}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      alert(`Error ${err.status}: ${message}`);
    }
  }
}
});