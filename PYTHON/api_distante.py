from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'ecole.db'  # Chemin vers votre base de données SQLite

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
    return (rv[0] if rv else None) if one else rv

# Endpoint pour récupérer les notes d'un élève
@app.route('/api/eleves/notes', methods=['GET'])
def get_eleve_notes():
    prenom = request.args.get('prenom')
    nom = request.args.get('nom')
    classe_nom = request.args.get('classe')

    eleve = query_db('''
        SELECT e.ID, e.Prenom, e.Nom, e.Classe
        FROM Eleve e
        WHERE e.Prenom = ? AND e.Nom = ? AND e.Classe = ?
    ''', [prenom, nom, classe_nom], one=True)

    if not eleve:
        return jsonify({'erreur': 'Élève non trouvé'}), 404

    notes = query_db('''
        SELECT n.Notes, m.Nom as Matiere, p.Nom as ProfesseurNom, p.Prenom as ProfesseurPrenom
        FROM NoteEleve n
        JOIN Matiere m ON n.MatiereID = m.ID
        JOIN Professeur p ON n.ProfID = p.ID
        WHERE n.EleveID = ?
    ''', [eleve['ID']])

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
