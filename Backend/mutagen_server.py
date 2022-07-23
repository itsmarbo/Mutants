from flask import Flask, request, render_template
from flask_cors import CORS

full_sequence = ("M","S","Y","Y","H","H","H","H","H","H","D","Y","D","I","P",
                "T","T","E","N","L","Y","F","Q","G","A","M","G","I","L","G",
                "S","G","Q","K","H","F","E","K","R","R","N","P","A","A","G",
                "L","I","Q","S","A","W","R","F","Y","A","T","N","L","S","R",
                "T","D","L","H","S","T","W","Q","Y","Y","E","R","T","V","T",
                "V","P","M","Y","R","G","L","E","D","L","T","P","G","L","K",
                "V","S","I","R","A","V","C","V","M","R","F","L","V","S","K",
                "R","K","F","K","E","S","L","R","L","D")

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
                "T" : "Threonine"
              }

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

# Aplicacion del servidor
app = Flask(__name__)
CORS(app)

@app.route('/')
def test():
    return "First test."

# -----------------------------------------------------------------------------
# Funcion/Ruta para devolver la secuencia de aminoacidos
# -----------------------------------------------------------------------------
# Input:  ---
# Output: La secuencia de aminoacidos como un string.
# -----------------------------------------------------------------------------
@app.route('/sequence')
def sequence():
    secuencia = "".join(full_sequence)
    return secuencia

# -----------------------------------------------------------------------------
# Funcion/Ruta para recibir la solicitud de mutacion
# -----------------------------------------------------------------------------
# Input:  [A traves de una solicitud web] El codigo de la mutacion
# Output: [A traves de una respuesta web] El porcentaje de XXXXXX, la mutacion,
#         y la YYYYYYY.
# -----------------------------------------------------------------------------
@app.route('/mutation', methods=['GET'])
def mutation():
    if request.method == 'GET':
        if 'code' in request.args.keys():
            eval_code = mutator(request.args['code'])
            if eval_code[0]:
                new_seq = eval_code[1]
                return "Got it!"
            else:
                return "Error!"
        else:
            return "Error!"
    else:
        return "Error!"

if __name__ == '__main__':
    app.run(debug=True)