import hashlib
from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
import sqlite3
import logging

app = Flask(__name__)
# Cette ligne permet d'ajouter les politiques CORS
CORS(app, supports_credentials=True)

app.config.update(
    DEBUG=True,
    SECRET_KEY="a2899c367daefa60fbe33ce8526ef6ea68987221437e4369edaac59993a5f616",
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="None",
)

# DATABASE = 'C:\\Users\\emili\\Documents\\master2\\Tempest\\tempest_loc\\SQL\\BddNote.db'
DATABASE = 'C:\\Users\\Thomas\\Documents\\BddNote.db'
DATABASE_NOTE = 'C:\\Users\\Thomas\\Documents\\BddNote.db'
DATABASE_USERS = 'C:\\Users\\Thomas\\Documents\\BddLogin.db'

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

#################################################################################################################################################
# Gestion des Notes
#################################################################################################################################################

@app.route('/api/eleves/notes', methods=['GET'])
def get_eleve_notes():
    logging.debug(f"Session: {session}")
    # if 'username' not in session:
    #    logging.debug("User not authenticated")
    #    return jsonify({'erreur': 'Non authentifie'}), 401

    prenom = request.args.get('prenom')
    nom = request.args.get('nom')
    username = session.get('username')
    role = session.get('role')  # Assuming you store the role in the session

    logging.debug(f"Session Username: {username}")
    logging.debug(f"Session Role: {role}")

    logging.debug(f"Reçu les paramètres - Prénom: {prenom}, Nom: {nom}")

    eleve = query_db('''
        SELECT e.ID, e.Prenom, e.Nom, c.ID as ClasseID, c.Nom as Classe
        FROM Eleve e
        JOIN Classe c ON e.ClasseID = c.ID
        WHERE LOWER(e.Prenom) = ? AND LOWER(e.Nom) = ?
    ''', "note", [prenom.lower(), nom.lower()], one=True)

    if not eleve:
        logging.debug("Élève non trouvé")
        return jsonify({'erreur': 'Élève non trouvé'}), 404

    logging.debug(f"Élève trouvé - ID: {eleve['ID']}, Prénom: {eleve['Prenom']}, Nom: {eleve['Nom']}, Classe: {eleve['Classe']}")

    notes = query_db('''
        SELECT n.Notes, m.ID as MatiereID, m.Nom as Matiere, p.Nom as ProfesseurNom, p.Prenom as ProfesseurPrenom
        FROM NoteEleve n
        JOIN Matiere m ON n.MatiereID = m.ID
        JOIN Professeur p ON n.ProfID = p.ID
        WHERE n.EleveID = ?
    ''', "note", [eleve['ID']])

    logging.debug(f"Notes récupérées: {notes}")

    notes_data = []
    notes_min_data = []
    notes_max_data = []
    commentaires_data = []

    for note in notes:
        matiere_id = note['MatiereID']

        # Récupérer la note minimale et maximale pour la matière dans l'ensemble de la classe
        stats = query_db('''
            SELECT MIN(n.Notes) as MinNote, MAX(n.Notes) as MaxNote
            FROM NoteEleve n
            JOIN Eleve e ON n.EleveID = e.ID
            WHERE e.ClasseID = ? AND n.MatiereID = ?
        ''', "note", [eleve['ClasseID'], matiere_id], one=True)

        # Récupérer le commentaire pour cette matière et cet élève
        commentaire = query_db('''
            SELECT c.Commentaire
            FROM Commentaire c
            WHERE c.EleveID = ? AND c.MatiereID = ? AND c.ProfID = (SELECT ID FROM Professeur WHERE Nom = ? AND Prenom = ?)
        ''', "note", [eleve['ID'], matiere_id, note['ProfesseurNom'], note['ProfesseurPrenom']], one=True)

        notes_data.append({
            'matiere': note['Matiere'],
            'professeur': f"{note['ProfesseurPrenom']} {note['ProfesseurNom']}",
            'note': note['Notes']
        })

        notes_min_data.append({
            'matiere': note['Matiere'],
            'note_min': stats['MinNote']
        })

        notes_max_data.append({
            'matiere': note['Matiere'],
            'note_max': stats['MaxNote']
        })

        commentaires_data.append({
            'matiere': note['Matiere'],
            'commentaire': commentaire['Commentaire'] if commentaire else None
        })

    return jsonify({
        'eleve': {
            'prenom': eleve['Prenom'],
            'nom': eleve['Nom'],
            'classe': eleve['Classe']
        },
        'notes': notes_data,
        'notes_min': notes_min_data,
        'notes_max': notes_max_data,
        'commentaires': commentaires_data
    })




