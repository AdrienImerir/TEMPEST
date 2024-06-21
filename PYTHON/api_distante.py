import hashlib
from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from flask_swagger import swagger
import sqlite3
import logging

app = Flask(__name__)
CORS(app)  # Cette ligne permet d'ajouter les politiques CORS

app.config.update(
    DEBUG=True,
    SECRET_KEY="a2899c367daefa60fbe33ce8526ef6ea68987221437e4369edaac59993a5f616",
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
)

# DATABASE = 'C:\\Users\\emili\\Documents\\master2\\Tempest\\tempest_loc\\SQL\\BddNote.db'
DATABASE_NOTE = '../SQL/BddNote.db'
DATABASE_USERS = '../SQL/BddLogin.db'

# Configurez le logging
logging.basicConfig(level=logging.DEBUG)


def get_notes_db():
    conn = sqlite3.connect(DATABASE_NOTE)
    conn.row_factory = sqlite3.Row
    return conn


def get_users_db():
    conn = sqlite3.connect(DATABASE_USERS)
    conn.row_factory = sqlite3.Row
    return conn


def query_db(query, db_sel, args=(), one=False):
    if db_sel == "note":
        conn = get_notes_db()
    elif db_sel == "users":
        conn = get_users_db()
    else:
        return None

    cur = conn.execute(query, args)
    rv = cur.fetchall()

    # only commit for write queries
    if query.strip().upper().startswith("INSERT") or query.strip().upper().startswith(
            "UPDATE") or query.strip().upper().startswith("DELETE"):
        conn.commit()

    cur.close()
    conn.close()
    logging.debug(f"Executed query: {query}")
    logging.debug(f"With args: {args}")
    logging.debug(f"Returned rows: {rv}")
    return (rv[0] if rv else None) if one else rv


def get_user_role(user_id):
    user = query_db('''SELECT Role FROM User WHERE ID = ? ''', "users", [user_id], one=True)

    if user:
        return user['Role']
    else:
        return None


#################################################################################################################################################
# Gestion des Notes
#################################################################################################################################################


