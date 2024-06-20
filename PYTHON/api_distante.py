import hashlib
from flask import Flask, request, jsonify, session
import sqlite3
import logging

app = Flask(__name__)

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
        session['username'] = username
        return jsonify({'status': '1', 'message': 'Authentification reussie'}), 200
    else:
        return jsonify({'status': '0', 'erreur': 'Nom d\'utilisateur ou mot de passe incorrect'}), 401


@app.route('/home_fake', methods=['GET'])
def home_page():
    # Check if the user is authenticated
    if 'username' not in session:
        return jsonify({'erreur': 'Non authentifie'}), 401

    # if user is authentificated, show a message
    return jsonify({'status': '1', 'message': 'Bienvenue sur la page d\'accueil'})


@app.route('/api/isloggedin', methods=['GET'])
def is_user_loggedin():
    if 'username' in session:
        return jsonify({'status': '1', 'message': 'Utilisateur connecté'})
    else:
        return jsonify({'status': '0', 'message': 'Utilisateur non connecté'})


@app.route('/api/eleves/notes', methods=['GET'])
def get_eleve_notes():
    # Securely check if the user is authenticated
    if 'username' not in session:
        return jsonify({'erreur': 'Non authentifie'}), 401

    prenom = request.args.get('prenom')
    nom = request.args.get('nom')
    
    logging.debug(f"Reçu les paramètres - Prenom: {prenom}, Nom: {nom}")

    eleve = query_db('''
        SELECT e.ID, e.Prenom, e.Nom, c.Nom as Classe
        FROM Eleve e
        JOIN Classe c ON e.ClasseID = c.ID
        WHERE e.Prenom = ? AND e.Nom = ?
    ''', [prenom, nom], one=True)

    if not eleve:
        logging.debug("Eleve non trouvé")
        return jsonify({'erreur': 'Eleve non trouve'}), 404

    logging.debug(f"Elève trouvé - ID: {eleve['ID']}, Prenom: {eleve['Prenom']}, Nom: {eleve['Nom']}, Classe: {eleve['Classe']}")

    notes = query_db('''
        SELECT n.Notes, m.Nom as Matiere, p.Nom as ProfesseurNom, p.Prenom as ProfesseurPrenom
        FROM NoteEleve n
        JOIN Matiere m ON n.MatiereID = m.ID
        JOIN Professeur p ON n.ProfID = p.ID
        WHERE n.EleveID = ?
    ''', [eleve['ID']])

    logging.debug(f"Notes récupérées: {notes}")

    notes_data = [{'matiere': note['Matiere'], 'professeur': f"{note['ProfesseurPrenom']} {note['ProfesseurNom']}", 'note': note['Notes']} for note in notes]

    return jsonify({
        'eleve': {
            'prenom': eleve['Prenom'],
            'nom': eleve['Nom'],
            'classe': eleve['Classe']
        },
        'notes': notes_data
    })


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
        return jsonify({'status': '0', 'erreur': 'Nom d\'utilisateur déjà utilisé'}), 409

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

    return jsonify({'status': '1', 'message': 'Utilisateur enregistré'}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Expose le serveur Flask sur le réseau
