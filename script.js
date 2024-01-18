// Fonction pour obtenir les cases à cocher sélectionnées
function getSelectedCheckboxes(checkboxName) {
    var checkboxes = document.getElementsByName(checkboxName);
    var selectedCheckboxes = [];
  
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selectedCheckboxes.push(checkboxes[i].value);
      }
    }
  
    return selectedCheckboxes;
  }
  
  function submitForm() {
    var form = document.getElementById('eventForm');
    var selectedTechnicalEvents = getSelectedCheckboxes('technicalEvents');
    var selectedNonTechnicalEvents = getSelectedCheckboxes('nonTechnicalEvents');
  
    // Nouveaux champs
    var gender = form.querySelector('input[name="gender"]:checked');
    var dob = form.elements['dob'].value;
  
    // Vérification des champs vides
if (!form.elements['firstName'].value || !form.elements['lastName'].value || !form.elements['email'].value || !gender || !dob ||
(selectedTechnicalEvents.length === 0 && selectedNonTechnicalEvents.length === 0) ||
(selectedTechnicalEvents.length !== 0 && selectedNonTechnicalEvents.length !== 0)) {
alert("Veuillez remplir tous les champs du formulaire.");
return;
}

    // Vérification du format du nom et du prénom
    var nameRegex = /^[a-zA-Z]+(?:-[a-zA-Z]+)?$/;
    if (!nameRegex.test(form.elements['firstName'].value) || !nameRegex.test(form.elements['lastName'].value)) {
      alert("Veuillez entrer des noms et prénoms valides (uniquement des lettres et éventuellement un tiret pour les noms composés).");
      return;
    }

       // Vérification de l'âge (18 ans ou plus)
  var currentDate = new Date();
  var birthDate = new Date(dob);
  var age = currentDate.getFullYear() - birthDate.getFullYear();

  if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    alert("Vous devez avoir au moins 18 ans pour vous inscrire à l'événement.");
    return;
  }
  
    // Vérification du format de l'e-mail
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.elements['email'].value)) {
      alert("Veuillez entrer une adresse e-mail valide.");
      return;
    }
  
    // Vérification des choix d'événements
if (!((selectedTechnicalEvents.length === 2 && selectedNonTechnicalEvents.length === 0) || (selectedTechnicalEvents.length === 0 && selectedNonTechnicalEvents.length === 1) || (selectedTechnicalEvents.length === 1 && selectedNonTechnicalEvents.length === 0))) {
  console.log(selectedTechnicalEvents, selectedNonTechnicalEvents);
  alert("Veuillez sélectionner exactement 2 événements techniques OU 1 événement non technique.");
  return;
}

  
    // Envoi d'un e-mail de confirmation à l'étudiant
    var firstName = form.elements['firstName'].value;
    var email = form.elements['email'].value;
    sendEmail(email, 'Confirmation d\'Inscription à l\'Événement', firstName, selectedTechnicalEvents, selectedNonTechnicalEvents, gender.value, dob);
  
    // Affichage de la popup
    var popupContent = `Inscription réussie !\n\nNom : ${firstName}\nE-mail : ${email}\nSexe : ${gender.value}\nDate de Naissance : ${dob}\n\nÉvénements Techniques : ${selectedTechnicalEvents.join(', ')}\nÉvénements Non Techniques : ${selectedNonTechnicalEvents.join(', ')}`;
    document.getElementById('popupContent').innerText = popupContent;
    document.getElementById('popup').style.display = 'block';
  }
  
  
  function sendEmail(to, subject, firstName, selectedTechnicalEvents, selectedNonTechnicalEvents) {
    const formattedBody = `
      Cher ${firstName},
      
      Nous sommes ravis de vous informer que votre inscription à l'événement a été réussie. Voici les détails de votre inscription :
      
      - Événements techniques : ${selectedTechnicalEvents.join(', ')}
      - Événements non techniques : ${selectedNonTechnicalEvents.join(', ')}
      
      Merci de votre participation !
      
      Cordialement,
      L'équipe d'organisation de l'événement.
    `;
  
    fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body: formattedBody,
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Erreur :', error));
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  