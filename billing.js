let products = JSON.parse(localStorage.getItem("products")) || [];
let invoiceItems = [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

const productSelect = document.getElementById("productSelect");
const billTable = document.querySelector("#billTable tbody");

// Load products
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

// Add product to bill
document.getElementById("billingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let name = productSelect.value;
  let qty = parseInt(document.getElementById("qty").value);
  let product = products.find(p => p.name === name);

  if (!product) return alert("Product not found!");
  if (qty > product.stock) return alert("Not enough stock!");

  let total = product.price * qty;
  invoiceItems.push({ name, price: product.price, qty, total });
  product.stock -= qty;

  localStorage.setItem("products", JSON.stringify(products));
  renderBill();
  loadProducts();
  e.target.reset();
});

// Display bill items
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

// Generate invoice
document.getElementById("generateInvoice").addEventListener("click", () => {
  if (invoiceItems.length === 0) return alert("Add at least one item!");
  let custName = document.getElementById("custName").value.trim();
  let custMobile = document.getElementById("custMobile").value.trim();
  if (custName === "" || custMobile === "") return alert("Enter customer details!");

  let subtotal = invoiceItems.reduce((sum, i) => sum + i.total, 0);
  let discount = parseFloat(document.getElementById("discount").value) || 0;
  let tax = parseFloat(document.getElementById("tax").value) || 0;
  let discountAmt = (subtotal * discount) / 100;
  let taxAmt = ((subtotal - discountAmt) * tax) / 100;
  let grandTotal = subtotal - discountAmt + taxAmt;

  // Save customer info to localStorage
  let customer = {
    name: custName,
    mobile: custMobile,
    total: grandTotal.toFixed(2),
    date: new Date().toLocaleString()
  };
  customers.push(customer);
  localStorage.setItem("customers", JSON.stringify(customers));

  // Invoice display
  let details = `
    <p><strong>Customer:</strong> ${custName}</p>
    <p><strong>Mobile:</strong> ${custMobile}</p>
    <p><strong>Date:</strong> ${customer.date}</p>
    <hr>
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

  invoiceItems = [];
  renderBill();
});

// Print invoice
document.getElementById("printBtn").addEventListener("click", () => {
  let invoice = document.getElementById("invoiceSection").innerHTML;
  let original = document.body.innerHTML;
  document.body.innerHTML = invoice;
  window.print();
  document.body.innerHTML = original;
});

// Send invoice simulation (still works)
document.getElementById("sendBtn").addEventListener("click", () => {
  let phone = prompt("Enter customer's mobile number (10 digits):");
  if (!phone || phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid mobile number.");
    return;
  }

  let invoiceText = document.getElementById("invoiceDetails").innerText;
  alert(`✅ Invoice has been sent to ${phone} (simulation).\n\n${invoiceText}`);
});










/*let products = JSON.parse(localStorage.getItem("products")) || [];
let invoiceItems = [];

const productSelect = document.getElementById("productSelect");
const billTable = document.querySelector("#billTable tbody");

// 🟢 Load products from localStorage
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

// 🟢 Add item to bill
document.getElementById("billingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let name = productSelect.value;
  let qty = parseInt(document.getElementById("qty").value);
  let product = products.find(p => p.name === name);

  if (!product) return alert("Product not found!");
  if (qty > product.stock) return alert("Not enough stock!");

  let total = product.price * qty;
  invoiceItems.push({ name, price: product.price, qty, total });
  product.stock -= qty; // Update stock
  localStorage.setItem("products", JSON.stringify(products));

  renderBill();
  loadProducts();
  e.target.reset();
});

// 🟢 Display bill table
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

// 🟢 Generate invoice
document.getElementById("generateInvoice").addEventListener("click", () => {
  if (invoiceItems.length === 0) return alert("Add at least one item!");

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

  // Generate barcode
  JsBarcode("#barcode", "INV-" + Date.now(), {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });
});

// 🖨 Print invoice only
document.getElementById("printBtn").addEventListener("click", () => {
  let invoice = document.getElementById("invoiceSection").innerHTML;
  let original = document.body.innerHTML;

  document.body.innerHTML = invoice;
  window.print();
  document.body.innerHTML = original;
  // 📱 Simulate sending invoice via SMS
document.getElementById("sendBtn").addEventListener("click", () => {
  let phone = prompt("Enter customer's mobile number (10 digits):");
  if (!phone || phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid mobile number.");
    return;
  }

  // Get current invoice details
  let invoiceText = document.getElementById("invoiceDetails").innerText;
  let message = `Invoice generated successfully for your purchase.\n\n${invoiceText}\nThank you for shopping with us!`;

  // Simulate sending SMS
  alert(`✅ Invoice has been sent to ${phone} (simulation).\n\nMessage:\n${message}`);

  // Optional: log to console
  console.log("SMS sent to:", phone);
  console.log(message);
});

});*/











