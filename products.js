let productForm = document.getElementById("productForm");
let productTable = document.querySelector("#productTable tbody");

let products = JSON.parse(localStorage.getItem("products")) || [];

function renderProducts() {
  productTable.innerHTML = "";
  products.forEach(p => {
    let row = `<tr>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
    </tr>`;
    productTable.innerHTML += row;
  });
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("pname").value.trim();
  let price = parseFloat(document.getElementById("pprice").value);
  let stock = parseInt(document.getElementById("pstock").value);

  products.push({ name, price, stock });
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();

  productForm.reset();
});

renderProducts();

























/*let products = JSON.parse(localStorage.getItem("products")) || [];

function renderProducts() {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";
  products.forEach((p, index) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
      <td><button onclick="deleteProduct(${index})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

document.querySelector("#productForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.querySelector("#productName").value;
  const price = parseFloat(document.querySelector("#productPrice").value);
  const stock = parseInt(document.querySelector("#productStock").value);

  products.push({ name, price, stock });
  localStorage.setItem("products", JSON.stringify(products));
  e.target.reset();
  renderProducts();
});

renderProducts();*/