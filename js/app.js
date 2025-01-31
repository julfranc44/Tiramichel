let money = 100;
let tiramisus = 0;
let coffee = 50;
let mascarpone = 50;
let priceMascarpone = 30;
let priceCafe = 40;
let newStockMascarpone = 50;
let newStockCafe = 50;
let currentPrice = 5;
let nbRobot = 0;
let nbVendeurs = 0;
let totalTira = 0;
let seuilEvent1 = 1000;
let event1Unlocked = false;
let productionDoublee = false;
let seuilEvent2 = 10000;
let event2Unlocked = false;

// Fonction de calcul de la demande
function calculerDemande() {
  const demandeMaximale = 10;
  const prixMaximal = 20;

  if (currentPrice >= prixMaximal) {
    return 0;
  }

  // Formule pondérée : demande diminue progressivement avec le prix
  const demande = Math.max(0, Math.floor(demandeMaximale - currentPrice * 0.5));
  return demande;
}

function calculerPourcentageDemande() {
  const demandeMaximale = 10;
  const demandeActuelle = calculerDemande();
  const pourcentage = (demandeActuelle / demandeMaximale) * 100;
  return Math.round(pourcentage);
}

// Production tiramisus et composants
function produceTiramisu() {
  let errorMessage = document.getElementById("error-message");

  if (coffee > 0 && mascarpone > 0) {
    let production = productionDoublee ? 2 : 1;

    // Vérifie que le stock permet bien cette production
    let maxProduction = Math.min(production, coffee, mascarpone);

    if (maxProduction > 0) {
      tiramisus += maxProduction;
      coffee -= maxProduction;
      mascarpone -= maxProduction;
      totalTira += maxProduction;

      updateDisplay();
      errorMessage.style.display = "none";
    } else {
      errorMessage.textContent =
        "Pas assez d'ingrédients pour produire un tiramisu !";
      errorMessage.style.display = "block";
    }
  } else {
    errorMessage.textContent =
      "Impossible de produire un tiramisu : plus de café ou de mascarpone !";
    errorMessage.style.display = "block";
  }
}

function achatMascarpone() {
  let errorMessage = document.getElementById("error-message");
  if (money - priceMascarpone >= 0) {
    money -= priceMascarpone;
    mascarpone += newStockMascarpone;
    updateDisplay();
    errorMessage.style.display = "none";
  } else {
    errorMessage.textContent =
      "Impossible d'acheter du Mascarpone : Vous n'avez pas assez d'argent !";
    errorMessage.style.display = "block";
  }
}

function achatCafe() {
  let errorMessage = document.getElementById("error-message");
  if (money - priceCafe >= 0) {
    money -= priceCafe;
    coffee += newStockCafe;
    updateDisplay();
    errorMessage.style.display = "none";
  } else {
    errorMessage.textContent =
      "Impossible d'acheter du café : Vous n'avez pas assez d'argent !";
    errorMessage.style.display = "block";
  }
}

// Gestion du prix
function updatePrice() {
  let errorMessage = document.getElementById("error-message");
  const priceInput = document.getElementById("priceInput");
  const newPrice = parseInt(priceInput.value, 10);
  if (newPrice >= 1) {
    currentPrice = newPrice;
    document.getElementById("currentPrice").textContent = currentPrice;
    errorMessage.style.display = "none";
    updateDisplay();
  } else {
    errorMessage.textContent = "Impossible de mettre un prix négatif";
    errorMessage.style.display = "block";
  }
}