@app.route('/api/eleves/notes', methods=['GET'])
def get_eleve_notes():
    # Securely check if the user is authenticated
    # if 'username' not in session or session['username'] is None:
    #     return jsonify({'status': '0', 'message': 'Utilisateur non connecté'}), 401

    prenom = request.args.get('prenom')
    nom = request.args.get('nom')
    
    logging.debug(f"Reçu les parametres - Prenom: {prenom}, Nom: {nom}")

    eleve = query_db('''
        SELECT e.ID, e.Prenom, e.Nom, c.Nom as Classe
        FROM Eleve e
        JOIN Classe c ON e.ClasseID = c.ID
        WHERE e.Prenom = ? AND e.Nom = ?
    ''', [prenom, nom], one=True)

    if not eleve:
        logging.debug("Eleve non trouvé")
        return jsonify({'erreur': 'Eleve non trouve'}), 404

    logging.debug(f"Eleve trouve - ID: {eleve['ID']}, Prenom: {
    eleve['Prenom']}, Nom: {eleve['Nom']}, Classe: {eleve['Classe']}")

    notes = query_db('''
        SELECT n.Notes, m.Nom as Matiere, p.Nom as ProfesseurNom, p.Prenom as ProfesseurPrenom
        FROM NoteEleve n
        JOIN Matiere m ON n.MatiereID = m.ID
        JOIN Professeur p ON n.ProfID = p.ID
        WHERE n.EleveID = ?
    ''', [eleve['ID']])

    logging.debug(f"Notes récupérées: {notes}")

    notes_data = [{'matiere': note['Matiere'], 'professeur': f"{note['ProfesseurPrenom']} {
    note['ProfesseurNom']}", 'note': note['Notes']} for note in notes]

    return jsonify({
        'eleve': {
            'prenom': eleve['Prenom'],
            'nom': eleve['Nom'],
            'classe': eleve['Classe']
        },
        'notes': notes_data
    })


@app.route('/api/notes', methods=['POST'])
def ajouter_notes():
    data = request.json
    prof_id = data['prof_id']
    classe_id = data['classe_id']
    matiere_id = data['matiere_id']
    notes = data['notes']  # Liste de dictionnaires avec 'eleve_id' et 'note'
    commentaire = data.get('commentaire')

    bulletin_valide = query_db('''
        SELECT CheckPP FROM Bulletin
        WHERE EleveID IN (SELECT ID FROM Eleve WHERE ClasseID = ?) AND CheckPP = 1
    ''', [classe_id])

    if bulletin_valide:
        logging.debug("Le bulletin a ete valide, les notes ne peuvent plus etre modifiees.")
        return jsonify({'erreur': 'Le bulletin a ete valide, les notes ne peuvent plus etre modifiees.'}), 403

    conn = get_notes_db()
    cur = conn.cursor()

    for note in notes:
        eleve_id = note['eleve_id']
        note_valeur = note['note']
        cur.execute('''
            INSERT INTO NoteEleve (EleveID, Notes, MatiereID, ProfID)
            VALUES (?, ?, ?, ?)
        ''', (eleve_id, note_valeur, matiere_id, prof_id))
        if commentaire:
            cur.execute('''
                INSERT INTO Commentaire (EleveID, ProfID, MatiereID, Commentaire, Date)
                VALUES (?, ?, ?, ?, datetime('now'))
            ''', (eleve_id, prof_id, matiere_id, commentaire))

    conn.commit()
    cur.close()
    conn.close()

    logging.debug("Notes et commentaires ajoutes avec succes.")
    return jsonify({'message': 'Notes et commentaires ajoutes avec succes.'}), 201

@app.route('/api/bulletin/valider', methods=['POST'])
def valider_bulletin():
    data = request.json
    prof_id = data['prof_id']
    classe_id = data['classe_id']

    prof_principal = query_db('''
        SELECT CheckPP FROM Professeur
        WHERE ID = ? AND ClasseID = ?
    ''', [prof_id, classe_id], one=True)

    if not prof_principal or not prof_principal['CheckPP']:
        logging.debug("Seul le professeur principal peut valider le bulletin.")
        return jsonify({'erreur': 'Seul le professeur principal peut valider le bulletin.'}), 403

    eleves = query_db('''
        SELECT ID FROM Eleve WHERE ClasseID = ?
    ''', [classe_id])

    conn = get_notes_db()
    cur = conn.cursor()

    for eleve in eleves:
        eleve_id = eleve['ID']
        cur.execute('''
            UPDATE Bulletin
            SET CheckPP = 1
            WHERE EleveID = ?
        ''', [eleve_id])

    conn.commit()
    cur.close()
    conn.close()


    logging.debug("Bulletin valide avec succes.")
    return jsonify({'message': 'Bulletin valide avec succes.'}), 200

@app.route('/api/professeur/classes', methods=['GET'])
def get_classes_professeur():
    prof_id = request.args.get('prof_id')

    logging.debug(f"Reçu le paramètre - ProfID: {prof_id}")

    classes = query_db('''
        SELECT c.ID, c.Nom
        FROM Classe c
        JOIN Professeur p ON c.ID = p.ClasseID
        WHERE p.ID = ?
    ''', [prof_id])

    if not classes:
        logging.debug("Aucune classe trouvée pour ce professeur")
        return jsonify({'erreur': 'Aucune classe trouvée pour ce professeur'}), 404

    logging.debug(f"Classes trouvées pour le ProfID {prof_id}: {classes}")

    classes_data = [{'id': classe['ID'], 'nom': classe['Nom']} for classe in classes]

    return jsonify({'classes': classes_data})


#################################################################################################################################################
# Gestion des logins et registers
#################################################################################################################################################
@app.route('/api/auth', methods=['POST'])
def auth_session():
    # Get the username and password from the request
    username = request.json.get('username')
    password = request.json.get('password')

    # Hash the password
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Query the database for the user
    user = query_db('''
        SELECT * FROM User WHERE Username = ? AND Password = ?
    ''', "users", [username, password], one=True)

    # If the user is found, set the session username
    if user:
        session['username'] = user['ID']
        return jsonify({'role': user['Role'], 'status': '1', 'message': 'Authentification reussie'}), 200
    else:
        return jsonify({'status': '0', 'erreur': 'Nom d\'utilisateur ou mot de passe incorrect'}), 401


# get all users from the database
@app.route('/api/users', methods=['GET'])
def get_users():
    # Check if the user is authenticated
    if 'username' not in session or session['username'] is None:
        return jsonify({'status': '0', 'message': 'Utilisateur non connecte'}), 401

    # Check if the user is an admin
    if get_user_role(session['username']) in ['Prof', 'Admin']:
        return jsonify({'status': '0', 'message': 'Utilisateur non autorise'}), 401

    users = query_db('''
        SELECT * FROM User WHERE Role != 'Admin'
    ''', "users")

    users_data = [{'id': user['ID'], 'username': user['Username'], 'role': user['Role']} for user in users]

    return jsonify(users_data)


@app.route('/api/updateuser', methods=['POST'])
def update_user():
    user_id = request.json.get('userid')
    new_username = request.json.get('new_username')
    password = request.json.get('password')
    role = request.json.get('role')

    # Hash the password
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Check if the user exists
    user = query_db('''
        SELECT * FROM User WHERE ID = ?''', "users", [user_id], one=True)

    if not user:
        return jsonify({'status': '-1', 'erreur': 'Manipulation de données détecté'}), 401

    # if the username is different from the current one, update it by the user_id
    if new_username != user['Username']:
        query_db('''
            UPDATE User
            SET Username = ?
            WHERE ID = ?
        ''', "users", [new_username, user_id])

    # if the role is different from the current one, update it by the user_id
    if role != user['Role']:
        query_db('''
            UPDATE User
            SET Role = ?
            WHERE ID = ?
        ''', "users", [role, user_id])

    # if the password is different from the current one, update it by the user_id
    if password != user['Password']:
        query_db('''
            UPDATE User
            SET Password = ?
            WHERE ID = ?
        ''', "users", [password, user_id])

    return jsonify({'status': '1', 'message': 'Mot de passe modifie'}), 200


@app.route('/home_fake_test', methods=['GET'])
def home_page():
    # Check if the user is authenticated
    if 'username' not in session:
        return jsonify({'erreur': 'Non authentifie'}), 401

    # if user is authentificated, show a message
    return jsonify({'status': '1', 'message': 'Bienvenue sur la page d\'accueil'})


@app.route('/api/isloggedin', methods=['GET'])
def is_user_loggedin():
    if 'username' in session:
        return jsonify({'status': '1', 'message': 'Utilisateur connecte', 'role': get_user_role(session['username'])})
    else:
        return jsonify({'status': '0', 'message': 'Utilisateur non connecte'})


@app.route('/api/logout', methods=['GET'])
def logout_session():
    session.pop('username', None)
    return jsonify({'status': '1', 'message': 'Deconnexion reussie'})


@app.route('/api/register', methods=['POST'])
def register_user():
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role')

    # Hash the password
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Check if the username already exists
    user = query_db('''
        SELECT * FROM User WHERE Username = ?
    ''', "users", [username], one=True)

    if user:
        return jsonify({'status': '0', 'erreur': 'Nom d\'utilisateur dejà utilise'}), 409

    # insert the user in the database
    query_db('''
        INSERT INTO User (Username, Password, Role) VALUES (?, ?, ?)
    ''', "users", [username, password, role])

    # check if the user was registered
    registered_user = query_db('''
            SELECT * FROM User WHERE Username = ?
        ''', "users", [username], one=True)

    # if the insert has failed, return an error
    if not registered_user:
        return jsonify({'status': '-1', 'erreur': 'Erreur lors de l\'enregistrement de l\'utilisateur'}), 500

    return jsonify({'status': '1', 'message': 'Utilisateur enregistre'}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Expose le serveur Flask sur le reseau