@app.route('/api/notes', methods=['POST'])
def ajouter_notes():
    data = request.json
    prof_id = data['prof_id']
    classe_nom = data['classe_id']  # Assuming classe_id is actually the class name
    notes = data['notes']  # Liste de dictionnaires avec 'eleve_id', 'matiere' et 'note'
    commentaires = data.get('commentaires', [])
    
    bulletin_valide = query_db('''
        SELECT CheckPP FROM Bulletin
        WHERE EleveID IN (SELECT ID FROM Eleve WHERE ClasseID = (SELECT ID FROM Classe WHERE Nom = ?)) AND CheckPP = 1
    ''', "note", [classe_nom], one=True)

    if bulletin_valide:
        logging.debug("Le bulletin a ete valide, les notes ne peuvent plus etre modifiees.")
        return jsonify({'erreur': 'Le bulletin a ete valide, les notes ne peuvent plus etre modifiees.'}), 403

    conn = get_notes_db()
    cur = conn.cursor()

    for note in notes:
        eleve_nom_complet = note['eleve_id']
        matiere_nom = note['matiere']
        note_valeur = note['note']
        
        # Split the full name into first name and last name
        eleve_prenom, eleve_nom = eleve_nom_complet.split(' ', 1)

        # Get the EleveID
        eleve = query_db('''
            SELECT ID FROM Eleve WHERE Prenom = ? AND Nom = ?
        ''', "note", [eleve_prenom, eleve_nom], one=True)
        
        if not eleve:
            logging.debug(f"Élève non trouvé: {eleve_prenom} {eleve_nom}")
            continue  # Skip this note if the student is not found

        eleve_id = eleve['ID']

        # Get the MatiereID
        matiere = query_db('''
            SELECT ID FROM Matiere WHERE Nom = ?
        ''', "note", [matiere_nom], one=True)
        
        if not matiere:
            logging.debug(f"Matière non trouvée: {matiere_nom}")
            continue  # Skip this note if the subject is not found

        matiere_id = matiere['ID']

        cur.execute('''
            INSERT INTO NoteEleve (EleveID, Notes, MatiereID, ProfID)
            VALUES (?, ?, ?, ?)
        ''', (eleve_id, note_valeur, matiere_id, prof_id))

    for commentaire in commentaires:
        eleve_nom_complet = commentaire['eleve_id']
        commentaire_texte = commentaire['commentaire']
        
        # Split the full name into first name and last name
        eleve_prenom, eleve_nom = eleve_nom_complet.split(' ', 1)

        # Get the EleveID
        eleve = query_db('''
            SELECT ID FROM Eleve WHERE Prenom = ? AND Nom = ?
        ''', "note", [eleve_prenom, eleve_nom], one=True)
        
        if not eleve:
            logging.debug(f"Élève non trouvé: {eleve_prenom} {eleve_nom}")
            continue  # Skip this comment if the student is not found

        eleve_id = eleve['ID']

        # Assume the commentaire applies to all subjects for this student
        cur.execute('''
            INSERT INTO Commentaire (EleveID, ProfID, MatiereID, Commentaire, Date)
            VALUES (?, ?, NULL, ?, datetime('now'))
        ''', (eleve_id, prof_id, commentaire_texte))

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



