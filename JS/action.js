const { createApp } = Vue
  createApp({
    data() {
      /* Seccion de variables */
      return {
        primero: false, // Control para mostrar la secuencia
        third: false, // Control para mostrar el spinner
        fourth: false, // Control para mostrar resultados
        isDisabled: false, // Para desactivar los controles para seleccionar AA
        aaSequence: ["G"], // Secuencia de AA de la proteina (se carga con Axios al iniciar la pagina)
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
        imgs: {}, // Objeto para pre-cargar las imagenes
        image1: "glycine.png", // Imagen 1
        image2: "methionine.png", // Imagen 2
        mutCode: "", // Codigo de la mutacion
        aa: 0, // Posicion del AA a mutar
        sel: "M", // Letra del AA que reemplazara
        endpoint: "http://127.0.0.1:5000/" // URL del backend
      }
    },
    methods: {
      /* Metodo para actualizar el codigo de mutacion al mover el slider */
      updateAA() {
        this.mutCode = this.aaSequence[this.aa] + (+this.aa + 1) + this.sel;
      },
      /* Metodo para actualizar el codigo de mutacion al seleccionar el AA para reemplazar */
      onAA(nam) {
        this.image2 = this.aaMut[nam][1];
        this.sel = nam;
        this.mutCode = this.aaSequence[this.aa] + (+this.aa + 1) + nam;
      },
      /* Metodo para pedirle la evaluacion de la nueva secuencia segun el modelo al backend */
      run() {
        if ((this.mutCode.length >= 3) && (this.mutCode.length <= 5)) {
          var primera = this.mutCode.slice(0,1);
          var ultima = this.mutCode.slice(-1);
          if (Object.keys(this.aaMut).includes(primera) && Object.keys(this.aaMut).includes(ultima)) {
            var numero = this.mutCode.slice(1,-2);
            if ((+numero >= 1) && (+numero < this.aaSequence.length)) {
              axios
                .get(this.endpoint + "mutation", {
                  params: {
                    code: this.mutCode
                  }
                })
                .then(response => {
                  console.log(response);
                  this.third = false;
                })
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
        this.third = true;
        this.isDisabled = true;
      }
    },
    /* !!!!! ANTES DE MONTAR VUE.JS EN LA PAGINA !!!!! */
    beforeMount () {
      /* Solicitar al backend la secuencia de AAs */
      const getSequence = async () => {
        await axios
          .get(this.endpoint + "sequence")
          .then(response => {
            this.aaSequence = response['data'].split("");
            this.primero = true;
          });
      }
      getSequence();
    },
    /* !!!!! JUSTO DESPUES DE MONTAR VUE.JS EN LA PAGINA !!!!! */
    mounted () {
      /* Pre-cargar las imagenes en el cache del navegador para no hacer el proceso tan demandante */
      Object.keys(this.aaMut).forEach(element => {
        this.imgs[element] = new Image();
        this.imgs[element].src = "IMG/" + this.aaMut[element][1];
      });
    }
  }).mount('#app')