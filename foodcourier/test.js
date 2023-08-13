document.addEventListener("DOMContentLoaded", function(){
    QUnit.module('emailReg jo adat eseten', function() {
       QUnit.test('emailReg jo adat eseten', function(assert) {
          assert.equal(emailReg("exampleeamail@example.com"), true);
       });
    });
 
    QUnit.module('emailReg rossz adat', function() {
       QUnit.test('emailReg rossz adat', function(assert) {
          assert.equal(emailReg("exampleeamail#example.com"), false);
       });
    });
 
    QUnit.module('pwReg jo adat eseten', function() {
       QUnit.test('pwReg jo adat eseten', function(assert) {
          assert.equal(pwReg("Jelszo_123"), true);
       });
    });
 
    QUnit.module('pwReg rossz adat eseten', function() {
       QUnit.test('pwReg rossz adat eseten', function(assert) {
          assert.equal(pwReg("Jelszo_123"), true);
       });
    });
 
    QUnit.module('testDbConnection', async function() {
       QUnit.test('testDbConnection', async function(assert) {
          assert.equal(await testDbConnection(), 1);
       });
    });
 
    QUnit.module('testDbConnection static data', async function() {
       QUnit.test('testDbConnection static data', async function(assert) {
          assert.equal(await selectDataTest(), "Döner Kebab Budapest");
       });
    });

    QUnit.module('checkstatus', async function() {
       QUnit.test('checkstatus', async function(assert) {
          assert.equal(await checkstatus(), true);
       });
    });
 })
 
 async function testDbConnection() {
    let formData = new FormData();
    formData.append("f", "testDbconnection");
 
    let response = await fetch("adat.php", {
       method: "POST",
       body: formData
    });
 
    let request = await response.text();
 
    return request;
 }
 
 async function selectDataTest() {
    let formData = new FormData();
    formData.append("f", "selectDataTest");
 
    let response = await fetch("adat.php", {
       method: "POST",
       body: formData
    });
 
    let request = await response.json();
 
    return request.nev;
 }
 
 function emailReg(email) {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return pattern.test(email);
 }
 
 function pwReg(pw) {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;
    return pattern.test(pw);
 }

 async function checkstatus() {
    let formData = new FormData();
    formData.append("f", "checkLogin");
   
    let response = await fetch("adat.php", {
        method: "POST",
        body: formData,
    });

    let request = await response.json();

    return request;
}