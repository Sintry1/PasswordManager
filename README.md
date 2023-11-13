# PasswordManager
Small React/Node project built as a password manager.
Passwords are stored in localStorage of the browser.

To run the project, clone the whole repository to your machine and navigate to it using your IDE.

Open a terminal navigate to the client folder and run the command npm install.

Once done, in the terminal write 'npm start'.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/4799708d-f4f7-4cbb-9135-830293da9775)
Entry point to the application is the password vault which contains a list of all of their passwords. This is currently logged to the console.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/22aa8132-9833-4d62-9678-60067eb5e36c)
After entering the site and username a user can choose to generate a strong password (which autofills the password field), or enter one of their own. 

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/5acbb043-6812-47a7-9119-5f9df1396b2b)
Once the user presses add, they will be a prompted for a master password. This master password is used to derive the secret key for the encryption of the password, so it needs to be memorable for the user for the decryption process.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/b016bb81-9bbc-46ac-a7fb-23f946ee89fd)
After adding a password, the password can be seen in the Password List section, with the Site unencrypted, but the password remaining encrypted.

To decrypt a password, a user must enter the site name for the site they wish to decrypt the password. Once they press Decrypt Password, they will be prompted for the master password which was entered when the password for the site was added.
![image](https://github.com/Sintry1/PasswordManager/assets/75076281/4de7c2a2-3bdd-4f88-94eb-c8a71aeb5f7b)
Assuming the master password matches the one entered in encryption, the user will receive a decrypted password back in the console.

It is important to note that the first password in the passwordList will not be decryptable for some reason, and therefore the first password should be a dummy password with dummy values. Unfortunately I didn't have time to implement this in code though.

The security for this project is good in some areas, but lacking in others. As a client only application that runs only on the local machines and stores passwords in localStorage, the opportunity for outside attackers to gain access to the information is limited.

It is still vulnerable to someone looking over your shoulder however when entering the master password.

Overall, while the password manager works and will store the passwords in their encrypted form, there are a number of security concerns. Many of these were addressed since removing the server.
