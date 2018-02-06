const { Client } = require('pg');
const client = new Client();


function AddNewAddress(address, qty) {
  console.log(`nouvelle adresse : ${address} et quantité : ${qty}`);
  client.connect();
  return client.query("SELECT id from addresses where address = '$1'",[address])
  .then(response => {
    console.log(response);
  })

};


AddNewAddress("A-101",5);


module.exports = AddNewAddress;

/*
Lors de l'ajout de la nouvelle adresse depuis la page home,
on check si l'adresse existe dans la base "addresses",

- Si elle n'existe pas on la crée, en mettant "disabled" à false.
Puis on insert l'adresse dans la table "stock_addresses" en y ajoutant la "qty", apres confirmation de l'action ( voulez-vous créer une nouvelle adresse?)

- Si l'adresse existe on vérifie si "disabled" est bien false.
On alter la table "stock_addresses" en y ajoutant la "qty", apres confirmation de l'action ( voulez-vous modifier le stock de cette adresse ?)

- - Si l'adresse existe et si "disabled" est true, on affiche une alerte et on bloque l'action.


*/
