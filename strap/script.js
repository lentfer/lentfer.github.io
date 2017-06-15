var usernameField, msgField;
var form;
var msgList;
var db = firebase.database().ref();

var user = firebase.auth().currentUser;
  if (user) signedIn();
  else  signIn();


firebase.auth().onAuthStateChanged(function(user){
  if(user)signedIn();
  else signIn();
})

function signedIn(){
  db.child('messages').on('child_added', function(snapshot){
    var object = snapshot.val();
    var own = object.uid === firebase.auth().currentUser.uid;
    createMessageElement(object.msg, object.sender, own, snapshot.key);
  });
  db.child('messages').on('child_removed', function(snapshot){
    var keyToDelete = snapshot.key;
    document.getElementById(keyToDelete).remove();

  });
}

function signIn(){
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('error! ' + errorMessage);
    // ...
  });
}

usernameField = document.getElementById('username');
msgField = document.getElementById('msg');
form = document.getElementById('msgform');
msgList = document.getElementById('msgList');

form.addEventListener('submit', function(e){
  e.preventDefault();
  var usr = usernameField.value;
  var msg = msgField.value;
  msgField.value = "";
  console.log(usr + ': ' + msg);
  db.child('messages').push({
    msg: msg,
    sender: usr,
    time: Date.now(),
    uid: firebase.auth().currentUser.uid,
  });
});

function createMessageElement(message, who, own, id){
  var div = document.createElement("div");
  div.id = id;
  if(own) div.classList = 'list-group-item text-right list-group-item-info';
  else div.classList = 'list-group-item';
  var msg= document.createElement('h4');
  msg.innerText = message;
  var sender = document.createElement('p');
  sender.innerText = who;
  div.appendChild(msg);
  div.appendChild(sender);
  msgList.appendChild(div);

  if(own) div.addEventListener('click', function(){
    console.log('delete id: ' + id);
    db.child("messages/" + id).remove();
  });

};
