const form = document.getElementById("tambah-form");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault(); // biar nggak reload default

  const nama = document.getElementById("nama-input").value.trim();
  const asal = document.getElementById("asal-input").value.trim();
  const umur = document.getElementById("umur-input").value.trim();

  const newTodo = {
    id: Date.now(),
    nama,
    asal,
    umur,
  };

  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  alert("Data berhasil ditambahkan!");
  window.location.href = "index.html";
});
