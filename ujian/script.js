document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const searchInput = document.getElementById("search");

  function getData() {
    return JSON.parse(localStorage.getItem("dataDiri")) || [];
  }

  function saveData(data) {
    localStorage.setItem("dataDiri", JSON.stringify(data));
  }

  function renderData() {
    let data = getData();
    let search = searchInput.value.toLowerCase();

    dataList.innerHTML = "";

    let filtered = data.filter(
      (item) =>
        item.nama.toLowerCase().includes(search) ||
        item.umur.toString().includes(search) ||
        item.alamat.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      dataList.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px;">Belum ada data</td></tr>`;
      return;
    }

    filtered.forEach((item, index) => {
      let row = document.createElement("tr");
      row.classList.add("fade-in");
      row.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.umur}</td>
        <td>${item.alamat}</td>
        <td>
          <button class="btn btn-edit" onclick="editData(${index})">✏️ Edit</button>
          <button class="btn btn-delete" onclick="deleteData(${index})">🗑️ Hapus</button>
        </td>
      `;
      dataList.appendChild(row);
    });
  }

  window.deleteData = (index) => {
    let data = JSON.parse(localStorage.getItem("dataDiri")) || [];

    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        data.splice(index, 1);
        localStorage.setItem("dataDiri", JSON.stringify(data));
        renderData();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

  window.editData = (index) => {
    let data = getData();
    let item = data[index];

    Swal.fire({
      title: "Edit Data",
      html: `
        <input id="edit-nama" class="swal2-input" value="${item.nama}">
        <input id="edit-umur" class="swal2-input" value="${item.umur}">
        <input id="edit-alamat" class="swal2-input" value="${item.alamat}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          nama: document.getElementById("edit-nama").value,
          umur: document.getElementById("edit-umur").value,
          alamat: document.getElementById("edit-alamat").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        data[index] = result.value;
        saveData(data);
        renderData();
        Swal.fire("Tersimpan!", "Data berhasil diperbarui", "success");
      }
    });
  };

  document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  document.getElementById("export-json").addEventListener("click", () => {
    let data = getData();
    let blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
  });

  document.getElementById("export-csv").addEventListener("click", () => {
    let data = getData();
    let csv =
      "Nama,Umur,Alamat\n" +
      data.map((d) => `${d.nama},${d.umur},${d.alamat}`).join("\n");
    let blob = new Blob([csv], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  });

  searchInput.addEventListener("input", renderData);

  window.sortTable = (n) => {
    let data = getData();
    data.sort((a, b) => {
      let valA = Object.values(a)[n].toString().toLowerCase();
      let valB = Object.values(b)[n].toString().toLowerCase();
      return valA.localeCompare(valB, "id", { numeric: true });
    });
    saveData(data);
    renderData();
  };

  renderData();
});
window.editData = (index) => {
  window.location.href = `edit.html?index=${index}`;
};

// Ambil elemen body dan tombol
const body = document.body;
const toggleBtn = document.getElementById("toggleTheme");

// Cek preferensi sebelumnya
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

// Event listener untuk toggle
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️"; // Ubah ke mode terang
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙"; // Ubah ke mode gelap
    localStorage.setItem("theme", "light");
  }
});
