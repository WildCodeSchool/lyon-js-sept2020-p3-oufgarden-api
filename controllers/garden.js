const {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
  createAddress,
  createZonesForGardenId,
} = require('../models/garden');

module.exports.handleGetGarden = async (req, res) => {
  const rawData = await getGarden();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneGarden = async (req, res) => {
  res.send(await getOneGarden(req.params.id));
};

module.exports.handleCreateGarden = async (req, res) => {
  // exemple de ce qui est envoyé côté back office
  // {
  //   address: {
  //     address_city: ,
  //     address_street: ,
  //     address_zipcode: ,
  //   },
  //   name: ,
  //   description: ,
  //   exposition: ,
  //   zone_quantity: ,
  //   zone_details: [
  //     {
  //       zone_name: '',
  //       type: '',
  //       exposition: '',
  //       plantFamilyArray: [],
  //       description: '',
  //     },
  //     {
  //       zone_name: '',
  //       type: '',
  //       exposition: '',
  //       plantFamilyArray: [],
  //       description: '',
  //     },
  //   ],
  // }
  const {
    address,
    name,
    description,
    exposition,
    zone_quantity,
    zone_details,
  } = req.body;

  const dataAddress = await createAddress({
    address,
  });
  const createdAddressId = dataAddress.id;

  const dataGarden = await createGarden({
    address_id: createdAddressId,
    name,
    description,
    exposition,
    zone_quantity,
    zone_details,
    picture: '',
    map: '',
  });
  const createdGardenId = dataGarden.id;

  await createZonesForGardenId(createdGardenId, zone_details); // fonction pour insérer les zones dans la table zone, avec le bon id de jardin, elle supprime le jardin s'il y a un problème lors de la création des zones

  /* il faut encore créer une fonction qui remplit la table de jointure entre les zones et les catégories de plantes, et l'appeler pour chaque zone : 
  pour cela il faudrait que la fonction juste au dessus renvoie un tableau des zones créées avec notamment leur id, et renvoie zone_details
  le tableau de résultats devra avoir la forme [{zoneId:, plantFamilyArray:}]
  ensuite on pourrait faire un forEach sur ce tableau de résultat :
  tableauDeResultats.forEach(zone => {
    await linkZoneToPlantFamily(zone.zoneId, zone.plantFamilyArray)
  })
  */

  return res.status(201).send([dataAddress, dataGarden]);
};

module.exports.handleUpdateGarden = async (req, res) => {
  const { name } = req.body;
  const data = await updateGarden(req.params.id, {
    name,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteGarden = async (req, res) => {
  await removeGarden(req.params.id);
  res.sendStatus(204);
};
