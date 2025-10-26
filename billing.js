let products = JSON.parse(localStorage.getItem("products")) || [];
let invoiceItems = [];

const productSelect = document.getElementById("productSelect");
const billTable = document.querySelector("#billTable tbody");

function loadProducts() {
  productSelect.innerHTML = "";
  if (products.length === 0) {
    productSelect.innerHTML = "<option disabled>No products available</option>";
  } else {
    products.forEach(p => {
      let opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = `${p.name} - ₹${p.price} (Stock: ${p.stock})`;
      productSelect.appendChild(opt);
    });
  }
}
loadProducts();

document.getElementById("billingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let name = productSelect.value;
  let qty = parseInt(document.getElementById("qty").value);
  let product = products.find(p => p.name === name);

  if (!product) return alert("Product not found!");
  if (qty > product.stock) return alert("Not enough stock!");

  let total = product.price * qty;
  invoiceItems.push({ name, price: product.price, qty, total });
  product.stock -= qty; // update stock

  localStorage.setItem("products", JSON.stringify(products));
  renderBill();
  loadProducts();
  e.target.reset();
});

function renderBill() {
  billTable.innerHTML = "";
  invoiceItems.forEach(i => {
    billTable.innerHTML += `<tr>
      <td>${i.name}</td>
      <td>${i.price}</td>
      <td>${i.qty}</td>
      <td>${i.total}</td>
    </tr>`;
  });
}

document.getElementById("generateInvoice").addEventListener("click", () => {
  let subtotal = invoiceItems.reduce((sum, i) => sum + i.total, 0);
  let discount = parseFloat(document.getElementById("discount").value) || 0;
  let tax = parseFloat(document.getElementById("tax").value) || 0;

  let discountAmt = (subtotal * discount) / 100;
  let taxAmt = ((subtotal - discountAmt) * tax) / 100;
  let grandTotal = subtotal - discountAmt + taxAmt;

  let details = `
    <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
    <p><strong>Discount (${discount}%):</strong> ₹${discountAmt.toFixed(2)}</p>
    <p><strong>Tax (${tax}%):</strong> ₹${taxAmt.toFixed(2)}</p>
    <h3>Total: ₹${grandTotal.toFixed(2)}</h3>
  `;
  document.getElementById("invoiceDetails").innerHTML = details;
  document.getElementById("invoiceSection").style.display = "block";

  JsBarcode("#barcode", "INV-" + Date.now(), {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });
});
