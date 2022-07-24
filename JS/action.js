const { createApp } = Vue
  createApp({
    data() {
      return {
        primero: false,
        third: false,
        fourth: false,
        isDisabled: false,
        aaSequence: ["G"],
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
        imgs: {},
        image1: "glycine.png",
        image2: "methionine.png",
        mutCode: "",
        aa: 0,
        sel: "M",
        endpoint: "http://127.0.0.1:5000/"
      }
    },
    methods: {
      updateAA() {
        this.mutCode = this.aaSequence[this.aa] + (+this.aa + 1) + this.sel;
      },
      onAA(nam) {
        this.image2 = this.aaMut[nam][1];
        this.sel = nam;
        this.mutCode = this.aaSequence[this.aa] + (+this.aa + 1) + nam;
      },
      run() {
        if ((this.mutCode.length >= 3) && (this.mutCode.length <= 5)) {
          var primera = this.mutCode.slice(0,1);
          var ultima = this.mutCode.slice(-1);
          if (Object.keys(this.aaMut).includes(primera) && Object.keys(this.aaMut).includes(ultima)) {
            var numero = this.mutCode.slice(1,-2);
            if ((+numero >= 1) && (+numero < this.aaSequence.length)) {
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
    beforeMount () {
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
    mounted () {
      Object.keys(this.aaMut).forEach(element => {
        this.imgs[element] = new Image();
        this.imgs[element].src = "IMG/" + this.aaMut[element][1];
      });
    }
  }).mount('#app')