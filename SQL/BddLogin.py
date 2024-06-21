import sqlite3
import hashlib

# Connexion à la nouvelle base de données (ou création si elle n'existe pas)
conn = sqlite3.connect('BddLogin.db')
cursor = conn.cursor()

# Création de la table User
cursor.execute('''
CREATE TABLE IF NOT EXISTS User (
  ID INTEGER PRIMARY KEY,
  Username TEXT NOT NULL UNIQUE,
  Password TEXT NOT NULL,
  Role TEXT NOT NULL
)
''')

# Fonction pour hasher un mot de passe
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Liste des utilisateurs et des mots de passe en clair
users = [
    (101, 'jean.martin', 'password1', 'Eleve'),
    (102, 'marie.dupont', 'password2', 'Eleve'),
    (103, 'pierre.durand', 'password3', 'Eleve'),
    (104, 'lucie.lefevre', 'password4', 'Eleve'),
    (105, 'sophie.petit', 'password5', 'Eleve'),
    (106, 'alain.moreau', 'password6', 'Eleve'),
    (107, 'claire.laurent', 'password7', 'Eleve'),
    (108, 'nicolas.simon', 'password8', 'Eleve'),
    (109, 'isabelle.michel', 'password9', 'Eleve'),
    (110, 'elodie.garcia', 'password10', 'Eleve'),
    (111, 'julien.bernard', 'password11', 'Eleve'),
    (112, 'sandrine.robert', 'password12', 'Eleve'),
    (113, 'antoine.richard', 'password13', 'Eleve'),
    (114, 'valerie.dubois', 'password14', 'Eleve'),
    (115, 'xavier.fontaine', 'password15', 'Eleve'),
    (201, 'paul.durand', 'password16', 'Prof'),
    (202, 'alice.lemoine', 'password17', 'Prof'),
    (203, 'eric.morel', 'password18', 'Prof'),
    (204, 'admin.admin', 'adminimerir', 'Admin'),
    (205, 'blaise.madeline', 'proviseurimerir', 'Proviseur')
]

# Insertion des utilisateurs avec les mots de passe hashés
for user in users:
    hashed_password = hash_password(user[2])
    cursor.execute("INSERT INTO User (ID, Username, Password, Role) VALUES (?, ?, ?, ?)", (user[0], user[1], hashed_password, user[3]))

# Sauvegarder (commit) les changements
conn.commit()

# Fermer la connexion
conn.close()
