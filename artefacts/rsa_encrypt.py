# use the rsa library which basically is a module that lets you decrypt data on a asynchronous basis (i.e. the sender decryptes the data with the receivers public key and the receiver itself is then the only person how can open it in using its private key (the private key will not be shared)) (see also (Bassel Tech, 2021))
import rsa

# 1 .generate_key generates and writes a privat and public key in a PEM file based on the rsa library
# we first need to create the public and the private key which can be generated in using the kewkeys function of the rsa package. The result will be stored in a PEM file called public_keys.
def generate_key():
    publicK, privateK = rsa.newkeys(2048)
    with open('./public_keys.pem', 'wb') as f:
        f.write(publicK.save_pkcs1('PEM'))

    with open('./private_keys.pem', 'wb') as f:
        f.write(privateK.save_pkcs1('PEM'))

# 2 .load_key generates and reads a privat and public key from a PEM file based on the rsa library and finally returns both keys.
def load_key():
    with open('./public_keys.pem', 'rb') as f:
        publicK = rsa.PublicKey.load_pkcs1(f.read())

    with open('./private_keys.pem', 'rb') as f:
        privateK = rsa.PrivateKey.load_pkcs1(f.read())

    return publicK, privateK

# 3. encrypt is a function that encryptes the data based on the rsa algorithm which is an algorithm that uses prime numbers in its core and after doing a transformation, it uses this transformation for decryption. Why is then possible to decrypt text while still working with numbers? Because of ASCII!
# Generally, the function encrypt takes a plaintext and a public key as arguments for doing the encryption
def encrypt(plaintext, key):
    return rsa.encrypt(plaintext.encode('ascii'), key)

# 4. decrypt is a function that decryptes a ciphertext based on a ciphertext and on a private key that it receives. If the ciphertext is not decryptable or the key is not correct, there should be no decryption ("return False"). 
def decrypt(ciphertext, key):
    if rsa.decrypt(ciphertext,key).decode('ascii'):
        return rsa.decrypt(ciphertext,key).decode('ascii')
    else:
        return False

# Starting the main program

# First generate the public and private key
generate_key()
# now read both keys
publicK, privateK = load_key()
# ask the user for a plaintext example/input
text = input('Enter your text: ')
# start the encryption and decryption
ciphertext = encrypt(text, publicK)
plaintext = decrypt(ciphertext, privateK)

print(ciphertext)
print(plaintext)

# Reference List
# ==============
# Bassel Tech (2021) RSA Encryption in Python. Available from:https://www.youtube.com/watch?v=txz8wYLITGk&t=1s [Accessed 30 August 2022]
