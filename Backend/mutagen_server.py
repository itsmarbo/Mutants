# To run the webserver in debug mode, please make sure to have the required
# libraries specified in the repository's README.
# Then, you may run the server by typing "python mutagen_server.py" in a
# command line.

# Libraries
from flask import Flask, request, render_template
from flask_cors import CORS

# Constants in the program

# Amino Acid sequence
full_sequence = ("M","S","Y","Y","H","H","H","H","H","H","D","Y","D","I","P",
                "T","T","E","N","L","Y","F","Q","G","A","M","G","I","L","G",
                "S","G","Q","K","H","F","E","K","R","R","N","P","A","A","G",
                "L","I","Q","S","A","W","R","F","Y","A","T","N","L","S","R",
                "T","D","L","H","S","T","W","Q","Y","Y","E","R","T","V","T",
                "V","P","M","Y","R","G","L","E","D","L","T","P","G","L","K",
                "V","S","I","R","A","V","C","V","M","R","F","L","V","S","K",
                "R","K","F","K","E","S","L","R","L","D")

# Amino Acid dictionary with names
amino_acids = {"G" : "Glycine",
                "A" : "Alanine",
                "L" : "Leucine",
                "M" : "Methionine",
                "F" : "Phenylalanine",
                "W" : "Tryptophan",
                "K" : "Lysine",
                "Q" : "Glutamine",
                "E" : "Glutamic Acid",
                "S" : "Serine",
                "P" : "Proline",
                "V" : "Valine",
                "I" : "Isoleucine",
                "C" : "Cysteine",
                "Y" : "Tyrosine",
                "H" : "Histidine",
                "R" : "Arginine",
                "N" : "Asparagine",
                "D" : "Aspartic Acid",
                "T" : "Threonine",
                "-" : "Stop"
              }

# Codons to translate into Amino Acids
encoding_dna = {"UUU": "F", "UCU": "S", "UAU": "Y", "UGU": "C",
                "UUC": "F", "UCC": "S", "UAC": "Y", "UGC": "C",
                "UUA": "L", "UCA": "S", "UAA": "-", "UGA": "-",
                "UUG": "L", "UCG": "S", "UAG": "-", "UGG": "W",
                "CUU": "L", "CCU": "P", "CAU": "H", "CGU": "R",
                "CUC": "L", "CCC": "P", "CAC": "H", "CGC": "R",
                "CUA": "L", "CCA": "P", "CAA": "Q", "CGA": "R",
                "CUG": "L", "CCG": "P", "CAG": "Q", "CGG": "R",
                "AUU": "I", "ACU": "T", "AAU": "N", "AGU": "S",
                "AUC": "I", "ACC": "T", "AAC": "N", "AGC": "S",
                "AUA": "I", "ACA": "T", "AAA": "K", "AGA": "R",
                "AUG": "M", "ACG": "T", "AAG": "K", "AGG": "R",
                "GUU": "V", "GCU": "A", "GAU": "D", "GGU": "G",
                "GUC": "V", "GCC": "A", "GAC": "D", "GGC": "G",
                "GUA": "V", "GCA": "A", "GAA": "E", "GGA": "G",
                "GUG": "V", "GCG": "A", "GAG": "E", "GGG": "G"
                }

# -----------------------------------------------------------------------------
# Funcion para codificar ARN en aminoacidos
# -----------------------------------------------------------------------------
# Input:  La secuencia de ARN como un string
# Output: La secuencia de aminoacidos codificados por el ARN
# -----------------------------------------------------------------------------
def ribosome(rna_seq):
    # Revisar si la secuencia es multiplo de 3, para saber si se puede
    # codificar segun codones de 3 nucleotidos
    if rna_seq % 3 == 0:
        # Preparar una variable para almacenar el codon
        codon = ""
        # Preparar una lista para almacenar la secuencia de AAs
        aa_seq = []
        # Recorrer la secuencia de ARN cada 3 nucleotidos
        for i in range(0, len(rna_seq), 3):
            codon = rna_seq[i:i+3]  # Extraer el codon
            try:
                aa_seq.append(encoding_dna[codon]) # Agregar el AA a la lista
            except IndexError as e: # Si el codon no existe (alguna letra mal)
                print(e) # Desplegar error y explicar
                print("One of the codons does not match any of the possible\
                    RNA codons for protein encoding!")
                print(f"Check the codon {rna_seq[i:i+3]} at position {i}.")
                return [] # Devolver lista vacia
        return aa_seq # Devolver lista de AAs
    else:
        return [] # Devolver lista vacia

