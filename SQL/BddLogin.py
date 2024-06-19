import sqlite3

# Connexion à la base de données (ou création si elle n'existe pas)
conn = sqlite3.connect('BddLogin.db')
cursor = conn.cursor()

# Création de la table User
cursor.execute('''
CREATE TABLE User (
  ID INTEGER PRIMARY KEY,
  Username TEXT NOT NULL UNIQUE,
  Password TEXT NOT NULL,
  Role TEXT NOT NULL CHECK(Role IN ('Eleve', 'Prof', 'Proviseur', 'Admin'))
)
''')

# Sauvegarder (commit) les changements
conn.commit()

# Fermer la connexion
conn.close()
