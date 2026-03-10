import InteractiveImage from "./InteractiveImage";
import mural from "/MuralPargos.jpg";
// import mural from "/MuralPargos2x.jpg";

export default function MuralHistoria() {
  const hotspots = [
    {
      id: "pargos",
      titulo: "Las tres islas",
      button: {
        top: "45%",
        left: "75%",
      },
      zoom: {
        amount: 1.2,
        top: "65%",
        left: "85%",
      },
      textBox: {
        top: "40%",
        left: "30%",
        content:
          "Cada uno de estos pargos representan las tres islas que componen el territorio de Tumaco.",
      },
    },
    {
      id: "indigenas",
      titulo: "El pueblo Tumac",
      button: {
        top: "45%",
        left: "50%",
      },
      zoom: {
        amount: 4,
        top: "45%",
        left: "50%",
      },
      textBox: {
        top: "15%",
        left: "10%",
        content:
          "Este es el pueblo Tumac, los primeros pobladores del territorio. ",
      },
    },
    {
      id: "pueblo",
      titulo: "El pueblo Awá",
      button: {
        top: "60%",
        left: "48%",
      },
      zoom: {
        amount: 4,
        top: "60%",
        left: "68%",
      },
      textBox: {
        top: "30%",
        left: "50%",
        content:
          "Este el pueblo Awá, segundos pobladores del territorio. 'Awá' quiere decir gente de la montaña. Para el pueblo Awá el territorio es un espacio de vida que permite mantener el equilibrio con los espíritus y la naturaleza generando un verdadero respeto y armonía espiritual.",
      },
    },
    {
      id: "bandera",
      titulo: "Organización de la Unidad Indígena del Pueblo Awá",
      button: {
        top: "57%",
        left: "32%",
      },
      zoom: {
        amount: 4,
        top: "77%",
        left: "32%",
      },
      textBox: {
        top: "30%",
        left: "20%",
        content:
          "Esta es la bandera de la Organización de la Unidad Indígena del Pueblo Awá, UNIPA. El pueblo Awá está asentado en 32 resguardos en el departamento de Nariño. Son alrededor de 6.000 familias ubicadas en 160 comunidades, para un total de 23.000 personas.",
      },
    },
    {
      id: "piedra",
      titulo: "El Arco del Morro",
      button: {
        top: "40%",
        left: "34%",
      },
      zoom: {
        amount: 4,
        top: "40%",
        left: "74%",
      },
      textBox: {
        top: "30%",
        left: "15%",
        content:
          "Este es el Arco del Morro, maravilla natural representativa de Tumaco.  Es un puente de piedra natural tallado por el agua que se constituyó como uno de los puntos de entrada a la bahía de Tumaco.",
      },
    },
    {
      id: "ola",
      titulo: "El Milagro Eucarístico",
      button: {
        top: "5%",
        left: "37%",
      },
      zoom: {
        amount: 2,
        top: "5%",
        left: "80%",
      },
      textBox: {
        top: "30%",
        left: "10%",
        content:
          "La ola representa el Milagro Eucarístico ocurrido en 1906 en Tumaco, cuando una ola enorme que amenazaba con arrasar el territorio en un tsunami fue detenida por la intercesión de Dios y el párroco de la ciudad, fray Gerardo Larrondo.",
      },
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InteractiveImage
        src={mural}
        hotspots={hotspots}
        mainInfo={{
          title: "Mural de la historia de Tumaco",
          content:
            "El mural relata la historia de la creación de Tumaco, sus pueblos y habitantes así como la representación de sus festividades, eventos y elementos más representativos. Este mural es la puerta de entrada al territorio.",
        }}
      />
    </div>
  );
}