@app.route('/api/professeur/notes', methods=['GET'])
def get_professeur_notes():
    username = request.args.get('username')

    if not username:
        return jsonify({'erreur': 'Username non fourni'}), 400

    try:
        prenom, nom = username.split('.')
    except ValueError:
        return jsonify({'erreur': 'Format de username incorrect'}), 400

    logging.debug(f"Reçu les paramètres - Prénom: {prenom}, Nom: {nom}")

    prof = query_db('''
        SELECT ID FROM Professeur WHERE LOWER(Prenom) = ? AND LOWER(Nom) = ?
    ''', "note", [prenom.lower(), nom.lower()], one=True)

    if not prof:
        logging.debug("Professeur non trouvé")
        return jsonify({'erreur': 'Professeur non trouvé'}), 404

    prof_id = prof['ID']

    notes = query_db('''
        SELECT n.Notes, e.Prenom as ElevePrenom, e.Nom as EleveNom, m.Nom as Matiere, c.Nom as Classe
        FROM NoteEleve n
        JOIN Eleve e ON n.EleveID = e.ID
        JOIN Matiere m ON n.MatiereID = m.ID
        JOIN Classe c ON e.ClasseID = c.ID
        WHERE n.ProfID = ?
    ''', "note", [prof_id])

    if not notes:
        logging.debug("Aucune note trouvée pour ce professeur")
        return jsonify({'erreur': 'Aucune note trouvée pour ce professeur'}), 404

    logging.debug(f"Notes trouvées pour le ProfID {prof_id}: {notes}")

    # Structurer les notes par élève et par matière
    eleves_notes = {}
    for note in notes:
        eleve_key = f"{note['ElevePrenom']} {note['EleveNom']}"
        if eleve_key not in eleves_notes:
            eleves_notes[eleve_key] = {
                'prenom': note['ElevePrenom'],
                'nom': note['EleveNom'],
                'classe': note['Classe'],
                'notes': {}
            }
        if note['Matiere'] not in eleves_notes[eleve_key]['notes']:
            eleves_notes[eleve_key]['notes'][note['Matiere']] = []
        eleves_notes[eleve_key]['notes'][note['Matiere']].append(note['Notes'])

    # Convertir les notes en liste de dictionnaires pour chaque élève
    eleves_notes_list = []
    for eleve, details in eleves_notes.items():
        notes_list = [{'matiere': matiere, 'notes': notes} for matiere, notes in details['notes'].items()]
        eleves_notes_list.append({
            'prenom': details['prenom'],
            'nom': details['nom'],
            'classe': details['classe'],
            'notes': notes_list
        })

    return jsonify({'notes': eleves_notes_list})

#################################################################################################################################################
# Gestion des logins et registers
#################################################################################################################################################


@app.route('/api/auth', methods=['POST'])
def auth_session():
    username = request.json.get('username')
    password = request.json.get('password')

    # Split username into prenom and nom
    try:
        prenom, nom = username.split('.')
    except ValueError:
        return jsonify({'status': '0', 'erreur': 'Format de login incorrect. Utilisez prenom.nom'}), 400

    password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    user = query_db('''
        SELECT * FROM User WHERE Username = ? AND Password = ?
    ''', "users", [username, password], one=True)

    if user:
        session['username'] = username
        session['role'] = user['Role']  # Store role in session
        session['prenom'] = prenom
        session['nom'] = nom

        logging.debug(f"User authenticated - Username: {username}, Role: {
        user['Role']}, Prenom: {prenom}, Nom: {nom}")

        return jsonify({
            'status': '1',
            'message': 'Authentification reussie',
            'role': user['Role'],
            'prenom': prenom,
            'nom': nom
        }), 200
    else:
        logging.debug("Authentication failed")
        return jsonify({'status': '0', 'erreur': 'Nom d\'utilisateur ou mot de passe incorrect'}), 401


@app.route('/home_fake', methods=['GET'])
def home_page():
    # Check if the user is authenticated
    if 'username' not in session:
        return "Non Authentifié", 401

    # if user is authentificated, show a message
    return "Authentifié"


@app.route('/api/isloggedin', methods=['GET'])
def is_user_loggedin():
    if 'username' in session:
        return jsonify({'status': '1', 'message': 'Utilisateur connecte'})
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
