$(function() {
  'use strict';

  $('div.modal-fade').hide();

  // data is an array of objects that look like this:
  // [
  //   {name: '', value: ''},
  //   {name: '', value: ''}
  // ]
  // each object, is one of our form inputs.
  // this function, will smash that array of objects
  // down into ONE object that looks like a single person,
  // and return it.
  var makePerson = function(data) {
    var person = {};
    data.forEach(function(item, i) {
      // why bracket notation? like an array?
      // because person.item.name would confuse JS
      // into thinking you want to ask for a value.
      person[item.name] = item.value;
    });
    return person;
  };

  var displayPeople = function() {
    var $peopleList = $('#peopleList');
    $peopleList.empty();

    $.each(people, function(index, value) {
      var facts = "";
      var id = people[index].id;

      $.each(value, function(key, value) {
        facts += key + ": " + value + '<br />';
      });

      //console.log($peopleList);
      $peopleList.append('<li data-id='+id+'>'+facts+'<button name="edit" type="button" value='+id+'>Edit</button></li>');
      $peopleList.append('<li data-id='+id+'><button name="delete" type="button" value='+id+'>Delete</button></li>');
    });
  };


  // pick a key to save things to in localStorage
  var storageKey = 'people';

  // this will be our list of people
  var fromStorage = localStorage.getItem(storageKey);
  var people = JSON.parse(fromStorage) || [];

  if(people) {
    console.log('render?', '');
    displayPeople();
  }

  // get the form with jQuery so we can do stuff with it
  var $form = $('form[name="person"]');
  // optimize
  var $firstNameInput = $('#firstName', $form);
  var $lastNameInput = $('#lastName', $form);
  var $ageInput = $('#age', $form);
  var $emailInput = $('#email', $form);
  var $idInput = $('#id', $form);

  // do stuff when the form submits
  $form.submit(function(evt) {
    // stop the page reload, or anything, for that matter...
    evt.preventDefault();

    // now get the form data, BUT, will only get
    // inputs with a name="" attribute
    var data = $form.serializeArray();

    // If empty, make new id and push into data
    if (!$idInput.val()) {
      _.find(data, function(obj) {
        return obj.name === 'id';
      }).value = Date.now().toString();
    }

    // transform.
    var person = makePerson(data);

    // add this person to our list of people.
    if (!$idInput.val()) {
      people.push(person);
    } else {
      var found =_.find(people, function(storedPerson) {
        return storedPerson.id === person.id;
      });

      found.firstName = person.firstName;
      found.lastName = person.lastName;
      found.age = person.age;
      found.email = person.email;
    }

    // prep all people to save, otherwise it will put
    // [object Object] into localStorage, and that means
    // all of our data is lost :(
    var toSave = JSON.stringify(people);

    // now save them!
    localStorage.setItem(storageKey, toSave);
    this.reset();
    $idInput.val('');

    // $(this)
        // .find('input')
        // .first()
        // .focus();
    $firstNameInput.focus();
    displayPeople();
  });

  var $delete = $('button[name="delete"]');

  // When the delete button is clicked
  $delete.click(function(evt) {
    var hash = $(this).attr('value');

    _.remove(people, function(obj) {
      return obj.id === hash;
    });

    localStorage.setItem(storageKey, JSON.stringify(people));

    var $removed = $('li[data-id='+hash+']');
    $removed.remove();
  });

  var $edit = $('button[name="edit"]');

  // When the edit button is clicked
  $edit.click(function(evt) {
    var id = $(this).attr('value');
    console.log('EDIT', id);

    // Populate all input fields
    // Need a new value attr - for id of user
    //  Upon submit, If the ID attr is non-null, find and submit to that thing
    //               Else just insert normal way

    var personToEdit = _.find(people, function(person) {
      return person.id === id;
    });

    console.log(personToEdit);

    $firstNameInput.val(personToEdit.firstName);
    $lastNameInput.val(personToEdit.lastName);
    $ageInput.val(personToEdit.age);
    $emailInput.val(personToEdit.email);
    $idInput.val(id);
  });
});
