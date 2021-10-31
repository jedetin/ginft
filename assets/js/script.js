var json_msg;

function getMsg() {
    let from = document.getElementById("sender").value
    let to = document.getElementById("receiver").value
    let msg = document.getElementById("message").value

    json_msg = { "from": from, "to": to, "msg": msg }
    return json_msg;
}

function getPass() {

    document.getElementById('result').style.display = "block";


    let pass = document.getElementById("pass").value
    console.log(pass)

    var json = JSON.stringify(json_msg);
    var PassPhrase1 = pass;
    var Bits = 512;
    var MattsRSAkey = cryptico.generateRSAKey(PassPhrase1, Bits);
    var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);

    var PassPhrase = "1000"; // create system passphrase;
    var Bits = 512;
    var SamsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);

    var PlainText = json;
    var EncryptionResult = cryptico.encrypt(PlainText, MattsPublicKeyString, SamsRSAkey);
    var token = EncryptionResult.cipher;

    document.getElementById("keyid").value = cryptico.publicKeyID(cryptico.publicKeyString(MattsRSAkey));
    document.getElementById("keystring").value = MattsPublicKeyString;
    document.getElementById("token").value = token;
}

function vercrypt() {
    let tokenid = document.getElementById("tokenid").value
    let pass = document.getElementById("pass").value
    let token = document.getElementById("token").value

    var PassPhrase1 = pass;
    var Bits = 512;

    var MattsRSAkey = cryptico.generateRSAKey(PassPhrase1, Bits);
    var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
    var EncryptionResult = [{
        "cipher": token,
        "status": "success"
    }];

    //console.log(EncryptionResult)

    var DecryptionResult = cryptico.decrypt(EncryptionResult[0].cipher, MattsRSAkey);


    var data = DecryptionResult.plaintext;
    console.log(data)

    if (data == null) {
        document.getElementById("failure").innerHTML = "<div class='alert alert-dismissible alert-danger'><strong>Failed to verify</strong><br> We are unable to verify your token for this time. <br> Try: <ul><li>Entering correct Passphrase</li><li>Paste entire token, without missing a single character</li></ul></div>"
        document.getElementById("from").value = "ERROR";
        document.getElementById("to").value = "ERROR"
        document.getElementById("message").value = "ERROR"
    }
    var result = JSON.parse(data)

    document.getElementById("from").value = result.from;
    document.getElementById("to").value = result.to;
    document.getElementById("message").value = result.msg;
    //document.getElementById("ts").innerHTML = (result.uid).slice(2, 14);

    document.getElementById("verify").innerHTML = "Integrity: " + DecryptionResult.signature;

    //console.log(result)

}