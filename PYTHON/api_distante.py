from flask import Flask, request, jsonify
import sqlite3
import logging

app = Flask(__name__)
#DATABASE = 'C:\\Users\\emili\\Documents\\master2\\Tempest\\tempest_loc\\SQL\\BddNote.db'
DATABASE = 'C:\\Users\\Thomas\\Documents\\BddNote.db'

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
    classe_nom = request.args.get('classe')

    logging.debug(f"Reçu les paramètres - Prenom: {prenom}, Nom: {nom}, Classe: {classe_nom}")

    eleve = query_db('''
        SELECT e.ID, e.Prenom, e.Nom, c.Nom as Classe
        FROM Eleve e
        JOIN Classe c ON e.ClasseID = c.ID
        WHERE e.Prenom = ? AND e.Nom = ? AND c.Nom = ?
    ''', [prenom, nom, classe_nom], one=True)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Expose le serveur Flask sur le réseau
