import sqlite3

# Connexion à la base de données (ou création si elle n'existe pas)
conn = sqlite3.connect('BddNote.db')
cursor = conn.cursor()

# Création des tables
cursor.execute('''
CREATE TABLE Eleve (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL,
  Prenom TEXT NOT NULL,
  PP INTEGER NOT NULL,
  Classe TEXT NOT NULL,
  FOREIGN KEY (PP) REFERENCES Professeur(ID)
)
''')

cursor.execute('''
CREATE TABLE NoteEleve (
  ID INTEGER PRIMARY KEY,
  EleveID INTEGER NOT NULL,
  Notes FLOAT NOT NULL,
  MatiereID INTEGER NOT NULL,
  ProfID INTEGER NOT NULL,
  FOREIGN KEY (EleveID) REFERENCES Eleve(ID),
  FOREIGN KEY (MatiereID) REFERENCES Matiere(ID),
  FOREIGN KEY (ProfID) REFERENCES Professeur(ID)
)
''')

cursor.execute('''
CREATE TABLE Professeur (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL,
  Prenom TEXT NOT NULL,
  Classe TEXT NOT NULL,
  CheckPP BOOLEAN NOT NULL
)
''')

cursor.execute('''
CREATE TABLE Matiere (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE Bulletin (
  ID INTEGER PRIMARY KEY,
  EleveID INTEGER NOT NULL,
  CheckPP BOOLEAN,
  CheckProviseur BOOLEAN,
  FOREIGN KEY (EleveID) REFERENCES Eleve(ID)
)
''')

cursor.execute('''
CREATE TABLE Commentaire (
  ID INTEGER PRIMARY KEY,
  EleveID INTEGER NOT NULL,
  ProfID INTEGER NOT NULL,
  MatiereID INTEGER NOT NULL,
  Commentaire TEXT NOT NULL,
  Date DATETIME NOT NULL,
  FOREIGN KEY (EleveID) REFERENCES Eleve(ID),
  FOREIGN KEY (ProfID) REFERENCES Professeur(ID),
  FOREIGN KEY (MatiereID) REFERENCES Matiere(ID)
)
''')

# Sauvegarder (commit) les changements
conn.commit()

# Fermer la connexion
conn.close()
