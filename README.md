# PasswordManager
Small React/Node project built as a password manager.

To run the project, clone the whole repository to your machine and navigate to it using your IDE.

Open a terminal navigate to the client folder and run the command npm install.


Once done, in the terminal write 'npm start'.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/4799708d-f4f7-4cbb-9135-830293da9775)
Entry point to the application is the password vault which contains a list of all of their passwords. This is currently logged to the console.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/7c9c69fc-b959-41cf-83c8-e4e86eaad788)
After entering the site and pressing genereate strong password (which autofills the password field), the user then presses add, and if they password is successfully added, they are alerted my an alert() function.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/2482f3ff-d91f-4473-aa41-d025049b20aa)
After adding a password, the password can be seen in the Password List section, with the Site unencrypted, but the password remaining encrypted.

![image](https://github.com/Sintry1/PasswordManager/assets/75076281/89a0e09a-b703-4dbd-9adf-cd26cf111619)
Once a user presses Decrypt all Passwords, the server decrypts all of the passwords that are present in the file for the user and displays their original plain text value.

The security for this project is good in some areas, but severely lacking in others. As a web application, there was a need for passing data between the inputs on the client side and the server. While this data is stored in an encrypted or hashed fashion (dependent on which data it is), it is more secure on the server side, however due to time constraints, the data is exposed on the client side via the network tab as a payload with requests. Bcrypt is used to hash the master password and username together with a work factor of 100, to securely store the password in a JSON file on the server, however as discussed before, this is exposed to the client side network requests. One solution to this would be using HTTPS instead of HTTP to encrypt the communication. There was an attempt at using JWT to store the data in a token in cookies, but unfortunately, due to time constraints, I was not able to implement this in a working fashion, though the remnants of it are still present in the code, but commented out. As the program only runs on the local machine and does not share data between machines, this is less of a concern, however in a production environment, all of the data would need to be hashed correctly in order to be considered secure. 

Overall, while the password manager works and will store the passwords in their encrypted and hashed forms, there are a number of fairly large security concerns if it were to be deployed;

First and foremost, exposure of the data in the payload would need to be prevented by implementing something like OAuth and OpenId Connect. 

Second, as the data is stored in JSON files, it would be more secure if the data were stored in a database and the database inputs sanitised to ensure that not SQL Injection attacks could take place.

Third, the data should be encrypted before it is sent from the client to the server. An attempt was made at this, but without enough time to properly debug it, I could not get it to work.

Fourth, the key is stored in a file under the same directory as the password file which stores the passwords for each user in their encrypted format. Instead, the key should be generated each time a user logs in so that it cannot be stolen by anyone who gains access to our file system.

Perhaps another framework would have been more suitable that doesn't make use of a web application client, however due to the time, I went with what I was comfortable with. 
