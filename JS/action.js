const { createApp } = Vue
  createApp({
    data() {
      /* Seccion de variables */
      return {
        endpoint: "http://127.0.0.1:5000/", // URL del backend
        seqMode: true, // Seleccionar AA o ADN
        primero: false, // Control para mostrar la secuencia de AA
        segundo: false, // Control para mostrar la secuencia de ADN
        third: false, // Control para mostrar el spinner
        fourth: false, // Control para mostrar resultados
        /* ------------------ Variables para los AAs ------------------ */
        aaIsDisabled: false, // Para desactivar los controles para seleccionar AA
        aaSlideDisabled: false, // Para desactivar el slider unicamente
        aaSequence: ["M"], // Secuencia de AA de la proteina (se carga con Axios al iniciar la pagina)
        aaPostSequence: ["M"], // Secuencia de AA de la proteina post mutacion
        // Objeto con AAs: llaves - letra, valor - nombre e imagen
        aaMut: {"G" : ["Glycine", "glycine.png"],
                "A" : ["Alanine", "alanine.png"],
                "L" : ["Leucine", "leucine.png"],
                "M" : ["Methionine", "methionine.png"],
                "F" : ["Phenylalanine", "phenylalanine.png"],
                "W" : ["Tryptophan", "tryptophan.png"],
                "K" : ["Lysine", "lysine.png"],
                "Q" : ["Glutamine", "glutamine.png"],
                "E" : ["Glutamic Acid", "glutamic_acid.png"],
                "S" : ["Serine", "serine.png"],
                "P" : ["Proline", "proline.png"],
                "V" : ["Valine", "valine.png"],
                "I" : ["Isoleucine", "isoleucine.png"],
                "C" : ["Cysteine", "cysteine.png"],
                "Y" : ["Tyrosine", "tyrosine.png"],
                "H" : ["Histidine", "histidine.png"],
                "R" : ["Arginine", "arginine.png"],
                "N" : ["Asparagine", "asparagine.png"],
                "D" : ["Aspartic Acid", "aspartic_acid.png"],
                "T" : ["Threonine", "threonine.png"]
              },
        aaImgs: {}, // Objeto para pre-cargar las imagenes
        aaMutCode: "", // Codigo de la mutacion
        aa: 0, // Posicion del AA a mutar
        aaSel: "M", // Letra del AA que reemplazara
        /* ------------------ Variables para el ADN ------------------ */
        dnaIsDisabled: false, // Para desactivar los controles para seleccionar nucleotido
        dnaSlideDisabled: false, // Para desactivar el slider unicamente
        dnaSequence: ["A"], // Secuencia de ADN de la proteina (se carga con Axios al iniciar la pagina)
        dnaPostSequence: ["A"], // Secuencia de ADN de la proteina post mutacion
        // Objeto con nucleotidos: llaves - letra, valor - nombre e imagen
        dnaMut: {"A" : ["Adenine", "adenine.png"],
                "C" : ["Cytosine", "cytosine.png"],
                "G" : ["Guanine", "guanine.png"],
                "T" : ["Thymine", "thymine.png"]
              },
        dnaImgs: {}, // Objeto para pre-cargar las imagenes
        dnaMutCode: "", // Codigo de la mutacion
        dna: 0, // Posicion del nucleotido a mutar
        dnaSel: "A" // Letra del nucleotido que reemplazara
      }
    },
    methods: {
      /* Metodo para restablecer todo a su configuracion inicial */
      reset() {
        this.dnaIsDisabled = false;
        this.dnaSlideDisabled = false;
        this.aaIsDisabled = false;
        this.aaSlideDisabled = false;
        this.dnaPostSequence = [...this.dnaSequence];
        this.aaPostSequence = [...this.aaSequence];
        this.dnaMutCode = "";
        this.aaMutCode = "";
        this.dna = 0;
        this.aa = 0;
        this.dnaSel = "A";
        this.aaSel = "M";
      },
      /* Metodo AA para actualizar el codigo de mutacion al mover el slider */
      updateAA() {
        this.aaMutCode = this.aaSequence[this.aa] + (+this.aa + 1) + this.aaPostSequence[this.aa];
      },
      /* Metodo DNA para actualizar el codigo de mutacion al mover el slider */
      updateDNA() {
        this.dnaMutCode = this.dnaSequence[this.dna] + (+this.dna + 1) + this.dnaPostSequence[this.dna];
      },
      /* Metodo para actualizar el codigo de mutacion al seleccionar el AA para reemplazar */
      onAA(nam) {
        this.aaSel = nam;
        this.aaMutCode = this.aaSequence[this.aa] + (+this.aa + 1) + nam;
        this.aaPostSequence[this.aa] = nam;
        // Check if both sequences are different
        var difference = 0;
        for (var i = 0; i < this.aaSequence.length; i++) {
          if (this.aaSequence[i] != this.aaPostSequence[i]) {
            difference = difference + 1;
          }
        }
        if (difference != 0) {
          this.aaSlideDisabled = true;
        } else {
          this.aaSlideDisabled = false;
        }
      },
      /* Metodo para actualizar el codigo de mutacion al seleccionar el nucleotido para reemplazar */
      onDNA(nam) {
        this.dnaSel = nam;
        this.dnaMutCode = this.dnaSequence[this.dna] + (+this.dna + 1) + nam;
        this.dnaPostSequence[this.dna] = nam;
        // Check if both sequences are different
        var difference = 0;
        for (var i = 0; i < this.dnaSequence.length; i++) {
          if (this.dnaSequence[i] != this.dnaPostSequence[i]) {
            difference = difference + 1;
          }
        }
        if (difference != 0) {
          this.dnaSlideDisabled = true;
        } else {
          this.dnaSlideDisabled = false;
        }
      },
      /* Metodo para pedirle la evaluacion de la nueva secuencia segun el modelo al backend */
      aaRun() {
        if ((this.aaMutCode.length >= 3) && (this.aaMutCode.length <= 5)) {
          var primera = this.aaMutCode.slice(0,1);
          var ultima = this.aaMutCode.slice(-1);
          if (Object.keys(this.aaMut).includes(primera) && Object.keys(this.aaMut).includes(ultima) && (primera != ultima)) {
            var numero = this.aaMutCode.slice(1,-1);
            if ((+numero >= 1) && (+numero <= this.aaSequence.length)) {
              axios
                .get(this.endpoint + "aamutation", {
                  params: {
                    code: this.aaMutCode
                  }
                })
                .then(response => {
                  console.log(response);
                  this.third = false;
                })
              this.third = true;
              this.aaIsDisabled = true;
              console.log("Genial!")
            } else {
              console.log("Error de numero");
            }
          } else {
            console.log("Error de letras");
          }
        } else {
          console.log("Error de largo");
        }
      },
      /* Metodo para pedirle la evaluacion de la nueva secuencia segun el modelo al backend */
      dnaRun() {
        if ((this.dnaMutCode.length >= 3) && (this.dnaMutCode.length <= 5)) {
          var primera = this.dnaMutCode.slice(0,1);
          var ultima = this.dnaMutCode.slice(-1);
          if (Object.keys(this.dnaMut).includes(primera) && Object.keys(this.dnaMut).includes(ultima) && (primera != ultima)) {
            var numero = this.dnaMutCode.slice(1,-1);
            if ((+numero >= 1) && (+numero <= this.dnaSequence.length)) {
              axios
                .get(this.endpoint + "dnamutation", {
                  params: {
                    code: this.dnaMutCode
                  }
                })
                .then(response => {
                  console.log(response);
                  this.third = false;
                })
              this.third = true;
              this.dnaIsDisabled = true;
              console.log("Genial!")
            } else {
              console.log("Error de numero");
            }
          } else {
            console.log("Error de letras");
          }
        } else {
          console.log("Error de largo");
        }
      }
    },
    /* !!!!! ANTES DE MONTAR VUE.JS EN LA PAGINA !!!!! */
    beforeMount () {
      /* Solicitar al backend la secuencia de AAs */
      const getAASequence = async () => {
        await axios
          .get(this.endpoint + "aminoacid")
          .then(response => {
            this.aaSequence = response['data'].split("");
            this.aaPostSequence = response['data'].split("");
            this.primero = true;
          });
      }
      /* Solicitar al backend la secuencia de ADN */
      const getDNASequence = async () => {
        await axios
          .get(this.endpoint + "dna")
          .then(response => {
            this.dnaSequence = response['data'].split("");
            this.dnaPostSequence = response['data'].split("");
            this.segundo = true;
          });
      }
      getAASequence();
      getDNASequence();
    },
    /* !!!!! JUSTO DESPUES DE MONTAR VUE.JS EN LA PAGINA !!!!! */
    mounted () {
      /* Pre-cargar las imagenes en el cache del navegador para no hacer el proceso tan demandante */
      Object.keys(this.aaMut).forEach(element => {
        this.aaImgs[element] = new Image();
        this.aaImgs[element].src = "IMG/" + this.aaMut[element][1];
      });
      Object.keys(this.dnaMut).forEach(element => {
        this.dnaImgs[element] = new Image();
        this.dnaImgs[element].src = "IMG/" + this.dnaMut[element][1];
      });
    }
  }).mount('#app')