# -----------------------------------------------------------------------------
# Funcion para devolver la secuencia con la mutacion especifica
# -----------------------------------------------------------------------------
# Input:  El codigo de mutacion: letra, posicion, letra
# Output: Verdadero y la secuencia mutada, si el codigo de mutacion estaba bien
#         Falso y la secuencia original, si el codigo de mutacion estaba mal
# -----------------------------------------------------------------------------
def mutator(code):
    # Si el codigo de mutacion es mas largo o igual a 3
    # y mas pequeno o igual a 5, ...
    if ((len(code) >= 3) and (len(code) <= 5)):
        # Extraer primera letra, ultima letra y la posicion basada en 0
        first = code[0]
        last = code[-1]
        position = int(code[1:-1]) - 1
        # Si las letras son amino acidos, y la posicion esta en el rango de la
        # secuencia, entonces ...
        if ((first in amino_acids.keys()) and (last in amino_acids.keys()) and
            (position < len(full_sequence)) and (position >= 0)):
            # Si la posicion en la secuencia original si tiene la letra
            # especificada, ...
            if full_sequence[position] == first:
                # Generar la secuencia con la mutacion
                new_sequence = list(full_sequence)
                new_sequence[position] = last
                return [True, new_sequence]
            else:
                return [False, list(full_sequence)]
        else:
            return [False, list(full_sequence)]
    else:
        return [False, list(full_sequence)]

# *****************************************************************************
# Main program starts here!
# *****************************************************************************

# Aplicacion del servidor
app = Flask(__name__)

# Dandole capacidad al servidor de recibir solicitudes de otras fuentes que
# no sean el. [cross-origin resource sharing]
CORS(app)

# Ruta de prueba para comprobar si el servidor esta corriendo bien.
@app.route('/')
def droids():
    return render_template("ntdylf.html")

# -----------------------------------------------------------------------------
# Funcion/Ruta para devolver la secuencia de aminoacidos
# -----------------------------------------------------------------------------
# Input:  ---
# Output: La secuencia de aminoacidos como un string.
# -----------------------------------------------------------------------------
@app.route('/aminoacid')
def aminoacid():
    secuencia = "".join(full_sequence)
    return secuencia

# -----------------------------------------------------------------------------
# Funcion/Ruta para recibir la solicitud de mutacion
# -----------------------------------------------------------------------------
# Input:  [A traves de una solicitud web] El codigo de la mutacion
# Output: [A traves de una respuesta web] El porcentaje de XXXXXX, la mutacion,
#         la YYYYYYY, y si fue exitosa la prediccion.
# -----------------------------------------------------------------------------
@app.route('/mutation', methods=['GET'])
def mutation():
    if request.method == 'GET':
        if 'code' in request.args.keys():
            eval_code = mutator(request.args['code'])
            if eval_code[0]:
                new_seq = eval_code[1]
                return {"percent": 87, "code": request.args['code'], "something": 20, "model": True}
            else:
                return {"percent": 0, "code": request.args['code'], "something": 0, "model": False}
        else:
            return {"percent": 0, "code": request.args['code'], "something": 0, "model": False}
    else:
        return {"percent": 0, "code": request.args['code'], "something": 0, "model": False}

if __name__ == '__main__':
    app.run(debug=True)