// Vente manuelle
function venteManuelle() {
  const demande = calculerDemande();

  const errorMessage = document.getElementById("error-message");

  if (demande === 0) {
    errorMessage.textContent =
      "Le prix est trop élevé : aucune vente possible !";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";

  if (tiramisus > 0) {
    const nbVendus = Math.min(tiramisus, demande);

    tiramisus -= nbVendus;
    money += currentPrice * nbVendus;
    updateDisplay();
  } else {
    errorMessage.textContent = "Plus de tiramisus en stock !";
    errorMessage.style.display = "block";
  }
}
// Gestion achat aides
function acheterRobot() {
  let errorMessage = document.getElementById("error-message");
  if (money >= 100) {
    nbRobot += 1;
    money -= 100;
    updateDisplay();
    errorMessage.style.display = "none";
  } else {
    errorMessage.textContent = "Impossible, vous n'avez pas assez d'argent !";
    errorMessage.style.display = "block";
  }
}

function robotProd() {
  let errorMessage = document.getElementById("error-message");

  if (coffee > 0 && mascarpone > 0 && nbRobot > 0) {
    // Efficacité de production : chaque robot produit 1.5 tiramisus au lieu de 1
    const efficaciteRobot = 1.5;
    let production = Math.floor(nbRobot * efficaciteRobot);

    // Vérifie que le stock permet bien cette production
    let maxProduction = Math.min(production, coffee, mascarpone);

    if (maxProduction > 0) {
      tiramisus += maxProduction;
      coffee -= maxProduction;
      mascarpone -= maxProduction;
      totalTira += maxProduction;

      updateDisplay();
      errorMessage.style.display = "none";

      console.log(
        `Production automatique (Robots) : ${maxProduction} tiramisus`
      );
    } else {
      errorMessage.textContent =
        "Pas assez d'ingrédients pour produire un tiramisu !";
      errorMessage.style.display = "block";
    }
  }
}

function acheterVendeur() {
  let errorMessage = document.getElementById("error-message");
  if (money >= 50) {
    nbVendeurs += 1;
    money -= 50;
    updateDisplay();
    errorMessage.style.display = "none";
  } else {
    errorMessage.textContent = "Impossible, vous n'avez pas assez d'argent !";
    errorMessage.style.display = "block";
  }
}

function venteAuto() {
  const demande = calculerDemande();

  if (demande === 0 || tiramisus === 0 || nbVendeurs === 0) {
    return;
  }

  const vitesseVente = 1 + nbVendeurs * 0.2;

  let nbVendus = Math.floor(demande * vitesseVente);

  nbVendus = Math.min(nbVendus, tiramisus);

  tiramisus -= nbVendus;
  money += currentPrice * nbVendus;

  console.log(`Vente automatique : ${nbVendus} tiramisus vendus.`);
  updateDisplay();
}

setInterval(robotProd, 1000);
setInterval(venteAuto, 1000);

function declencherFinDuJeu() {
  document.body.style.transition = "opacity 2s";
  document.body.style.opacity = "0";

  setTimeout(() => {
    document.body.innerHTML = "";

    document.body.style.backgroundColor = "black";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";

    const imageFinale = document.createElement("img");
    imageFinale.src = "images/Titi.jpg";
    imageFinale.alt = "Tiramisu Final";
    imageFinale.style.width = "300px";
    imageFinale.style.borderRadius = "15px";
    imageFinale.style.marginBottom = "20px";

    const messageFinal = document.createElement("h1");
    messageFinal.textContent =
      "Alors, jeunes gens, on veut toujours manger des Tiramisus ? Hehehe";

    messageFinal.style.color = "white";
    messageFinal.style.textAlign = "center";
    messageFinal.style.fontSize = "3rem";
    messageFinal.style.fontFamily = "Arial, sans-serif";
    messageFinal.style.padding = "20px";

    document.body.appendChild(messageFinal);

    document.body.style.opacity = "1";
  }, 2000);
}

// Évènements :
function checkEvents() {
  if (totalTira >= seuilEvent1 && !event1Unlocked) {
    document.getElementById("event1").style.display = "block";
    event1Unlocked = true;
  }
}

function activerEvent1() {
  productionDoublee = true;
  alert(
    "Julian commence sa formation.Pour le régaler, vous créez 2 fois plus de tiramisus manuellement"
  );
  document.getElementById("event1").style.display = "none";
}

function updateDisplay() {
  document.getElementById("money").textContent = money;
  document.getElementById("tiramisus").textContent = tiramisus;
  document.getElementById("coffee").textContent = coffee;
  document.getElementById("mascarpone").textContent = mascarpone;
  document.getElementById("nbRobot").textContent = nbRobot;
  document.getElementById("nbVendeurs").textContent = nbVendeurs;
  document.getElementById("totalTira").textContent = totalTira;
  document.getElementById("pourcentageDemande").textContent =
    calculerPourcentageDemande();
  checkEvents();
  if (totalTira >= 5000) {
    declencherFinDuJeu();
  }
}
