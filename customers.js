let customers = JSON.parse(localStorage.getItem("customers")) || [];

function renderCustomers() {
  const tbody = document.querySelector("#customerTable tbody");
  tbody.innerHTML = "";
  customers.forEach((c, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td><button onclick="deleteCustomer(${index})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteCustomer(index) {
  customers.splice(index, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
  renderCustomers();
}

document.querySelector("#customerForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.querySelector("#customerName").value;
  const phone = document.querySelector("#customerPhone").value;

  customers.push({ name, phone });
  localStorage.setItem("customers", JSON.stringify(customers));
  e.target.reset();
  renderCustomers();
});

renderCustomers();
