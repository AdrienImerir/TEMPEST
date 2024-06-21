import sqlite3

# Connexion à la base de données (ou création si elle n'existe pas)
conn = sqlite3.connect('BddNote.db')
cursor = conn.cursor()

# Création de la table Eleve
cursor.execute('''
CREATE TABLE IF NOT EXISTS Eleve (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL,
  Prenom TEXT NOT NULL,
  PP INTEGER NOT NULL,
  ClasseID INTEGER NOT NULL,
  UserID INTEGER NOT NULL,
  FOREIGN KEY (PP) REFERENCES Professeur(ID),
  FOREIGN KEY (ClasseID) REFERENCES Classe(ID),
  FOREIGN KEY (UserID) REFERENCES User(ID)
)
''')

# Création de la table NoteEleve
cursor.execute('''
CREATE TABLE IF NOT EXISTS NoteEleve (
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

# Création de la table Professeur
cursor.execute('''
CREATE TABLE IF NOT EXISTS Professeur (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL,
  Prenom TEXT NOT NULL,
  ClasseID INTEGER NOT NULL,
  CheckPP BOOLEAN NOT NULL,
  UserID INTEGER NOT NULL,
  MatiereID INTEGER NOT NULL,
  FOREIGN KEY (ClasseID) REFERENCES Classe(ID),
  FOREIGN KEY (UserID) REFERENCES User(ID),
  FOREIGN KEY (MatiereID) REFERENCES Matiere(ID)
)
''')

# Création de la table Matiere
cursor.execute('''
CREATE TABLE IF NOT EXISTS Matiere (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL
)
''')

# Création de la table Bulletin
cursor.execute('''
CREATE TABLE IF NOT EXISTS Bulletin (
  ID INTEGER PRIMARY KEY,
  EleveID INTEGER NOT NULL,
  CheckPP BOOLEAN,
  CheckProviseur BOOLEAN,
  FOREIGN KEY (EleveID) REFERENCES Eleve(ID)
)
''')

# Création de la table Commentaire
cursor.execute('''
CREATE TABLE IF NOT EXISTS Commentaire (
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

# Création de la table Classe
cursor.execute('''
CREATE TABLE IF NOT EXISTS Classe (
  ID INTEGER PRIMARY KEY,
  Nom TEXT NOT NULL
)
''')

# Sauvegarder (commit) les changements
conn.commit()

# Fermer la connexion
conn.close()
