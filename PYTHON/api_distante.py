from flask import Flask, request, jsonify
import sqlite3
import logging

app = Flask(__name__)
DATABASE = 'C:\\Users\\emili\\Documents\\master2\\Tempest\\tempest_loc\\SQL\\BddNote.db'
#DATABASE = 'C:\\Users\\Thomas\\Documents\\BddNote.db'

# Configurez le logging
logging.basicConfig(level=logging.DEBUG)

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def query_db(query, args=(), one=False):
    conn = get_db()
    cur = conn.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    conn.close()
    logging.debug(f"Executed query: {query}")
    logging.debug(f"With args: {args}")
    logging.debug(f"Returned rows: {rv}")
    return (rv[0] if rv else None) if one else rv

@app.route('/api/eleves/notes', methods=['GET'])
def get_eleve_notes():
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

    conn = get_db()
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

    conn = get_db()
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
    

    logging.debug("Bulletin validé avec succes.")
    return jsonify({'message': 'Bulletin validé avec succes.'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Expose le serveur Flask sur le réseau
