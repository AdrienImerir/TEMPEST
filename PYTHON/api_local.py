from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
API_URL = 'http://10.3.1.224:5000/api/eleves/notes'  # Remplacez <REMOTE_IP> par l'adresse IP du serveur distant

# Endpoint pour récupérer les notes d'un élève
@app.route('/eleves/notes', methods=['GET'])
def get_eleve_notes():
    prenom = request.args.get('prenom')
    nom = request.args.get('nom')
    classe_nom = request.args.get('classe')

    response = requests.get(API_URL, params={'prenom': prenom, 'nom': nom, 'classe': classe_nom})

    if response.status_code == 404:
        return jsonify({'erreur': 'Élève non trouvé'}), 404

    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
