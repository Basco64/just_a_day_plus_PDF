const DayMonthYear = document.getElementById("date");
const client = document.getElementById("client");
const hairstyle = document.getElementById("hairstyle");
const amount = document.getElementById("amount");
const radio = document.getElementsByName("payment");
const validationButton = document.getElementById("validationButton");
const editButton = document.getElementById("editButton");
const footer = document.querySelector("#entries tfoot");

const listInStorage = localStorage.getItem("list");
let list = [];
const infoFooterPDF = [];
let goodIndex;
let localeDate = new Date().toLocaleDateString("fr");

DayMonthYear.innerHTML = localeDate;
DayMonthYear.style.fontWeight = "bold";
DayMonthYear.style.marginTop = "1em";

if (listInStorage) {
  list = JSON.parse(listInStorage);
}

let id = list.length;
refresh();

function refresh() {
  updateList();
  updateFooter();
  setTimeout(() => {
    client.value = "";
    hairstyle.value = "";
    amount.value = "";
  }, 100);
}

function validation() {
  if (client.value != "" && hairstyle.value != "" && amount.value != "") {
    thePush();
    refresh();
  }
}

function thePush() {
  let payment;
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      payment = radio[i].value;
    }
  }
  const operation = {
    id,
    client: client.value,
    hairstyle: hairstyle.value,
    amount: parseFloat(amount.value),
    payment,
  };

  list.push(operation);
  id++;
  localStorage.setItem("list", JSON.stringify(list));
}

function updateList() {
  const entries = document.querySelector("#entries tbody");

  let line = "";
  if (list.length == 0) {
    line += `<tr>
              <td> --- </td>
              <td> --- </td>
              <td> --- </td>
              <td> --- </td>
              <td> <button  class="btn btn-warning" disabled>Modifier</button></td>
              <td> <button  class="btn btn-danger" disabled>Supprimer</button></td>
            </tr>`;

    entries.innerHTML = line;
  } else {
    for (const element of list) {
      line += `<tr>
                  <td> ${element.client} </td>
                  <td> ${element.hairstyle} </td>
                  <td> ${element.amount} </td>
                  <td> ${element.payment}</td>
                  <td> <button onclick=edit(${element.id}) class="btn btn-warning">Modifier</button></td>
                  <td> <button onclick=del(${element.id}) class="btn btn-danger">Supprimer</button></td>
              </tr>`;
    }
    entries.innerHTML = line;
  }
}

function updateFooter() {
  let totals = "";

  let nbCB = 0;
  let amountCB = 0;
  let nbCheque = 0;
  let amountCheque = 0;
  let nbEspece = 0;
  let amountEspece = 0;

  for (const element of list) {
    switch (element.payment) {
      case "CB":
        nbCB += 1;
        amountCB += parseFloat(element.amount);
        break;
      case "cheque":
        nbCheque += 1;
        amountCheque += parseFloat(element.amount);
        break;
      case "espece":
        nbEspece += 1;
        amountEspece += parseFloat(element.amount);
        break;
      default:
        alert("Erreur dans la matrice");
    }
  }

  totals += `<tr class="table-group-divider">
                  <td> ${nbCB} regl. CB  </td>
                  <td> ${amountCB} € </td>           
                  <td> ${nbCheque} regl. cheque </td>
                  <td> ${amountCheque} € </td>
                  <td> ${nbEspece} regl. espece </td>
                  <td> ${amountEspece} € </td>    
              </tr>`;

  footer.innerHTML = totals;

  infoFooterPDF.splice(0, infoFooterPDF.length);
  infoFooterPDF.push(
    nbCB,
    amountCB,
    nbCheque,
    amountCheque,
    nbEspece,
    amountEspece
  );
}

function indexToChange(id) {
  for (const element of list) {
    if (id == element.id) {
      return list.indexOf(element);
    }
  }
}

function edit(id) {
  goodIndex = indexToChange(id);
  let newPayment;
  client.value = list[goodIndex].client;
  hairstyle.value = list[goodIndex].hairstyle;
  amount.value = list[goodIndex].amount;
  validationButton.className = "d-none";
  editButton.className = "btn btn-success";

  editButton.addEventListener("click", function (e) {
    e.preventDefault();
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        newPayment = radio[i].value;
      }
    }
    let newEdition = {
      id: list[goodIndex].id,
      client: client.value,
      hairstyle: hairstyle.value,
      amount: parseFloat(amount.value),
      payment: newPayment,
    };
    list[goodIndex] = newEdition;

    validationButton.className = "btn btn-success";
    editButton.className = "d-none";
    refresh();
    localStorage.setItem("list", JSON.stringify(list));
  });
}

function del(id) {
  if (confirm("Voulez-vous vraiment supprimer cette ligne? ")) {
    let goodIndex = indexToChange(id);
    list.splice(goodIndex, 1);
    refresh();
    localStorage.setItem("list", JSON.stringify(list));
    alert("Suppression effectuée");
  } else {
    alert("Suppression annulée");
  }
}

function finishTheDay() {
  if (confirm("Journée terminée?")) {
    const pdf = new jsPDF();
    const infoHeader = [["Client", "", "Coiffure", "", "Montant", "Paiement"]];
    const infoBody = [];
    const infoFoot = [
      [
        `${infoFooterPDF[0]} CB`,
        `${infoFooterPDF[1]} Euro${infoFooterPDF[1] > 1 ? "s" : ""}`,
        `${infoFooterPDF[2]} Cheque${infoFooterPDF[2] > 1 ? "s" : ""}`,
        `${infoFooterPDF[3]} Euro${infoFooterPDF[3] > 1 ? "s" : ""}`,
        `${infoFooterPDF[4]} Espece${infoFooterPDF[4] > 1 ? "s" : ""}`,
        `${infoFooterPDF[5]} Euro${infoFooterPDF[5] > 1 ? "s" : ""}`,
      ],
    ];
    const totals = `Total de la journée : ${
      parseFloat(infoFooterPDF[1]) +
      parseFloat(infoFooterPDF[3]) +
      parseFloat(infoFooterPDF[5])
    } euros`;

    list.forEach((el, i, ar) => {
      infoBody.push([el.client, "", el.hairstyle, "", el.amount, el.payment]);
    });

    pdf.setFont("times", "bold");
    pdf.setFontSize(30);
    pdf.text(localeDate, 15, 10);

    pdf.autoTable({
      // html:"#entries"
      head: infoHeader,
      body: infoBody,
      foot: infoFoot,
    });

    pdf.text(totals, 95, 250, null, null, "center");

    pdf.save(`${localeDate}.pdf`);

    localStorage.clear();
    list = [];
    refresh();
  } else {
    alert("A plus tard");
  }
}
